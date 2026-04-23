"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Building2,
  FolderOpen,
  FileText,
  Plus,
  Upload,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  AdminEmpresa,
  CarpetaEmpresa,
  ArchivoEmpresa,
  TipoArchivo,
  CarpetaFormValues,
} from "@/types/admin";
import { getAdminEmpresas } from "@/lib/admin/adminEmpresas";
import {
  getTiposArchivo,
  getCarpetasEmpresa,
  createCarpetaEmpresa,
  updateCarpetaEmpresa,
  deleteCarpetaEmpresa,
  getArchivosEmpresa,
  getArchivoDetalleEmpresa,
  uploadArchivoEmpresa,
  deleteArchivoEmpresa,
  moverArchivoEmpresa,
  downloadFileFromBase64,
} from "@/lib/admin/adminArchivos";
import CarpetasEmpresaTable from "./components/CarpetasEmpresaTable";
import ArchivosEmpresaTable from "./components/ArchivosEmpresaTable";
import CarpetaEmpresaFormDialog from "./components/CarpetaEmpresaFormDialog";
import ArchivoEmpresaUploadDialog from "./components/ArchivoEmpresaUploadDialog";
import MoverArchivoEmpresaDialog from "./components/MoverArchivoEmpresaDialog";

const NO_FOLDER = "__root__";

export default function AdminArchivosEmpresaPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  // Empresa selector
  const [empresas, setEmpresas] = useState<AdminEmpresa[]>([]);
  const [empresaSearch, setEmpresaSearch] = useState("");
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>("");

  // Data
  const [tiposArchivo, setTiposArchivo] = useState<TipoArchivo[]>([]);
  const [carpetas, setCarpetas] = useState<CarpetaEmpresa[]>([]);
  const [archivos, setArchivos] = useState<ArchivoEmpresa[]>([]);
  const [selectedCarpetaId, setSelectedCarpetaId] = useState<string>(NO_FOLDER);

  // Loading
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingCarpetas, setLoadingCarpetas] = useState(false);
  const [loadingArchivos, setLoadingArchivos] = useState(false);

  // Dialogs
  const [isCarpetaFormOpen, setIsCarpetaFormOpen] = useState(false);
  const [editingCarpeta, setEditingCarpeta] = useState<CarpetaEmpresa | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMoverOpen, setIsMoverOpen] = useState(false);
  const [movingArchivo, setMovingArchivo] = useState<ArchivoEmpresa | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial data
  useEffect(() => {
    if (!token) return;
    const load = async () => {
      setLoadingEmpresas(true);
      const [empRes, tiposRes] = await Promise.all([
        getAdminEmpresas(
          { pageSize: 200, currentPage: 1, sortBy: "nombre", sortDirection: "asc" },
          token,
        ),
        getTiposArchivo(token),
      ]);
      if (empRes?.isSuccess && empRes.data) {
        setEmpresas(empRes.data.data);
      }
      if (tiposRes?.isSuccess && tiposRes.data) {
        setTiposArchivo(tiposRes.data);
      }
      setLoadingEmpresas(false);
    };
    load();
  }, [token]);

  // Load carpetas & archivos when empresa changes
  useEffect(() => {
    if (!token || !selectedEmpresaId) return;
    const load = async () => {
      setLoadingCarpetas(true);
      setLoadingArchivos(true);
      setCarpetas([]);
      setArchivos([]);
      setSelectedCarpetaId(NO_FOLDER);

      const [carpRes, archRes] = await Promise.all([
        getCarpetasEmpresa(selectedEmpresaId, token),
        getArchivosEmpresa(selectedEmpresaId, null, token),
      ]);
      if (carpRes?.isSuccess && carpRes.data) {
        setCarpetas(carpRes.data);
      } else if (carpRes && !carpRes.isSuccess) {
        toast.error("Error al cargar las carpetas");
      }
      if (archRes?.isSuccess && archRes.data) {
        setArchivos(archRes.data);
      } else if (archRes && !archRes.isSuccess) {
        toast.error("Error al cargar los archivos");
      }
      setLoadingCarpetas(false);
      setLoadingArchivos(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmpresaId, token]);

  // Load archivos when carpeta changes
  const fetchArchivos = async (carpetaId: string) => {
    if (!token || !selectedEmpresaId) return;
    setLoadingArchivos(true);
    const res = await getArchivosEmpresa(
      selectedEmpresaId,
      carpetaId === NO_FOLDER ? null : carpetaId,
      token,
    );
    if (res?.isSuccess && res.data) {
      setArchivos(res.data);
    } else if (res && !res.isSuccess) {
      toast.error("Error al cargar los archivos");
    }
    setLoadingArchivos(false);
  };

  const handleCarpetaFilterChange = (val: string) => {
    setSelectedCarpetaId(val);
    fetchArchivos(val);
  };

  // ── Carpetas CRUD ────────────────────────────────────────────────────────────

  const handleCreateCarpeta = () => {
    setEditingCarpeta(null);
    setIsCarpetaFormOpen(true);
  };

  const handleEditCarpeta = (carpeta: CarpetaEmpresa) => {
    setEditingCarpeta(carpeta);
    setIsCarpetaFormOpen(true);
  };

  const handleDeleteCarpeta = async (idCarpeta: string) => {
    if (!token) return;
    const res = await deleteCarpetaEmpresa(idCarpeta, token);
    if (res?.isSuccess) {
      setCarpetas((prev) =>
        prev.filter((c) => c.idCarpetaEmpresa !== idCarpeta),
      );
      toast.success("Carpeta eliminada correctamente");
    } else {
      toast.error(res?.messages?.[0] ?? "No se pudo eliminar la carpeta");
    }
  };

  const handleCarpetaFormSubmit = async (data: CarpetaFormValues) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      if (editingCarpeta) {
        const res = await updateCarpetaEmpresa(
          editingCarpeta.idCarpetaEmpresa,
          data,
          token,
        );
        if (res?.isSuccess) {
          setCarpetas((prev) =>
            prev.map((c) =>
              c.idCarpetaEmpresa === editingCarpeta.idCarpetaEmpresa
                ? { ...c, nombreCarpeta: data.nombreCarpeta, descripcion: data.descripcion }
                : c,
            ),
          );
          toast.success("Carpeta actualizada correctamente");
          setIsCarpetaFormOpen(false);
          setEditingCarpeta(null);
        } else {
          toast.error(res?.messages?.[0] ?? "No se pudo actualizar la carpeta");
        }
      } else {
        const res = await createCarpetaEmpresa(selectedEmpresaId, data, token);
        if (res?.isSuccess) {
          const updated = await getCarpetasEmpresa(selectedEmpresaId, token);
          if (updated?.isSuccess && updated.data) setCarpetas(updated.data);
          toast.success("Carpeta creada correctamente");
          setIsCarpetaFormOpen(false);
        } else {
          toast.error(res?.messages?.[0] ?? "No se pudo crear la carpeta");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Archivos CRUD ────────────────────────────────────────────────────────────

  const handleDownload = async (idArchivo: string) => {
    if (!token) return;
    const res = await getArchivoDetalleEmpresa(idArchivo, token);
    if (res?.isSuccess && res.data) {
      downloadFileFromBase64(
        res.data.archivo,
        res.data.nombreArchivo,
        res.data.contentType,
      );
    } else {
      toast.error("No se pudo descargar el archivo");
    }
  };

  const handleMover = (archivo: ArchivoEmpresa) => {
    setMovingArchivo(archivo);
    setIsMoverOpen(true);
  };

  const handleMoverSubmit = async (idCarpetaDestino: string | null) => {
    if (!token || !movingArchivo) return;
    setIsSubmitting(true);
    try {
      const res = await moverArchivoEmpresa(
        movingArchivo.idArchivoEmpresa,
        idCarpetaDestino,
        token,
      );
      if (res?.isSuccess) {
        toast.success("Archivo movido correctamente");
        setIsMoverOpen(false);
        setMovingArchivo(null);
        await fetchArchivos(selectedCarpetaId);
      } else {
        toast.error(res?.messages?.[0] ?? "No se pudo mover el archivo");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArchivo = async (idArchivo: string) => {
    if (!token) return;
    const res = await deleteArchivoEmpresa(idArchivo, token);
    if (res?.isSuccess) {
      setArchivos((prev) =>
        prev.filter((a) => a.idArchivoEmpresa !== idArchivo),
      );
      toast.success("Archivo eliminado correctamente");
    } else {
      toast.error(res?.messages?.[0] ?? "No se pudo eliminar el archivo");
    }
  };

  const handleUploadSubmit = async (data: {
    idTipoArchivo: number;
    nombreArchivo: string;
    extension?: string;
    contentType?: string;
    idCarpetaEmpresa?: string;
    archivoBase64: string;
  }) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const res = await uploadArchivoEmpresa(selectedEmpresaId, data, token);
      if (res?.isSuccess) {
        toast.success("Archivo subido correctamente");
        setIsUploadOpen(false);
        await fetchArchivos(selectedCarpetaId);
      } else {
        toast.error(res?.messages?.[0] ?? "No se pudo subir el archivo");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEmpresa = empresas.find(
    (e) => e.idEmpresa === selectedEmpresaId,
  );

  const filteredEmpresas = empresaSearch
    ? empresas.filter((e) =>
        e.nombreEmpresa.toLowerCase().includes(empresaSearch.toLowerCase()),
      )
    : empresas;

  return (
    <div>
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
        <Building2 className="w-8 h-8 text-primary" />
        Archivos de Empresas
      </h1>

      {/* Empresa selector */}
      <Card className="mb-6 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Seleccionar Empresa
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar empresa..."
              value={empresaSearch}
              onChange={(e) => setEmpresaSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedEmpresaId}
            onValueChange={setSelectedEmpresaId}
          >
            <SelectTrigger className="md:w-80">
              <SelectValue
                placeholder={
                  loadingEmpresas
                    ? "Cargando empresas..."
                    : "Selecciona una empresa"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredEmpresas.map((e) => (
                <SelectItem key={e.idEmpresa} value={e.idEmpresa}>
                  {e.nombreEmpresa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedEmpresa && (
          <p className="text-sm text-gray-500 mt-2">
            RUC/NIT:{" "}
            <span className="font-medium">{selectedEmpresa.numeroDocumento}</span>
            {" · "}Plan:{" "}
            <span className="font-medium">{selectedEmpresa.plan}</span>
          </p>
        )}
      </Card>

      {selectedEmpresaId && (
        <>
          {/* CARPETAS */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-yellow-600" />
                Carpetas
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateCarpeta}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Carpeta
              </Button>
            </div>
            <Card className="overflow-hidden">
              <CarpetasEmpresaTable
                carpetas={carpetas}
                loading={loadingCarpetas}
                onEdit={handleEditCarpeta}
                onDelete={handleDeleteCarpeta}
              />
            </Card>
          </div>

          {/* ARCHIVOS */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Archivos
              </h2>
              <Button
                size="sm"
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Subir Archivo
              </Button>
            </div>

            {/* Folder filter */}
            <Card className="mb-3 p-4">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-4 h-4 text-gray-400 shrink-0" />
                <Select
                  value={selectedCarpetaId}
                  onValueChange={handleCarpetaFilterChange}
                >
                  <SelectTrigger className="w-72">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_FOLDER}>
                      Raíz (archivos sin carpeta)
                    </SelectItem>
                    {carpetas.map((c) => (
                      <SelectItem
                        key={c.idCarpetaEmpresa}
                        value={c.idCarpetaEmpresa}
                      >
                        {c.nombreCarpeta}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <ArchivosEmpresaTable
                archivos={archivos}
                carpetas={carpetas}
                loading={loadingArchivos}
                onDownload={handleDownload}
                onMover={handleMover}
                onDelete={handleDeleteArchivo}
              />
            </Card>
          </div>
        </>
      )}

      {/* Dialogs */}
      <CarpetaEmpresaFormDialog
        open={isCarpetaFormOpen}
        onOpenChange={setIsCarpetaFormOpen}
        carpeta={editingCarpeta}
        carpetas={carpetas}
        onSubmit={handleCarpetaFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ArchivoEmpresaUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        carpetas={carpetas}
        tiposArchivo={tiposArchivo}
        defaultCarpetaId={
          selectedCarpetaId === NO_FOLDER ? null : selectedCarpetaId
        }
        onSubmit={handleUploadSubmit}
        isSubmitting={isSubmitting}
      />

      <MoverArchivoEmpresaDialog
        open={isMoverOpen}
        onOpenChange={setIsMoverOpen}
        archivo={movingArchivo}
        carpetas={carpetas}
        onSubmit={handleMoverSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
