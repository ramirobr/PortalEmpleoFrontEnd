"use client";

import Pill from "@/components/shared/components/Pill";
import TablePagination from "@/components/shared/components/TablePagination";
import UserAvatar from "@/components/shared/components/UserAvatar";
import { EyeIcon, MapPinIcon } from "@/components/shared/icons/Icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchAplicacionesByEmpresa,
  updateAplicacionEstado,
} from "@/lib/company/applications";
import { fetchMisOfertasEmpleo } from "@/lib/company/misOfertas";
import { formatLongDate } from "@/lib/utils";
import type { PostulacionItem } from "@/types/company";
import type { CatalogsByType } from "@/types/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const PAGE_SIZE = 10;

const statusUpdateSchema = z.object({
  estado: z.string().min(1, "Selecciona un estado"),
});

interface PostulacionesListProps {
  estados?: CatalogsByType[];
}

export default function PostulacionesList({
  estados = [],
}: PostulacionesListProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const currentPage = parseInt(params.get("page") || "1");
  const searchQuery = params.get("search") || "";
  const estadoFilter = params.get("estado") || "all";
  const vacanteFilter = params.get("vacante") || "all";

  const [postulaciones, setPostulaciones] = useState<PostulacionItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [vacantes, setVacantes] = useState<{ id: string; titulo: string }[]>(
    [],
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<PostulacionItem | null>(null);

  const statusForm = useForm<z.infer<typeof statusUpdateSchema>>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: { estado: "" },
  });

  const updateParams = (updates: Record<string, string>) => {
    startTransition(() => {
      const newParams = new URLSearchParams(params);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      router.push(`?${newParams.toString()}`, { scroll: false });
    });
  };

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
    statusForm.reset({
      estado: application.idEstadoAplicacion?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async (
    data: z.infer<typeof statusUpdateSchema>,
  ) => {
    if (!selectedApplication || !session?.user?.accessToken) return;
    try {
      const success = await updateAplicacionEstado(
        selectedApplication.idAplicacion,
        parseInt(data.estado),
        session.user.accessToken,
      );
      if (success) {
        // Update local state
        setPostulaciones((prev) =>
          prev.map((p) =>
            p.idAplicacion === selectedApplication.idAplicacion
              ? {
                  ...p,
                  idEstadoAplicacion: parseInt(data.estado),
                  estadoAplicacion:
                    estados.find((e) => e.idCatalogo.toString() === data.estado)
                      ?.nombre || p.estadoAplicacion,
                }
              : p,
          ),
        );
        setIsDialogOpen(false);
        toast.success("Estado actualizado correctamente");
      }
    } catch (error) {
      console.error("Error updating status:", error);
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
              <form
                className="flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const search = formData.get("search") as string;
                  updateParams({ search, page: "1" });
                }}
              >
                <Input
                  name="search"
                  placeholder="Nombre, vacante, ubicación o habilidades..."
                  defaultValue={searchQuery}
                  className="pl-10 h-10 flex-1"
                />
                <Button type="submit" className="ml-2 h-10 px-4">
                  Buscar
                </Button>
              </form>
            </div>
          </div>
          <div className="w-full lg:w-44 shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Estado
            </label>
            <Select
              value={estadoFilter}
              onValueChange={(value) =>
                updateParams({ estado: value, page: "1" })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {estados.map((e) => (
                  <SelectItem
                    key={e.idCatalogo}
                    value={e.idCatalogo.toString()}
                  >
                    {e.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full lg:w-52 shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vacante
            </label>
            <Select
              value={vacanteFilter}
              onValueChange={(value) =>
                updateParams({ vacante: value, page: "1" })
              }
            >
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
                    {formatLongDate(p.fechaPostulacion)}
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
            onPageChange={(page) => updateParams({ page: page.toString() })}
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
          <form onSubmit={statusForm.handleSubmit(handleUpdateStatus)}>
            <div className="py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <Select
                value={statusForm.watch("estado")}
                onValueChange={(value) => statusForm.setValue("estado", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((e) => (
                    <SelectItem
                      key={e.idCatalogo}
                      value={e.idCatalogo.toString()}
                    >
                      {e.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {statusForm.formState.errors.estado && (
                <p className="text-sm text-red-600 mt-1">
                  {statusForm.formState.errors.estado.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={statusForm.formState.isSubmitting}
              >
                {statusForm.formState.isSubmitting
                  ? "Actualizando..."
                  : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
