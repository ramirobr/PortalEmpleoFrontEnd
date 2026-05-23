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
import { PremiumButton } from "@/components/shared/components/PremiumButton";
import { ActionButton } from "@/components/shared/components/ActionButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCarpetasUsuario,
  getArchivosUsuario,
  getTiposArchivo,
  createCarpetaUsuario,
  updateCarpetaUsuario,
  deleteCarpetaUsuario,
  uploadArchivoUsuario,
  deleteArchivoUsuario,
  moverArchivoUsuario,
  getArchivoDetalleUsuario,
  downloadFileFromBase64,
} from "@/lib/admin/adminArchivos";
import {
  CarpetaUsuario,
  ArchivoUsuario,
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

export default function ArchivosPage() {
  const { data: session } = useSession();
  const idUsuario = session?.user?.id ?? "";
  const token = session?.user?.accessToken;

  const [dataState, setDataState] = useState({
    carpetas: [] as CarpetaUsuario[],
    tiposArchivo: [] as TipoArchivo[],
    loading: true,
  });
  const { carpetas, tiposArchivo, loading } = dataState;

  const setCarpetas = (val: CarpetaUsuario[] | ((prev: CarpetaUsuario[]) => CarpetaUsuario[])) => {
    setDataState(prev => ({
      ...prev,
      carpetas: typeof val === 'function' ? (val as Function)(prev.carpetas) : val
    }));
  };
  const setTiposArchivo = (val: TipoArchivo[] | ((prev: TipoArchivo[]) => TipoArchivo[])) => {
    setDataState(prev => ({
      ...prev,
      tiposArchivo: typeof val === 'function' ? (val as Function)(prev.tiposArchivo) : val
    }));
  };
  const setLoading = (val: boolean | ((prev: boolean) => boolean)) => {
    setDataState(prev => ({
      ...prev,
      loading: typeof val === 'function' ? (val as Function)(prev.loading) : val
    }));
  };

  const [archivos, setArchivos] = useState<ArchivoUsuario[]>([]);
  const [selectedCarpetaId, setSelectedCarpetaId] = useState<string>(ALL);
  const [loadingArchivos, setLoadingArchivos] = useState(false);

  // Carpeta dialog
  const [carpetaDialogOpen, setCarpetaDialogOpen] = useState(false);
  const [editingCarpeta, setEditingCarpeta] = useState<CarpetaUsuario | null>(
    null,
  );
  const [submittingCarpeta, setSubmittingCarpeta] = useState(false);

  // Archivo dialogs
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [submittingArchivo, setSubmittingArchivo] = useState(false);
  const [moverDialogOpen, setMoverDialogOpen] = useState(false);
  const [movingArchivo, setMovingArchivo] = useState<ArchivoUsuario | null>(
    null,
  );
  const [deletingArchivoId, setDeletingArchivoId] = useState<string | null>(
    null,
  );
  const [deletingCarpetaId, setDeletingCarpetaId] = useState<string | null>(
    null,
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadCarpetas = async () => {
    if (!idUsuario) return;
    const res = await getCarpetasUsuario(idUsuario, token);
    if (res?.isSuccess) setCarpetas(res.data ?? []);
  };

  const loadArchivos = async (carpetaId?: string) => {
    if (!idUsuario) return;
    setLoadingArchivos(true);
    const filtro = carpetaId === ALL ? undefined : carpetaId;
    const res = await getArchivosUsuario(idUsuario, filtro, token);
    if (res?.isSuccess) setArchivos(res.data ?? []);
    setLoadingArchivos(false);
  };

  useEffect(() => {
    if (!idUsuario) return;
    const init = async () => {
      setDataState(prev => ({ ...prev, loading: true }));
      const [tiposRes, carpetasRes] = await Promise.all([
        getTiposArchivo(token),
        getCarpetasUsuario(idUsuario, token),
      ]);
      setDataState(prev => ({
        ...prev,
        tiposArchivo: tiposRes?.isSuccess ? (tiposRes.data ?? []) : prev.tiposArchivo,
        carpetas: carpetasRes?.isSuccess ? (carpetasRes.data ?? []) : prev.carpetas,
        loading: false
      }));
    };
    init();
  }, [idUsuario, token]);

  useEffect(() => {
    if (!idUsuario) return;
    loadArchivos(selectedCarpetaId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUsuario, selectedCarpetaId]);

  const handleCarpetaSubmit = async (data: CarpetaFormValues) => {
    setSubmittingCarpeta(true);
    let res;
    if (editingCarpeta) {
      res = await updateCarpetaUsuario(
        editingCarpeta.idCarpetaUsuario,
        data,
        token,
      );
    } else {
      res = await createCarpetaUsuario(idUsuario, data, token);
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
    const res = await deleteCarpetaUsuario(id, token);
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
    idCarpetaUsuario?: string;
    archivoBase64: string;
  }) => {
    setSubmittingArchivo(true);
    const res = await uploadArchivoUsuario(idUsuario, data, token);
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
    const res = await deleteArchivoUsuario(id, token);
    if (res?.isSuccess) {
      toast.success("Archivo eliminado");
      setArchivos((prev) => prev.filter((a) => a.idArchivoUsuario !== id));
    } else {
      toast.error(res?.messages?.[0] ?? "Error al eliminar archivo");
    }
    setDeletingArchivoId(null);
  };

  const handleMoverArchivo = async (idCarpetaDestino: string | null) => {
    if (!movingArchivo) return;
    const res = await moverArchivoUsuario(
      movingArchivo.idArchivoUsuario,
      idCarpetaDestino,
      token,
    );
    if (res?.isSuccess) {
      toast.success("Archivo movido");
      setMoverDialogOpen(false);
      await loadArchivos(selectedCarpetaId);
    } else {
      toast.error(res?.messages?.[0] ?? "Error al mover archivo");
    }
  };

  const handleDownload = async (archivo: ArchivoUsuario) => {
    setDownloadingId(archivo.idArchivoUsuario);
    const res = await getArchivoDetalleUsuario(archivo.idArchivoUsuario, token);
    if (res?.isSuccess && res.data) {
      downloadFileFromBase64(
        res.data.archivo,
        res.data.nombreArchivo,
        res.data.contentType,
      );
    } else {
      toast.error("Error al descargar archivo");
    }
    setDownloadingId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8 pt-10">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Mis Archivos</h1>
        </div>
        <p className="text-slate-500">Cargando…</p>
      </div>
    );
  }

  const parentMap = Object.fromEntries(
    carpetas.map((c) => [c.idCarpetaUsuario, c.nombreCarpeta]),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Mis Archivos</h1>
        <p className="text-slate-500 mt-1">
          Organiza y gestiona tus documentos personales.
        </p>
      </div>

      {/* Carpetas */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FolderOpen className="size-5 text-yellow-500" />
            Carpetas
          </h2>
          <PremiumButton
            size="sm"
            onClick={() => {
              setEditingCarpeta(null);
              setCarpetaDialogOpen(true);
            }}
            icon={<Plus />}
          >
            Nueva Carpeta
          </PremiumButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="p-4 text-left text-xs text-primary font-bold uppercase tracking-wider">
                  Nombre
                </th>
                <th className="p-4 text-left text-xs text-primary font-bold uppercase tracking-wider">
                  Descripción
                </th>
                <th className="p-4 text-left text-xs text-primary font-bold uppercase tracking-wider">
                  Carpeta Padre
                </th>
                <th className="p-4 text-center text-xs text-primary font-bold uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {carpetas.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-400 text-sm"
                  >
                    No hay carpetas creadas aún.
                  </td>
                </tr>
              ) : (
                carpetas.map((c) => (
                  <tr
                    key={c.idCarpetaUsuario}
                    className="hover:bg-zinc-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2 font-medium text-slate-900">
                        <FolderOpen className="size-4 text-yellow-500 shrink-0" />
                        {c.nombreCarpeta}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {c.descripcion ?? "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {c.idCarpetaPadre
                        ? (parentMap[c.idCarpetaPadre] ?? "—")
                        : "—"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ActionButton
                          onClick={() => {
                            setEditingCarpeta(c);
                            setCarpetaDialogOpen(true);
                          }}
                          icon={<Pencil />}
                          title="Editar"
                        />
                        <ActionButton
                          onClick={() =>
                            handleDeleteCarpeta(c.idCarpetaUsuario)
                          }
                          disabled={deletingCarpetaId === c.idCarpetaUsuario}
                          isLoading={deletingCarpetaId === c.idCarpetaUsuario}
                          variant="danger"
                          icon={<Trash2 />}
                          title="Eliminar"
                        />
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
      <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Archivos
          </h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {carpetas.length > 0 && (
              <Select
                value={selectedCarpetaId}
                onValueChange={setSelectedCarpetaId}
              >
                <SelectTrigger className="w-48 bg-zinc-50 border-zinc-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos los archivos</SelectItem>
                  {carpetas.map((c) => (
                    <SelectItem
                      key={c.idCarpetaUsuario}
                      value={c.idCarpetaUsuario}
                    >
                      {c.nombreCarpeta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <PremiumButton
              size="sm"
              onClick={() => setUploadDialogOpen(true)}
              icon={<Upload />}
            >
              Subir Archivo
            </PremiumButton>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="p-4 text-left text-xs text-primary font-bold uppercase tracking-wider">
                  Nombre
                </th>
                <th className="p-4 text-left text-xs text-primary font-bold uppercase tracking-wider">
                  Tipo
                </th>
                <th className="p-4 text-left text-xs text-primary font-bold uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="p-4 text-left text-xs text-primary font-bold uppercase tracking-wider">
                  Carpeta
                </th>
                <th className="p-4 text-left text-xs text-primary font-bold uppercase tracking-wider">
                  Fecha
                </th>
                <th className="p-4 text-center text-xs text-primary font-bold uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loadingArchivos ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-slate-400 text-sm"
                  >
                    Cargando archivos…
                  </td>
                </tr>
              ) : archivos.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-slate-400 text-sm"
                  >
                    No hay archivos en esta carpeta.
                  </td>
                </tr>
              ) : (
                archivos.map((a) => (
                  <tr
                    key={a.idArchivoUsuario}
                    className="hover:bg-zinc-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2 font-medium text-slate-900 text-sm">
                        <FileText className="size-4 text-primary shrink-0" />
                        {a.nombreArchivo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {a.tipoArchivo}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {formatBytes(a.tamanoBytes)}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {a.idCarpetaUsuario
                        ? (parentMap[a.idCarpetaUsuario] ?? "—")
                        : "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {a.fechaCarga}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ActionButton
                          onClick={() => handleDownload(a)}
                          disabled={downloadingId === a.idArchivoUsuario}
                          isLoading={downloadingId === a.idArchivoUsuario}
                          icon={<Download />}
                          title="Descargar"
                        />
                        <ActionButton
                          onClick={() => {
                            setMovingArchivo(a);
                            setMoverDialogOpen(true);
                          }}
                          icon={<MoveRight />}
                          title="Mover"
                        />
                        <ActionButton
                          onClick={() =>
                            handleDeleteArchivo(a.idArchivoUsuario)
                          }
                          disabled={deletingArchivoId === a.idArchivoUsuario}
                          isLoading={deletingArchivoId === a.idArchivoUsuario}
                          variant="danger"
                          icon={<Trash2 />}
                          title="Eliminar"
                        />
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
