"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  FolderOpen,
  Plus,
  Upload,
  Pencil,
  Trash2,
  Download,
  MoveRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCarpetasEmpresa,
  getArchivosEmpresa,
  getTiposArchivo,
  createCarpetaEmpresa,
  updateCarpetaEmpresa,
  deleteCarpetaEmpresa,
  uploadArchivoEmpresa,
  deleteArchivoEmpresa,
  moverArchivoEmpresa,
  getArchivoDetalleEmpresa,
  downloadFileFromBase64,
} from "@/lib/admin/adminArchivos";
import {
  CarpetaEmpresa,
  ArchivoEmpresa,
  TipoArchivo,
  CarpetaFormValues,
} from "@/types/admin";
import CarpetaFormDialog from "./components/CarpetaFormDialog";
import ArchivoUploadDialog from "./components/ArchivoUploadDialog";
import MoverArchivoDialog from "./components/MoverArchivoDialog";

const ALL = "__all__";

function formatBytes(bytes?: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ArchivosEmpresaPage() {
  const { data: session } = useSession();
  const idEmpresa = session?.user?.idEmpresa ?? "";
  const token = session?.user?.accessToken;

  const [carpetas, setCarpetas] = useState<CarpetaEmpresa[]>([]);
  const [archivos, setArchivos] = useState<ArchivoEmpresa[]>([]);
  const [tiposArchivo, setTiposArchivo] = useState<TipoArchivo[]>([]);
  const [selectedCarpetaId, setSelectedCarpetaId] = useState<string>(ALL);
  const [loading, setLoading] = useState(true);
  const [loadingArchivos, setLoadingArchivos] = useState(false);

  // Carpeta dialog
  const [carpetaDialogOpen, setCarpetaDialogOpen] = useState(false);
  const [editingCarpeta, setEditingCarpeta] = useState<CarpetaEmpresa | null>(null);
  const [submittingCarpeta, setSubmittingCarpeta] = useState(false);

  // Archivo dialogs
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [submittingArchivo, setSubmittingArchivo] = useState(false);
  const [moverDialogOpen, setMoverDialogOpen] = useState(false);
  const [movingArchivo, setMovingArchivo] = useState<ArchivoEmpresa | null>(null);
  const [deletingArchivoId, setDeletingArchivoId] = useState<string | null>(null);
  const [deletingCarpetaId, setDeletingCarpetaId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadCarpetas = async () => {
    if (!idEmpresa) return;
    const res = await getCarpetasEmpresa(idEmpresa, token);
    if (res?.isSuccess) setCarpetas(res.data ?? []);
  };

  const loadArchivos = async (carpetaId?: string) => {
    if (!idEmpresa) return;
    setLoadingArchivos(true);
    const filtro = carpetaId === ALL ? undefined : carpetaId;
    const res = await getArchivosEmpresa(idEmpresa, filtro, token);
    if (res?.isSuccess) setArchivos(res.data ?? []);
    setLoadingArchivos(false);
  };

  useEffect(() => {
    if (!idEmpresa) return;
    const init = async () => {
      setLoading(true);
      const [tiposRes, carpetasRes] = await Promise.all([
        getTiposArchivo(token),
        getCarpetasEmpresa(idEmpresa, token),
      ]);
      if (tiposRes?.isSuccess) setTiposArchivo(tiposRes.data ?? []);
      if (carpetasRes?.isSuccess) setCarpetas(carpetasRes.data ?? []);
      setLoading(false);
    };
    init();
  }, [idEmpresa, token]);

  useEffect(() => {
    if (!idEmpresa) return;
    loadArchivos(selectedCarpetaId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idEmpresa, selectedCarpetaId]);

  const handleCarpetaSubmit = async (data: CarpetaFormValues) => {
    setSubmittingCarpeta(true);
    let res;
    if (editingCarpeta) {
      res = await updateCarpetaEmpresa(editingCarpeta.idCarpetaEmpresa, data, token);
    } else {
      res = await createCarpetaEmpresa(idEmpresa, data, token);
    }
    if (res?.isSuccess) {
      toast.success(editingCarpeta ? "Carpeta actualizada" : "Carpeta creada");
      setCarpetaDialogOpen(false);
      await loadCarpetas();
    } else {
      toast.error(res?.messages?.[0] ?? "Error al guardar carpeta");
    }
    setSubmittingCarpeta(false);
  };

  const handleDeleteCarpeta = async (id: string) => {
    setDeletingCarpetaId(id);
    const res = await deleteCarpetaEmpresa(id, token);
    if (res?.isSuccess) {
      toast.success("Carpeta eliminada");
      if (selectedCarpetaId === id) setSelectedCarpetaId(ALL);
      await loadCarpetas();
    } else {
      toast.error(res?.messages?.[0] ?? "Error al eliminar carpeta");
    }
    setDeletingCarpetaId(null);
  };

  const handleArchivoUpload = async (data: {
    idTipoArchivo: number;
    nombreArchivo: string;
    extension?: string;
    contentType?: string;
    idCarpetaEmpresa?: string;
    archivoBase64: string;
  }) => {
    setSubmittingArchivo(true);
    const res = await uploadArchivoEmpresa(idEmpresa, data, token);
    if (res?.isSuccess) {
      toast.success("Archivo subido exitosamente");
      setUploadDialogOpen(false);
      await loadArchivos(selectedCarpetaId);
    } else {
      toast.error(res?.messages?.[0] ?? "Error al subir archivo");
    }
    setSubmittingArchivo(false);
  };

  const handleDeleteArchivo = async (id: string) => {
    setDeletingArchivoId(id);
    const res = await deleteArchivoEmpresa(id, token);
    if (res?.isSuccess) {
      toast.success("Archivo eliminado");
      setArchivos((prev) => prev.filter((a) => a.idArchivoEmpresa !== id));
    } else {
      toast.error(res?.messages?.[0] ?? "Error al eliminar archivo");
    }
    setDeletingArchivoId(null);
  };

  const handleMoverArchivo = async (idCarpetaDestino: string | null) => {
    if (!movingArchivo) return;
    const res = await moverArchivoEmpresa(movingArchivo.idArchivoEmpresa, idCarpetaDestino, token);
    if (res?.isSuccess) {
      toast.success("Archivo movido");
      setMoverDialogOpen(false);
      await loadArchivos(selectedCarpetaId);
    } else {
      toast.error(res?.messages?.[0] ?? "Error al mover archivo");
    }
  };

  const handleDownload = async (archivo: ArchivoEmpresa) => {
    setDownloadingId(archivo.idArchivoEmpresa);
    const res = await getArchivoDetalleEmpresa(archivo.idArchivoEmpresa, token);
    if (res?.isSuccess && res.data) {
      downloadFileFromBase64(res.data.archivo, res.data.nombreArchivo, res.data.contentType);
    } else {
      toast.error("Error al descargar archivo");
    }
    setDownloadingId(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 mb-8">
        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold text-gray-900">Mis Archivos</h1>
        </div>
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  const parentMap = Object.fromEntries(carpetas.map((c) => [c.idCarpetaEmpresa, c.nombreCarpeta]));

  return (
    <div className="container mx-auto px-6 mb-8 space-y-6">
      <div className="mb-2 mt-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Archivos</h1>
        <p className="text-gray-500">Organiza y gestiona los documentos de tu empresa.</p>
      </div>

      {/* Carpetas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-yellow-500" />
            Carpetas
          </h2>
          <Button
            size="sm"
            onClick={() => { setEditingCarpeta(null); setCarpetaDialogOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nueva Carpeta
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider">Nombre</th>
                <th className="py-4 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider">Descripción</th>
                <th className="py-4 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider">Carpeta Padre</th>
                <th className="py-4 px-4 text-right text-xs text-primary font-bold uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {carpetas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400 text-sm">
                    No hay carpetas creadas aún.
                  </td>
                </tr>
              ) : (
                carpetas.map((c) => (
                  <tr key={c.idCarpetaEmpresa} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2 font-medium text-gray-900">
                        <FolderOpen className="w-4 h-4 text-yellow-500 shrink-0" />
                        {c.nombreCarpeta}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{c.descripcion ?? "—"}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {c.idCarpetaPadre ? parentMap[c.idCarpetaPadre] ?? "—" : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => { setEditingCarpeta(c); setCarpetaDialogOpen(true); }}
                          className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCarpeta(c.idCarpetaEmpresa)}
                          disabled={deletingCarpetaId === c.idCarpetaEmpresa}
                          className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archivos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Archivos
          </h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {carpetas.length > 0 && (
              <Select value={selectedCarpetaId} onValueChange={setSelectedCarpetaId}>
                <SelectTrigger className="w-48 bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos los archivos</SelectItem>
                  {carpetas.map((c) => (
                    <SelectItem key={c.idCarpetaEmpresa} value={c.idCarpetaEmpresa}>
                      {c.nombreCarpeta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              size="sm"
              onClick={() => setUploadDialogOpen(true)}
            >
              <Upload className="w-4 h-4 mr-1" />
              Subir Archivo
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider">Nombre</th>
                <th className="py-4 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider">Tipo</th>
                <th className="py-4 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider">Tamaño</th>
                <th className="py-4 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider">Carpeta</th>
                <th className="py-4 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider">Fecha</th>
                <th className="py-4 px-4 text-right text-xs text-primary font-bold uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingArchivos ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400 text-sm">
                    Cargando archivos...
                  </td>
                </tr>
              ) : archivos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400 text-sm">
                    No hay archivos en esta carpeta.
                  </td>
                </tr>
              ) : (
                archivos.map((a) => (
                  <tr key={a.idArchivoEmpresa} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2 font-medium text-gray-900 text-sm">
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                        {a.nombreArchivo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{a.tipoArchivo}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatBytes(a.tamanoBytes)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {a.idCarpetaEmpresa ? (parentMap[a.idCarpetaEmpresa] ?? "—") : "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{a.fechaCarga}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownload(a)}
                          disabled={downloadingId === a.idArchivoEmpresa}
                          className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Descargar"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => { setMovingArchivo(a); setMoverDialogOpen(true); }}
                          className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors"
                          title="Mover"
                        >
                          <MoveRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteArchivo(a.idArchivoEmpresa)}
                          disabled={deletingArchivoId === a.idArchivoEmpresa}
                          className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CarpetaFormDialog
        open={carpetaDialogOpen}
        onOpenChange={setCarpetaDialogOpen}
        carpeta={editingCarpeta}
        carpetas={carpetas}
        onSubmit={handleCarpetaSubmit}
        isSubmitting={submittingCarpeta}
      />

      <ArchivoUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        carpetas={carpetas}
        tiposArchivo={tiposArchivo}
        defaultCarpetaId={selectedCarpetaId !== ALL ? selectedCarpetaId : null}
        onSubmit={handleArchivoUpload}
        isSubmitting={submittingArchivo}
      />

      <MoverArchivoDialog
        open={moverDialogOpen}
        onOpenChange={setMoverDialogOpen}
        archivo={movingArchivo}
        carpetas={carpetas}
        onSubmit={handleMoverArchivo}
        isSubmitting={false}
      />
    </div>
  );
}
