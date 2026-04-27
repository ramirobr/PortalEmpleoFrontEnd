"use client";

import { LoadingState } from "@/components/shared/components/LoadingState";
import { PremiumButton } from "@/components/shared/components/PremiumButton";
import { SkillPill } from "@/components/shared/components/SkillPill";
import { StatusBadge } from "@/components/shared/components/StatusBadge";
import TablePagination from "@/components/shared/components/TablePagination";
import UserAvatar from "@/components/shared/components/UserAvatar";
import {
  CalendarIcon,
  CheckIcon,
  EyeIcon,
  MapPinIcon,
  UsersIcon,
  BriefcaseIcon,
  StarIcon,
  EditIcon,
} from "@/components/shared/icons/Icons";
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
  const getPhotoSrc = (photo?: string | null) => {
    if (!photo) return null;

    const normalized = photo.trim();
    if (!normalized) return null;

    return `data:image/jpeg;base64,${normalized}`;
  };

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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8 transition-all hover:shadow-md">
        <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
          <svg className="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filtros de búsqueda
        </h3>
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          <div className="flex-1 min-w-0 w-full lg:max-w-md">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Buscar Candidato
            </label>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const search = formData.get("search") as string;
                updateParams({ search, page: "1" });
              }}
            >
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <Input
                  name="search"
                  placeholder="Nombre, vacante o ubicación..."
                  defaultValue={searchQuery}
                  className="pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus:bg-white transition-all text-sm"
                />
              </div>
              <PremiumButton type="submit" variant="primary" size="md">
                Buscar
              </PremiumButton>
            </form>
          </div>
          <div className="w-full lg:w-48 shrink-0">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Estado
            </label>
            <Select
              value={estadoFilter}
              onValueChange={(value) => updateParams({ estado: value, page: "1" })}
            >
              <SelectTrigger className="h-11 bg-gray-50/50 border-gray-100 rounded-xl text-sm">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem value="all">Todos los estados</SelectItem>
                {estados.map((e) => (
                  <SelectItem key={e.idCatalogo} value={e.idCatalogo.toString()}>
                    {e.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full lg:w-56 shrink-0">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Vacante Específica
            </label>
            <Select
              value={vacanteFilter}
              onValueChange={(value) => updateParams({ vacante: value, page: "1" })}
            >
              <SelectTrigger className="h-11 bg-gray-50/50 border-gray-100 rounded-xl text-sm">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
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

      {/* Lista de Postulaciones */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Postulantes Destacados
          </h2>
        </div>

        {loading ? (
          <LoadingState message="Cargando postulantes..." className="py-24" />
        ) : paginated.length === 0 ? (
          <div className="py-24 text-center">
            <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="size-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No hay postulaciones que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map((p) => (
              <div
                key={p.idAplicacion}
                className="px-8 py-8 hover:bg-gray-50/50 transition-all flex flex-col md:flex-row md:items-center gap-8 group"
              >
                {/* Avatar with Star Overlay */}
                <div className="relative shrink-0">
                  <UserAvatar
                    size={80}
                    alt={p.nombreCompleto}
                    className="rounded-full shadow-sm border-4 border-white bg-teal-50"
                    src={getPhotoSrc(p.fotografia)}
                  />
                  <div className="absolute bottom-1 right-1 size-6 bg-[#b24c1e] rounded-full border-2 border-white flex items-center justify-center shadow-md">
                     <StarIcon className="size-3 text-white" />
                  </div>
                </div>

                {/* Info Section */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                      {p.nombreCompleto}
                    </h3>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-bold uppercase rounded border border-orange-100">
                      Nuevo
                    </span>
                  </div>
                  
                  <p className="text-[#006a62] font-bold text-sm mb-3">
                    Candidato
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon className="size-3.5 text-gray-300" />
                      {p.ciudadUsuario || "Sin ubicación"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BriefcaseIcon className="size-3.5 text-gray-300" />
                      {p.tituloVacante}
                    </span>
                  </div>
                </div>

                {/* Right Side: Status & Button */}
                <div className="flex flex-col items-end gap-6 shrink-0">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.estadoAplicacion} className="shadow-none border-none" />
                    <button 
                      onClick={() => handleOpenStatusDialog(p)}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                      title="Cambiar estado"
                    >
                      <EditIcon className="size-4" />
                    </button>
                  </div>
                  
                  <PremiumButton
                    href={`/empresa-profile/candidato/${p.idUsuario}`}
                    variant="primary"
                    size="sm"
                    className="rounded-full px-8 py-5 h-auto text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-teal-100 transition-all active:scale-95"
                  >
                    Ver Perfil
                  </PremiumButton>
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
            <DialogFooter className="gap-3 sm:gap-0">
              <PremiumButton
                variant="outline"
                size="md"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </PremiumButton>
              <PremiumButton
                type="submit"
                variant="primary"
                size="md"
                isLoading={statusForm.formState.isSubmitting}
                className="rounded-xl min-w-[120px]"
              >
                Guardar Cambios
              </PremiumButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
