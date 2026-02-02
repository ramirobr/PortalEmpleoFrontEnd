"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { PostulacionItem } from "@/types/company";
import TablePagination from "@/components/shared/components/TablePagination";
import UserAvatar from "@/components/shared/components/UserAvatar";
import Pill from "@/components/shared/components/Pill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, MapPinIcon } from "@/components/shared/icons/Icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/apiClient";
import type { CatalogsByType } from "@/types/search";
import {
  fetchAplicacionesByEmpresa,
  updateAplicacionEstado,
} from "@/lib/company/applications";
import { fetchMisOfertasEmpleo } from "@/lib/company/misOfertas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_SIZE = 10;

function formatFecha(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostulacionesList() {
  const { data: session } = useSession();
  const [postulaciones, setPostulaciones] = useState<PostulacionItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [vacanteFilter, setVacanteFilter] = useState("all");
  const [estadosOptions, setEstadosOptions] = useState<
    { value: string; label: string }[]
  >([{ value: "all", label: "Todos los estados" }]);
  const [vacantes, setVacantes] = useState<{ id: string; titulo: string }[]>(
    [],
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<PostulacionItem | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetchApi<{ data: CatalogsByType[] }>(
          `/Catalog/getAllCatalogsByType/ESTADO_APLICACION`,
        );
        if (response?.data) {
          const options = response.data.map((c) => ({
            value: c.idCatalogo.toString(),
            label: c.nombre,
          }));
          setEstadosOptions([
            { value: "all", label: "Todos los estados" },
            ...options,
          ]);
        }
      } catch (error) {
        console.error("Error fetching estados:", error);
      }
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    const fetchVacantes = async () => {
      if (!session?.user?.idEmpresa || !session?.user?.accessToken) return;
      try {
        const data = await fetchMisOfertasEmpleo(
          {
            pageSize: 100, // Get all or a large number
            currentPage: 1,
            idEmpresa: session.user.idEmpresa,
            periodoBusqueda: "todos",
          },
          session.user.accessToken,
        );
        if (data?.data) {
          const options = data.data.map((v) => ({
            id: v.idVacante,
            titulo: v.tituloPuesto,
          }));
          setVacantes(options);
        }
      } catch (error) {
        console.error("Error fetching vacantes:", error);
      }
    };
    fetchVacantes();
  }, [session]);

  const handleOpenStatusDialog = (application: PostulacionItem) => {
    setSelectedApplication(application);
    setNewStatus(application.idEstadoAplicacion?.toString() || "");
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication || !session?.user?.accessToken) return;
    setUpdating(true);
    try {
      const success = await updateAplicacionEstado(
        selectedApplication.idAplicacion,
        parseInt(newStatus),
        session.user.accessToken,
      );
      if (success) {
        // Update local state
        setPostulaciones((prev) =>
          prev.map((p) =>
            p.idAplicacion === selectedApplication.idAplicacion
              ? {
                  ...p,
                  idEstadoAplicacion: parseInt(newStatus),
                  estadoAplicacion:
                    estadosOptions.find((e) => e.value === newStatus)?.label ||
                    p.estadoAplicacion,
                }
              : p,
          ),
        );
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchPostulaciones = async () => {
      if (!session?.user?.idEmpresa || !session?.user?.accessToken) return;
      setLoading(true);
      try {
        const params = {
          pageSize: PAGE_SIZE,
          currentPage: currentPage,
          sortBy: "",
          sortDirection: "",
          searchTerm: searchQuery,
          idEmpresa: session.user.idEmpresa,
          idEstadoAplicacion:
            estadoFilter === "all" ? 0 : parseInt(estadoFilter),
          idVacante: vacanteFilter === "all" ? null : vacanteFilter,
        };
        const data = await fetchAplicacionesByEmpresa(
          params,
          session.user.accessToken,
        );
        if (data) {
          setPostulaciones(data.data);
          setTotalItems(data.totalItems);
        }
      } catch (error) {
        console.error("Error fetching postulaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostulaciones();
  }, [session, currentPage, searchQuery, estadoFilter, vacanteFilter]);

  const paginated = postulaciones;

  return (
    <div className="px-6 pb-6">
      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Filtros de búsqueda
        </h3>
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-6">
          <div className="flex-1 min-w-0 w-full lg:max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Buscar
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <Input
                placeholder="Nombre, vacante, ubicación o habilidades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
          <div className="w-full lg:w-44 shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Estado
            </label>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {estadosOptions.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full lg:w-52 shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vacante
            </label>
            <Select value={vacanteFilter} onValueChange={setVacanteFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las vacantes</SelectItem>
                {vacantes.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => setCurrentPage(1)}
            className="w-full lg:w-auto shrink-0 h-10 px-6"
          >
            Filtrar
          </Button>
        </div>
      </div>

      {/* Tabla / Lista */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Postulaciones ({totalItems})
          </h2>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Cargando postulaciones...
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No hay postulaciones que coincidan con los filtros.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map((p) => (
              <div
                key={p.idAplicacion}
                className="px-6 py-4 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0 flex gap-4">
                  <UserAvatar
                    size={48}
                    alt={p.nombreCompleto}
                    className="shrink-0"
                    src={
                      p.fotografia
                        ? `data:image/jpeg;base64,${p.fotografia}`
                        : null
                    }
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/empresa-profile/candidato/${p.idUsuario}`}
                        className="font-semibold text-gray-900 hover:text-primary transition-colors"
                      >
                        {p.nombreCompleto}
                      </Link>
                      <Pill
                        variant="custom"
                        fontSize="text-xs"
                        bgColor={
                          p.estadoAplicacion === "Aprobada"
                            ? "bg-green-100"
                            : p.estadoAplicacion === "Rechazada"
                              ? "bg-red-100"
                              : "bg-amber-100"
                        }
                        textColor={
                          p.estadoAplicacion === "Aprobada"
                            ? "text-green-700"
                            : p.estadoAplicacion === "Rechazada"
                              ? "text-red-700"
                              : "text-amber-700"
                        }
                      >
                        {p.estadoAplicacion}
                      </Pill>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                      <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{p.ciudadUsuario}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 font-medium">
                      {p.tituloVacante}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.habilidades.slice(0, 4).map((h) => (
                        <Pill
                          key={h}
                          variant="custom"
                          fontSize="text-xs"
                          bgColor="bg-slate-100"
                          textColor="text-slate-600"
                        >
                          {h}
                        </Pill>
                      ))}
                      {p.habilidades.length > 4 && (
                        <span className="text-xs text-gray-400">
                          +{p.habilidades.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-sm text-gray-500">
                  <span title={p.fechaPostulacion}>
                    {formatFecha(p.fechaPostulacion)}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/empresa-profile/candidato/${p.idUsuario}`}
                    className="p-2 rounded-lg bg-sky-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
                    title="Ver perfil"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenStatusDialog(p)}
                    className="text-xs"
                  >
                    Cambiar Estado
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalItems > 0 && (
          <TablePagination
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            totalItems={totalItems}
            itemLabel="postulaciones"
            onPageChange={setCurrentPage}
            className="rounded-none"
          />
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Estado de Postulación</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo estado para la postulación de{" "}
              {selectedApplication?.nombreCompleto}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {estadosOptions
                  .filter((e) => e.value !== "all")
                  .map((e) => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updating}>
              {updating ? "Actualizando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
