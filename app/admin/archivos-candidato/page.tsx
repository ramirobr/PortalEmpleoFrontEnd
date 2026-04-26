"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FolderOpen, FileText, Plus, Upload, Search } from "lucide-react";
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
  AdminCandidato,
  CarpetaUsuario,
  ArchivoUsuario,
  TipoArchivo,
  CarpetaFormValues,
} from "@/types/admin";
import { getAdminCandidatos } from "@/lib/admin/adminCandidatos";
import {
  getTiposArchivo,
  getCarpetasUsuario,
  createCarpetaUsuario,
  updateCarpetaUsuario,
  deleteCarpetaUsuario,
  getArchivosUsuario,
  getArchivoDetalleUsuario,
  uploadArchivoUsuario,
  deleteArchivoUsuario,
  moverArchivoUsuario,
  downloadFileFromBase64,
} from "@/lib/admin/adminArchivos";
import CarpetasCandidatoTable from "./components/CarpetasCandidatoTable";
import ArchivosCandidatoTable from "./components/ArchivosCandidatoTable";
import CarpetaCandidatoFormDialog from "./components/CarpetaCandidatoFormDialog";
import ArchivoUploadCandidatoDialog from "./components/ArchivoUploadCandidatoDialog";
import MoverArchivoCandidatoDialog from "./components/MoverArchivoCandidatoDialog";

const NO_FOLDER = "__root__";

export default function AdminArchivosCandidatoPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  // Candidato selector
  const [candidatos, setCandidatos] = useState<AdminCandidato[]>([]);
  const [candidatoSearch, setCandidatoSearch] = useState("");
  const [selectedCandidatoId, setSelectedCandidatoId] = useState<string>("");

  // Data
  const [tiposArchivo, setTiposArchivo] = useState<TipoArchivo[]>([]);
  const [carpetas, setCarpetas] = useState<CarpetaUsuario[]>([]);
  const [archivos, setArchivos] = useState<ArchivoUsuario[]>([]);
  const [selectedCarpetaId, setSelectedCarpetaId] = useState<string>(NO_FOLDER);

  // Loading
  const [loadingCandidatos, setLoadingCandidatos] = useState(false);
  const [loadingCarpetas, setLoadingCarpetas] = useState(false);
  const [loadingArchivos, setLoadingArchivos] = useState(false);

  // Dialogs
  const [isCarpetaFormOpen, setIsCarpetaFormOpen] = useState(false);
  const [editingCarpeta, setEditingCarpeta] = useState<CarpetaUsuario | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMoverOpen, setIsMoverOpen] = useState(false);
  const [movingArchivo, setMovingArchivo] = useState<ArchivoUsuario | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial data
  useEffect(() => {
    if (!token) return;
    const load = async () => {
      setLoadingCandidatos(true);
      const [candRes, tiposRes] = await Promise.all([
        getAdminCandidatos({ pageSize: 200, currentPage: 1 }, token),
        getTiposArchivo(token),
      ]);
      if (candRes?.isSuccess && candRes.data) {
        setCandidatos(candRes.data.data);
      }
      if (tiposRes?.isSuccess && tiposRes.data) {
        setTiposArchivo(tiposRes.data);
      }
      setLoadingCandidatos(false);
    };
    load();
  }, [token]);

  // Load carpetas & archivos when candidato changes
  useEffect(() => {
    if (!token || !selectedCandidatoId) return;
    const load = async () => {
      setLoadingCarpetas(true);
      setLoadingArchivos(true);
      setCarpetas([]);
      setArchivos([]);
      setSelectedCarpetaId(NO_FOLDER);

      const [carpRes, archRes] = await Promise.all([
        getCarpetasUsuario(selectedCandidatoId, token),
        getArchivosUsuario(selectedCandidatoId, null, token),
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
  }, [selectedCandidatoId, token]);

  const fetchArchivos = async (carpetaId: string) => {
    if (!token || !selectedCandidatoId) return;
    setLoadingArchivos(true);
    const res = await getArchivosUsuario(
      selectedCandidatoId,
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

  const handleEditCarpeta = (carpeta: CarpetaUsuario) => {
    setEditingCarpeta(carpeta);
    setIsCarpetaFormOpen(true);
  };

  const handleDeleteCarpeta = async (idCarpeta: string) => {
    if (!token) return;
    const res = await deleteCarpetaUsuario(idCarpeta, token);
    if (res?.isSuccess) {
      setCarpetas((prev) =>
        prev.filter((c) => c.idCarpetaUsuario !== idCarpeta),
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
        const res = await updateCarpetaUsuario(
          editingCarpeta.idCarpetaUsuario,
          data,
          token,
        );
        if (res?.isSuccess) {
          setCarpetas((prev) =>
            prev.map((c) =>
              c.idCarpetaUsuario === editingCarpeta.idCarpetaUsuario
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
        const res = await createCarpetaUsuario(selectedCandidatoId, data, token);
        if (res?.isSuccess) {
          const updated = await getCarpetasUsuario(selectedCandidatoId, token);
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
    const res = await getArchivoDetalleUsuario(idArchivo, token);
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

  const handleMover = (archivo: ArchivoUsuario) => {
    setMovingArchivo(archivo);
    setIsMoverOpen(true);
  };

  const handleMoverSubmit = async (idCarpetaDestino: string | null) => {
    if (!token || !movingArchivo) return;
    setIsSubmitting(true);
    try {
      const res = await moverArchivoUsuario(
        movingArchivo.idArchivoUsuario,
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
    const res = await deleteArchivoUsuario(idArchivo, token);
    if (res?.isSuccess) {
      setArchivos((prev) =>
        prev.filter((a) => a.idArchivoUsuario !== idArchivo),
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
    idCarpetaUsuario?: string;
    archivoBase64: string;
  }) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const res = await uploadArchivoUsuario(selectedCandidatoId, data, token);
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

  const selectedCandidato = candidatos.find(
    (c) => c.idUsuario === selectedCandidatoId,
  );

  const filteredCandidatos = candidatoSearch
    ? candidatos.filter((c) =>
        c.nombreCompleto.toLowerCase().includes(candidatoSearch.toLowerCase()),
      )
    : candidatos;

  return (
    <div>
      <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 text-primary"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        Archivos de Candidatos
      </h1>

      {/* Candidato selector */}
      <Card className="mb-6 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Seleccionar Candidato
        </h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar candidato..."
              value={candidatoSearch}
              onChange={(e) => setCandidatoSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedCandidatoId}
            onValueChange={setSelectedCandidatoId}
          >
            <SelectTrigger className="lg:w-80">
              <SelectValue
                placeholder={
                  loadingCandidatos
                    ? "Cargando candidatos..."
                    : "Selecciona un candidato"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredCandidatos.map((c) => (
                <SelectItem key={c.idUsuario} value={c.idUsuario}>
                  {c.nombreCompleto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedCandidato && (
          <p className="text-sm text-gray-500 mt-2">
            Email:{" "}
            <span className="font-medium">{selectedCandidato.email}</span>
            {" · "}Estado:{" "}
            <span className="font-medium">{selectedCandidato.estado.nombre}</span>
          </p>
        )}
      </Card>

      {selectedCandidatoId && (
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
              <CarpetasCandidatoTable
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
                        key={c.idCarpetaUsuario}
                        value={c.idCarpetaUsuario}
                      >
                        {c.nombreCarpeta}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <ArchivosCandidatoTable
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
      <CarpetaCandidatoFormDialog
        open={isCarpetaFormOpen}
        onOpenChange={setIsCarpetaFormOpen}
        carpeta={editingCarpeta}
        carpetas={carpetas}
        onSubmit={handleCarpetaFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ArchivoUploadCandidatoDialog
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

      <MoverArchivoCandidatoDialog
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
