"use client";

import { LoadingState } from "@/components/shared/components/LoadingState";
import { PremiumButton } from "@/components/shared/components/PremiumButton";
import { StatusBadge } from "@/components/shared/components/StatusBadge";
import { ActionButton } from "@/components/shared/components/ActionButton";
import { PremiumPageHeader } from "../components/PremiumPageHeader";
import TablePagination from "@/components/shared/components/TablePagination";
import {
  BriefcaseIcon,
  CalendarIcon,
  EditIcon,
  EyeIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "@/components/shared/icons/Icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchApi } from "@/lib/apiClient";
import { fetchMisOfertasEmpleo } from "@/lib/company/misOfertas";
import { fetchAplicantesByVacante } from "@/lib/company/candidates";
import { formatDate } from "@/lib/utils";
import { OfertaEmpleo, AplicanteReal } from "@/types/company";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function CandidatesDialog({
  open,
  onOpenChange,
  job,
  aplicantes,
  loading,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  job: OfertaEmpleo | null;
  aplicantes: AplicanteReal[];
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-primary px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-bold tracking-tight flex items-center gap-3">
              <UsersIcon className="size-6" />
              Candidatos para Vacante
            </DialogTitle>
            <DialogDescription className="text-white/70 text-sm font-medium">
              {job?.tituloPuesto} • {job?.ubicacion}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto bg-zinc-50/50">
          {loading ? (
            <LoadingState message="Buscando aplicantes..." className="py-12" />
          ) : aplicantes.length === 0 ? (
            <div className="text-center py-12">
              <div className="size-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-zinc-100">
                <UsersIcon className="size-8 text-slate-200" />
              </div>
              <p className="text-slate-500 font-medium italic">No hay candidatos registrados para esta oferta aún.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aplicantes.map((aplicante) => (
                <div key={aplicante.idAplicacion} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 hover:shadow-md transition-all group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 flex-1 mr-4">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors truncate">{aplicante.nombreCompleto}</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{aplicante.correoElectronico}</p>
                    </div>
                    <StatusBadge status={aplicante.estadoAplicacion} className="shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-auto pt-4 border-t border-zinc-50">
                    <CalendarIcon className="size-3.5 text-primary/60" />
                    Aplicó el {formatDate(aplicante.fechaPostulacion)}
                  </div>
                  {aplicante.mensajeCandidato && (
                    <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100 italic text-sm text-slate-600 relative">
                      <span className="absolute -top-2 left-4 px-2 bg-zinc-50 text-xs font-bold text-slate-500 uppercase tracking-widest">Mensaje</span>
                      &quot;{aplicante.mensajeCandidato}&quot;
                    </div>
                  )}
                  <div className="mt-6 flex gap-2">
                    <PremiumButton href={`/empresa-perfil/candidato/${aplicante.idUsuario}`} variant="primary" size="sm" className="flex-1">Ver Perfil</PremiumButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OfertasFilterBar({
  totalItems,
  periodoBusqueda,
  onPeriodoChange,
}: {
  totalItems: number;
  periodoBusqueda: string;
  onPeriodoChange: (value: string) => void;
}) {
  return (
    <div className="px-8 py-6 border-b border-zinc-100 bg-zinc-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
         <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <BriefcaseIcon className="size-5 text-primary" />
         </div>
         <div>
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Listado de Vacantes
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {totalItems} Ofertas encontradas
            </p>
         </div>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0">Filtrar por:</span>
        <Select value={periodoBusqueda} onValueChange={onPeriodoChange}>
          <SelectTrigger className="w-[180px] h-10 rounded-xl border-zinc-100 bg-white text-xs font-bold uppercase tracking-widest">
            <SelectValue placeholder="Periodo" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
            <SelectItem value="1month">Último mes</SelectItem>
            <SelectItem value="3months">Últimos 3 meses</SelectItem>
            <SelectItem value="6months">Últimos 6 meses</SelectItem>
            <SelectItem value="1year">Último año</SelectItem>
            <SelectItem value="all">Todas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default function OfertasPage() {
  const { data: session } = useSession();
  const [ofertas, setOfertas] = useState<OfertaEmpleo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [periodoBusqueda, setPeriodoBusqueda] = useState("6months");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<OfertaEmpleo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aplicantes, setAplicantes] = useState<AplicanteReal[]>([]);
  const [loadingAplicantes, setLoadingAplicantes] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    async function cargarOfertas() {
      if (!session) return;
      setLoading(true);
      const resultado = await fetchMisOfertasEmpleo(
        {
          pageSize,
          currentPage,
          idEmpresa: session?.user.idEmpresa || "",
          periodoBusqueda,
        },
        session?.user.accessToken,
      );

      if (resultado) {
        setOfertas(resultado.data);
        setTotalItems(resultado.totalItems);
      } else {
        setOfertas([]);
        setTotalItems(0);
      }
      setLoading(false);
    }

    cargarOfertas();
  }, [currentPage, periodoBusqueda, session]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePeriodoChange = (value: string) => {
    setPeriodoBusqueda(value);
    setCurrentPage(1);
  };

  const handleDelete = async (idVacante: string) => {
    if (!session) return;
    if (!confirm("¿Estás seguro de eliminar esta vacante?")) return;

    setDeletingId(idVacante);
    const res = await fetchApi("/Jobs/deleteJob/" + idVacante, {
      method: "DELETE",
      token: session?.user.accessToken,
    });
    if (!res?.isSuccess) {
      toast.error("Error eliminando oferta");
      setDeletingId(null);
      return;
    }
    toast.success("Oferta eliminada correctamente");
    setOfertas(ofertas.filter((o) => o.idVacante !== idVacante));
    setTotalItems(totalItems - 1);
    setDeletingId(null);
  };

  const handleViewCandidates = async (oferta: OfertaEmpleo) => {
    setSelectedJob(oferta);
    setIsDialogOpen(true);
    setLoadingAplicantes(true);
    const res = await fetchAplicantesByVacante(
      oferta.idVacante,
      session?.user.accessToken,
    );
    setAplicantes(res || []);
    setLoadingAplicantes(false);
  };

  return (
    <>
      <PremiumPageHeader
        title="Mis Ofertas de Empleo"
        description="Gestiona las vacantes publicadas, monitorea el interés de los candidatos and actualiza el estado de tus procesos de selección."
      >
        <PremiumButton href="/empresa-perfil/crear-empleo" variant="primary" icon={<PlusIcon className="size-4" />}>
          Publicar Vacante
        </PremiumButton>
      </PremiumPageHeader>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <OfertasFilterBar
          totalItems={totalItems}
          periodoBusqueda={periodoBusqueda}
          onPeriodoChange={handlePeriodoChange}
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th scope="col" className="py-4 px-8 text-left text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Título de la Vacante
                </th>
                <th scope="col" className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Candidatos
                </th>
                <th scope="col" className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Fechas
                </th>
                <th scope="col" className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Estado
                </th>
                <th scope="col" className="py-4 px-8 text-right text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <LoadingState message="Cargando tus vacantes..." className="py-20" />
                  </td>
                </tr>
              ) : ofertas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="size-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BriefcaseIcon className="size-8 text-slate-200" />
                    </div>
                    <p className="text-slate-500 font-medium">No hay ofertas de empleo para mostrar.</p>
                    <PremiumButton href="/empresa-perfil/crear-empleo" variant="outline" size="sm" className="mt-4">
                      Crea tu primera oferta
                    </PremiumButton>
                  </td>
                </tr>
              ) : (
                ofertas.map((oferta) => (
                  <tr key={oferta.idVacante} className="group hover:bg-zinc-50/50 transition-all">
                    <td className="py-5 px-8">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {oferta.tituloPuesto}
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <MapPinIcon className="size-3.5 text-primary/60" />
                            {oferta.ubicacion}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <button
                        onClick={() => handleViewCandidates(oferta)}
                        className="inline-flex flex-col items-center group/btn"
                      >
                        <span className="text-lg font-bold text-slate-900 group-hover/btn:text-primary transition-colors">
                          {oferta.totalAplicaciones}
                        </span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Aplicantes
                        </span>
                      </button>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                           <span className="size-1.5 rounded-full bg-green-400" />
                           Pub: {formatDate(oferta.fechaPublicacion)}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                           <span className="size-1.5 rounded-full bg-red-400" />
                           Exp: {formatDate(oferta.fechaCierre)}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <StatusBadge status={oferta.estadoVacante.nombre} />
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex justify-end gap-2">
                        <ActionButton
                          href={`/empleos/${oferta.idVacante}`}
                          icon={<EyeIcon />}
                          title="Ver Detalle"
                        />
                        <ActionButton
                          href={`/empresa-perfil/empleos/${oferta.idVacante}`}
                          icon={<EditIcon />}
                          title="Editar"
                        />
                        <ActionButton
                          onClick={() => handleDelete(oferta.idVacante)}
                          isLoading={deletingId === oferta.idVacante}
                          disabled={deletingId === oferta.idVacante}
                          variant="danger"
                          icon={<TrashIcon />}
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

        {!loading && totalItems > 0 && (
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            itemLabel="empleos"
            onPageChange={handlePageChange}
            className="rounded-none border-t border-zinc-100"
          />
        )}
      </div>

      <CandidatesDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        job={selectedJob}
        aplicantes={aplicantes}
        loading={loadingAplicantes}
      />
    </>
  );
}
