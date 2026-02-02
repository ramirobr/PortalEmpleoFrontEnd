"use client";

import TablePagination from "@/components/shared/components/TablePagination";
import {
  BriefcaseIcon,
  EditIcon,
  EyeIcon,
  MapPinIcon,
  TrashIcon,
} from "@/components/shared/icons/Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchApi } from "@/lib/apiClient";
import { fetchMisOfertasEmpleo } from "@/lib/company/misOfertas";
import { fetchAplicantesByVacante } from "@/lib/company/candidates";
import { formatDate } from "@/lib/utils";
import { OfertaEmpleo, AplicanteReal } from "@/types/company";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  // Cargar ofertas de empleo
  useEffect(() => {
    async function cargarOfertas() {
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
  }, [currentPage, periodoBusqueda]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePeriodoChange = (value: string) => {
    setPeriodoBusqueda(value);
    setCurrentPage(1); // Resetear a la primera página al cambiar el período
  };

  const handleDelete = async (idVacante: string) => {
    if (!session) return;

    setDeletingId(idVacante);
    const res = await fetchApi("/Jobs/deleteJob/" + idVacante, {
      method: "DELETE",
      token: session?.user.accessToken,
    });
    if (!res?.isSuccess) {
      toast.error("Error eliminando oferta");
      return;
    }
    toast.success("Oferta eliminada exitosamente");
    setOfertas(ofertas.filter((oferta) => oferta.idVacante !== idVacante));
    setTotalItems(totalItems - 1);
    setDeletingId(null);
  };

  const handleViewCandidates = async (oferta: OfertaEmpleo) => {
    setSelectedJob(oferta);
    setIsDialogOpen(true);
    setLoadingAplicantes(true);
    const data = await fetchAplicantesByVacante(oferta.idVacante, session?.user.accessToken);
    if (data) {
      setAplicantes(data);
    } else {
      setAplicantes([]);
    }
    setLoadingAplicantes(false);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return (
    <div className="container mx-auto px-6 mb-8">
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestionar Empleos</h1>
        <p className="text-gray-500">¿Listo para retomar el trabajo?</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-100 gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Mis Ofertas de Empleo
          </h2>
          <div className="w-full md:w-48">
            <Select
              defaultValue="6months"
              value={periodoBusqueda}
              onValueChange={handlePeriodoChange}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">Últimos 6 Meses</SelectItem>
                <SelectItem value="12months">Últimos 12 Meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th
                  scope="col"
                  className="py-5 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider"
                >
                  Título
                </th>
                <th
                  scope="col"
                  className="py-5 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider"
                >
                  Aplicaciones
                </th>
                <th
                  scope="col"
                  className="py-5 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider"
                >
                  Creado y Expira
                </th>
                <th
                  scope="col"
                  className="py-5 px-4 text-left text-xs text-primary font-bold uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="py-5 px-4 text-right text-xs text-primary font-bold uppercase tracking-wider"
                >
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <p>Cargando ofertas...</p>
                  </td>
                </tr>
              ) : ofertas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <p>No hay ofertas de empleo para mostrar</p>
                  </td>
                </tr>
              ) : (
                ofertas.map((oferta) => (
                  <tr
                    key={oferta.idVacante}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-4">
                      <div className="flex items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base">
                            {oferta.tituloPuesto}
                          </h3>
                          <div className="flex items-center text-gray-500 text-sm mt-1 gap-4">
                            <span className="flex items-center gap-1">
                              <BriefcaseIcon className="w-4 h-4" />
                              {oferta.empresa.nombre}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {oferta.ubicacion}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-sm">
                      <button
                        onClick={() => handleViewCandidates(oferta)}
                        className="text-primary hover:text-green-600 hover:underline font-medium transition-colors"
                      >
                        {oferta.totalAplicaciones}
                        {oferta.totalAplicaciones > 9 && "+"} Postulado
                        {oferta.totalAplicaciones !== 1 && "s"}
                      </button>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-500">
                      <div className="flex flex-col gap-1">
                        <span>{formatDate(oferta.fechaPublicacion)}</span>
                        <span>{formatDate(oferta.fechaCierre)}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`text-sm font-medium ${
                          oferta.estadoVacante.nombre === "Activa"
                            ? "text-green-600"
                            : oferta.estadoVacante.nombre === "Expirado"
                              ? "text-red-500"
                              : "text-gray-500"
                        }`}
                      >
                        {oferta.estadoVacante.nombre}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/jobs/${oferta.idVacante}`}
                          className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                          title="Ver Detalle"
                        >
                          <EyeIcon className="w-3 h-3" />
                        </Link>
                        <Link
                          href={`/empresa-profile/empleos/${oferta.idVacante}`}
                          className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <EditIcon className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleDelete(oferta.idVacante)}
                          disabled={deletingId === oferta.idVacante}
                          className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Shared Pagination Component */}
        {!loading && totalItems > 0 && (
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            itemLabel="empleos"
            onPageChange={handlePageChange}
            className="mt-0 rounded-b-xl border-t-0"
          />
        )}
      </div>

      {/* Dialog for viewing candidates */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Candidatos para: {selectedJob?.tituloPuesto}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {loadingAplicantes ? (
              <p className="text-center text-gray-500">Cargando candidatos...</p>
            ) : (
              <div className="space-y-4">
                {aplicantes.map((aplicante) => (
                  <div
                    key={aplicante.idAplicacion}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {aplicante.nombreCompleto}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {aplicante.correoElectronico}
                        </p>
                        <p className="text-sm text-gray-500">
                          Postulado el: {formatDate(aplicante.fechaPostulacion)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          aplicante.estadoAplicacion === "Postulada"
                            ? "bg-blue-100 text-blue-800"
                            : aplicante.estadoAplicacion === "Aprobada"
                            ? "bg-green-100 text-green-800"
                            : aplicante.estadoAplicacion === "Rechazada"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {aplicante.estadoAplicacion}
                      </span>
                    </div>
                    {aplicante.mensajeCandidato && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Mensaje del candidato:</p>
                        <p className="text-sm text-gray-700 mt-1">
                          {aplicante.mensajeCandidato}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {aplicantes.length === 0 && (
                  <p className="text-center text-gray-500">No hay candidatos para esta oferta.</p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
