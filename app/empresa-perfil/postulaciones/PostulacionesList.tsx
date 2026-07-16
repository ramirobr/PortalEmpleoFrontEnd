"use client";

import { LoadingState } from "@/components/shared/components/LoadingState";
import { PremiumButton } from "@/components/shared/components/PremiumButton";
import { SkillPill } from "@/components/shared/components/SkillPill";
import { StatusBadge } from "@/components/shared/components/StatusBadge";
import { ActionButton } from "@/components/shared/components/ActionButton";
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
import { useEffect, useState, useTransition, Suspense } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const PAGE_SIZE = 10;

const statusUpdateSchema = z.object({
  estado: z.string().min(1, "Selecciona un estado"),
});

type StatusUpdateValues = z.infer<typeof statusUpdateSchema>;

type PostulacionesListProps = { estados?: CatalogsByType[] };

const getPhotoSrc = (photo?: string | null): string | null => {
  if (!photo) return null;
  return `data:image/jpeg;base64,${photo.trim()}`;
};

function PostulacionFiltersSection({
  searchQuery,
  estadoFilter,
  vacanteFilter,
  estados,
  vacantes,
  onSearch,
  onEstadoChange,
  onVacanteChange,
}: {
  searchQuery: string;
  estadoFilter: string;
  vacanteFilter: string;
  estados: CatalogsByType[];
  vacantes: { id: string; titulo: string }[];
  onSearch: (search: string) => void;
  onEstadoChange: (value: string) => void;
  onVacanteChange: (value: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 mb-8 transition-all hover:shadow-md">
      <h3 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
        <svg className="size-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros de búsqueda
      </h3>
      <div className="flex flex-col lg:flex-row lg:items-end gap-6">
        <div className="flex-1 min-w-0 w-full lg:max-w-md">
          <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Buscar Candidato</span>
          <form className="flex gap-2" action={(formData) => { onSearch(formData.get("search") as string); }}>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <Input name="search" placeholder="Nombre, vacante o ubicación..." defaultValue={searchQuery} className="pl-10 h-11 bg-zinc-50/50 border-zinc-100 rounded-xl focus:bg-white transition-all text-sm" />
            </div>
            <PremiumButton type="submit" variant="primary" size="md">Buscar</PremiumButton>
          </form>
        </div>
        <div className="w-full lg:w-48 shrink-0">
          <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Estado</span>
          <Select value={estadoFilter} onValueChange={onEstadoChange}>
            <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-100 rounded-xl text-sm"><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
              <SelectItem value="all">Todos los estados</SelectItem>
              {estados.map((e) => (
                <SelectItem key={e.idCatalogo} value={e.idCatalogo.toString()}>{e.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full lg:w-56 shrink-0">
          <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Vacante Específica</span>
          <Select value={vacanteFilter} onValueChange={onVacanteChange}>
            <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-100 rounded-xl text-sm"><SelectValue placeholder="Todas" /></SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
              <SelectItem value="all">Todas las vacantes</SelectItem>
              {vacantes.map((v) => (
                <SelectItem key={v.id} value={v.id}>{v.titulo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function PostulacionCard({
  p,
  onOpenStatusDialog,
}: {
  p: PostulacionItem;
  onOpenStatusDialog: (p: PostulacionItem) => void;
}) {
  return (
    <div className="p-8 hover:bg-zinc-50/50 transition-all flex flex-col md:flex-row md:items-center gap-8 group">
      <div className="relative shrink-0">
        <UserAvatar size={80} alt={p.nombreCompleto} className="rounded-full shadow-sm border-4 border-white bg-teal-50" src={getPhotoSrc(p.fotografia)} />
        <div className="absolute bottom-1 right-1 size-6 bg-[#b24c1e] rounded-full border-2 border-white flex items-center justify-center shadow-md">
          <StarIcon className="size-3 text-white" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-xl font-semibold text-slate-900 uppercase tracking-tight">{p.nombreCompleto}</h3>
          <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[11px] font-bold uppercase rounded border border-orange-100">Nuevo</span>
        </div>
        <p className="text-[#006a62] font-bold text-sm mb-3">Candidato</p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><MapPinIcon className="size-3.5 text-slate-300" />{p.ciudadUsuario || "Sin ubicación"}</span>
          <span className="flex items-center gap-1.5"><BriefcaseIcon className="size-3.5 text-slate-300" />{p.tituloVacante}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-6 shrink-0">
        <div className="flex items-center gap-2">
          <StatusBadge status={p.estadoAplicacion} className="shadow-none border-none" />
          <ActionButton onClick={() => onOpenStatusDialog(p)} icon={<EditIcon />} title="Cambiar estado" />
        </div>
        <PremiumButton href={`/empresa-perfil/candidato/${p.idUsuario}`} variant="primary" size="sm" className="rounded-full px-8 py-5 h-auto text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-teal-100 transition-all active:scale-95">
          Ver Perfil
        </PremiumButton>
      </div>
    </div>
  );
}

function StatusUpdateDialog({
  open,
  onOpenChange,
  selectedApplication,
  estados,
  form,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedApplication: PostulacionItem | null;
  estados: CatalogsByType[];
  form: UseFormReturn<StatusUpdateValues>;
  onSubmit: (data: StatusUpdateValues) => Promise<void>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Estado de Postulación</DialogTitle>
          <DialogDescription>
            Selecciona el nuevo estado para la postulación de {selectedApplication?.nombreCompleto}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="py-4">
            <span className="block text-sm font-medium text-slate-700 mb-2">Estado</span>
            <Select value={form.watch("estado")} onValueChange={(value) => form.setValue("estado", value)}>
              <SelectTrigger><SelectValue placeholder="Selecciona un estado" /></SelectTrigger>
              <SelectContent>
                {estados.map((e) => (
                  <SelectItem key={e.idCatalogo} value={e.idCatalogo.toString()}>{e.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.estado && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.estado.message}</p>
            )}
          </div>
          <DialogFooter className="gap-3 sm:gap-0">
            <PremiumButton variant="outline" size="md" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</PremiumButton>
            <PremiumButton type="submit" variant="primary" size="md" isLoading={form.formState.isSubmitting} className="rounded-xl min-w-[120px]">Guardar Cambios</PremiumButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PostulacionesListInner({
  estados = [],
}: PostulacionesListProps) {

  const { data: session } = useSession();
  const { push } = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const currentPage = parseInt(params.get("page") || "1");
  const searchQuery = params.get("search") || "";
  const estadoFilter = params.get("estado") || "all";
  const vacanteFilter = params.get("vacante") || "all";

  const [dataState, setDataState] = useState({
    postulaciones: [] as PostulacionItem[],
    totalItems: 0,
    loading: false,
  });
  const { postulaciones, totalItems, loading } = dataState;

  const setPostulaciones = (
    val: PostulacionItem[] | ((prev: PostulacionItem[]) => PostulacionItem[]),
  ) => {
    setDataState((prev) => ({
      ...prev,
      postulaciones:
        typeof val === "function"
          ? (val as Function)(prev.postulaciones)
          : val,
    }));
  };

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
      push(`?${newParams.toString()}`, { scroll: false });
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
      setDataState((prev) => ({ ...prev, loading: true }));
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
          setDataState({
            postulaciones: data.data,
            totalItems: data.totalItems,
            loading: false,
          });
        } else {
          setDataState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Error fetching postulaciones:", error);
        setDataState((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchPostulaciones();
  }, [session, currentPage, searchQuery, estadoFilter, vacanteFilter]);

  const paginated = postulaciones;

  return (
    <div className="pb-6">
      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 mb-8 transition-all hover:shadow-md">
        <h3 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
          <svg
            className="size-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtros de búsqueda
        </h3>
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          <div className="flex-1 min-w-0 w-full lg:max-w-md">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Buscar Candidato
            </span>
            <form
              className="flex gap-2"
              action={(formData) => {
                const search = formData.get("search") as string;
                updateParams({ search, page: "1" });
              }}
            >
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg
                    className="size-4"
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
                  name="search"
                  placeholder="Nombre, vacante o ubicación..."
                  defaultValue={searchQuery}
                  className="pl-10 h-11 bg-zinc-50/50 border-zinc-100 rounded-xl focus:bg-white transition-all text-sm"
                />
              </div>
              <PremiumButton type="submit" variant="primary" size="md">
                Buscar
              </PremiumButton>
            </form>
          </div>
          <div className="w-full lg:w-48 shrink-0">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Estado
            </span>
            <Select
              value={estadoFilter}
              onValueChange={(value) =>
                updateParams({ estado: value, page: "1" })
              }
            >
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-100 rounded-xl text-sm">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
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
          <div className="w-full lg:w-56 shrink-0">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Vacante Específica
            </span>
            <Select
              value={vacanteFilter}
              onValueChange={(value) =>
                updateParams({ vacante: value, page: "1" })
              }
            >
              <SelectTrigger className="h-11 bg-zinc-50/50 border-zinc-100 rounded-xl text-sm">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
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
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            Postulantes Destacados
          </h2>
        </div>

        {loading ? (
          <LoadingState message="Cargando postulantes..." className="py-24" />
        ) : paginated.length === 0 ? (
          <div className="py-24 text-center">
            <div className="size-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="size-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">
              No hay postulaciones que coincidan con los filtros.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {paginated.map((p) => (
              <div
                key={p.idAplicacion}
                className="p-8 hover:bg-zinc-50/50 transition-all flex flex-col md:flex-row md:items-center gap-8 group"
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
                    <h3 className="text-xl font-semibold text-slate-900 uppercase tracking-tight">
                      {p.nombreCompleto}
                    </h3>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[11px] font-bold uppercase rounded border border-orange-100">
                      Nuevo
                    </span>
                  </div>

                  <p className="text-[#006a62] font-bold text-sm mb-3">
                    Candidato
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon className="size-3.5 text-slate-300" />
                      {p.ciudadUsuario || "Sin ubicación"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BriefcaseIcon className="size-3.5 text-slate-300" />
                      {p.tituloVacante}
                    </span>
                  </div>
                </div>

                {/* Right Side: Status & Button */}
                <div className="flex flex-col items-end gap-6 shrink-0">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={p.estadoAplicacion}
                      className="shadow-none border-none"
                    />
                    <ActionButton
                      onClick={() => handleOpenStatusDialog(p)}
                      icon={<EditIcon />}
                      title="Cambiar estado"
                    />
                  </div>

                  <PremiumButton
                    href={`/empresa-perfil/candidato/${p.idUsuario}`}
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
              <span className="block text-sm font-medium text-slate-700 mb-2">
                Estado
              </span>
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

export default function PostulacionesList(props: PostulacionesListProps) {
  return (
    <Suspense fallback={<LoadingState message="Cargando postulaciones..." className="py-12" />}>
      <PostulacionesListInner {...props} />
    </Suspense>
  );
}
