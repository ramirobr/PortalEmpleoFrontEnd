"use client";

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
import { fetchApi } from "@/lib/apiClient";
import { fetchMisOfertasEmpleo } from "@/lib/company/misOfertas";
import { OfertaEmpleo } from "@/types/company";
import { PlainStringDataMessage } from "@/types/user";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDelete = async (idVacante: string) => {
    if (!session) return;

    setDeletingId(idVacante);
    const res = await fetchApi<PlainStringDataMessage>(
      "/Jobs/deleteJob/" + idVacante,
      {
        method: "DELETE",
        token: session?.user.accessToken,
      },
    );
    if (!res?.isSuccess) {
      toast.error("Error eliminando oferta");
      return;
    }
    toast.success("Oferta eliminada exitosamente");
    setOfertas(ofertas.filter((oferta) => oferta.idVacante !== idVacante));
    setTotalItems(totalItems - 1);
    setDeletingId(null);
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

        <div className="grid-cols-12 gap-4 bg-gray-50/50 p-4 text-xs text-primary font-bold uppercase tracking-wider border-b border-gray-100 hidden md:grid">
          <div className="col-span-12 md:col-span-5 pl-4">Título</div>
          <div className="col-span-6 md:col-span-2">Aplicaciones</div>
          <div className="col-span-6 md:col-span-2">Creado y Expira</div>
          <div className="col-span-6 md:col-span-1">Estado</div>
          <div className="col-span-6 md:col-span-2 text-right pr-4">Acción</div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <p>Cargando ofertas...</p>
            </div>
          ) : ofertas.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No hay ofertas de empleo para mostrar</p>
            </div>
          ) : (
            ofertas.map((oferta) => (
              <div
                key={oferta.idVacante}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-12 md:col-span-5 flex items-start gap-4 pl-4">
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

                <div className="col-span-6 md:col-span-2 text-sm">
                  <Link
                    href="#"
                    className="text-primary hover:text-green-600 hover:underline font-medium transition-colors"
                  >
                    {oferta.totalAplicaciones}
                    {oferta.totalAplicaciones > 9 && "+"} Postulado
                    {oferta.totalAplicaciones !== 1 && "s"}
                  </Link>
                </div>

                <div className="col-span-6 md:col-span-2 text-sm text-gray-500 flex flex-col gap-1">
                  <span>{formatDate(oferta.fechaPublicacion)}</span>
                  <span>{formatDate(oferta.fechaCierre)}</span>
                </div>

                <div className="col-span-6 md:col-span-1">
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
                </div>

                <div className="col-span-6 md:col-span-2 flex justify-end gap-2 pr-4">
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
              </div>
            ))
          )}
        </div>

        {!loading && totalItems > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando {startIndex + 1} a {endIndex} de {totalItems} empleos
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-200 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
