"use client";
import TablePagination from "@/components/shared/components/TablePagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { fetchApi } from "@/lib/apiClient";
import { formatDate, getInitials } from "@/lib/utils";
import {
  approveTestimonial,
  deleteTestimonial,
  getTestimonialCounters,
  rejectTestimonial,
} from "@/lib/admin/testimonios";
import { CatalogsByType } from "@/types/search";
import {
  AdminTestimonialsResponse,
  TestimonialCounters,
  TestimonialData,
} from "@/types/testimonials";
import { MessageSquare, Search, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import TestimoniosTable from "./TestimoniosTable";

interface AdminTestimoniosClientProps {
  estados?: CatalogsByType[];
  counters?: TestimonialCounters;
}

export default function AdminTestimoniosClient({
  estados = [],
  counters: initialCounters,
}: AdminTestimoniosClientProps) {
  const { data: session } = useSession();
  const [_, startTransition] = useTransition();
  const router = useRouter();
  const params = useSearchParams();

  const currentPage = parseInt(params.get("page") || "1");
  const pageSize = parseInt(params.get("pageSize") || "10");
  const searchQuery = params.get("search") || "";
  const estadoFilter = params.get("estado") || "todos";
  const calificacionFilter = params.get("calificacion") || "todas";

  const [testimonios, setTestimonios] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [counters, setCounters] = useState<TestimonialCounters | undefined>(
    initialCounters,
  );

  const [selectedTestimonio, setSelectedTestimonio] =
    useState<TestimonialData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const fetchCounters = async () => {
    try {
      const res = await getTestimonialCounters(session?.user.accessToken);
      setCounters(res);
    } catch (error) {
      console.error("Error fetching counters:", error);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchApi<AdminTestimonialsResponse>(
          "/Testimonial/getAll",
          {
            method: "POST",
            body: {
              pageSize,
              currentPage,
              sortBy: "",
              sortDirection: "",
              searchTerm: searchQuery,
              estadoId:
                estadoFilter === "todos" ? 0 : parseInt(estadoFilter) || 0,
              calificacion:
                calificacionFilter === "todas"
                  ? 0
                  : parseInt(calificacionFilter),
            },
            token: session?.user.accessToken,
          },
        );
        if (response) {
          setTestimonios(response.data.data);
          setTotalItems(response.data.totalItems);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    currentPage,
    pageSize,
    searchQuery,
    estadoFilter,
    calificacionFilter,
    session,
    refetchTrigger,
  ]);

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

  const handleView = (idTestimonio: string) => {
    const testimonio = testimonios.find((t) => t.idTestimonio === idTestimonio);
    if (testimonio) {
      setSelectedTestimonio(testimonio);
      setIsViewDialogOpen(true);
    }
  };

  const handleApprove = async (idTestimonio: string) => {
    try {
      const res = await approveTestimonial(
        idTestimonio,
        session?.user.accessToken,
      );
      if (res?.isSuccess) {
        toast.success("Testimonio aprobado correctamente");
        setRefetchTrigger((prev) => prev + 1);
        fetchCounters();
      } else {
        toast.error(res?.messages?.[0] || "Error al aprobar el testimonio");
      }
    } catch {
      toast.error("Error al aprobar el testimonio");
    }
  };

  const handleReject = async (idTestimonio: string) => {
    try {
      const res = await rejectTestimonial(
        idTestimonio,
        session?.user.accessToken,
      );
      if (res?.isSuccess) {
        toast.success("Testimonio rechazado correctamente");
        setRefetchTrigger((prev) => prev + 1);
        fetchCounters();
      } else {
        toast.error(res?.messages?.[0] || "Error al rechazar el testimonio");
      }
    } catch {
      toast.error("Error al rechazar el testimonio");
    }
  };

  const handleDelete = async (idTestimonio: string) => {
    try {
      const res = await deleteTestimonial(
        idTestimonio,
        session?.user.accessToken,
      );
      if (res?.isSuccess) {
        toast.success("Testimonio eliminado correctamente");
        setRefetchTrigger((prev) => prev + 1);
        fetchCounters();
      } else {
        toast.error(res?.messages?.[0] || "Error al eliminar el testimonio");
      }
    } catch {
      toast.error("Error al eliminar el testimonio");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-primary" />
        Gestionar Testimonios
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {counters?.totalTestimonios}
          </p>
          <p className="text-sm text-gray-500">Total</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {counters?.totalTestimoniosPublicados}
          </p>
          <p className="text-sm text-gray-500">Aprobados</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {counters?.totalTestimoniosEnRevision}
          </p>
          <p className="text-sm text-gray-500">Pendientes</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {counters?.totalTestimoniosRechazados}
          </p>
          <p className="text-sm text-gray-500">Rechazados</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <p className="text-2xl font-bold text-yellow-500">
              {counters?.calificacionPromedio}
            </p>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-sm text-gray-500">Promedio</p>
        </Card>
      </div>

      <Card className="mb-6 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const search = formData.get("search") as string;
              updateParams({ search, page: "1" });
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              name="search"
              type="text"
              placeholder="Buscar por candidato, empresa o contenido..."
              defaultValue={searchQuery}
              className="pl-10"
            />
            <Button type="submit" className="sr-only">
              Buscar
            </Button>
          </form>

          <Select
            value={estadoFilter}
            onValueChange={(value) =>
              updateParams({ estado: value, page: "1" })
            }
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {estados.map((estado) => (
                <SelectItem
                  key={estado.idCatalogo}
                  value={estado.idCatalogo.toString()}
                >
                  {estado.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={calificacionFilter}
            onValueChange={(value) =>
              updateParams({ calificacion: value, page: "1" })
            }
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Calificación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las calificaciones</SelectItem>
              <SelectItem value="5">5 estrellas</SelectItem>
              <SelectItem value="4">4 estrellas</SelectItem>
              <SelectItem value="3">3 estrellas</SelectItem>
              <SelectItem value="2">2 estrellas</SelectItem>
              <SelectItem value="1">1 estrella</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <TestimoniosTable
          testimonios={testimonios}
          loading={loading}
          onView={handleView}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />

        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="testimonios"
          onPageChange={(page) => updateParams({ page: page.toString() })}
          onPageSizeChange={(size) =>
            updateParams({ pageSize: size.toString(), page: "1" })
          }
          className="rounded-b-xl border-t border-gray-100"
        />
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del Testimonio</DialogTitle>
            <DialogDescription>
              Información completa del testimonio enviado por el candidato.
            </DialogDescription>
          </DialogHeader>

          {selectedTestimonio && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border border-gray-200">
                  <AvatarImage
                    src={selectedTestimonio.candidato.fotoUrl}
                    alt={selectedTestimonio.candidato.nombreCompleto}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(selectedTestimonio.candidato.nombreCompleto)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedTestimonio.candidato.nombreCompleto}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedTestimonio.cargo} en {selectedTestimonio.empresa}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedTestimonio.candidato.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Calificación:</span>
                {renderStars(selectedTestimonio.calificacion)}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 italic">
                  &quot;{selectedTestimonio.testimonioDetalle}&quot;
                </p>
              </div>

              <div className="flex justify-between text-sm text-gray-500 pt-2 border-t">
                <span>
                  Fecha: {formatDate(selectedTestimonio.fechaCreacion)}
                </span>
                <span
                  className={`font-medium ${
                    selectedTestimonio.estado.nombre.toLowerCase() ===
                    "aprobado"
                      ? "text-green-600"
                      : selectedTestimonio.estado.nombre.toLowerCase() ===
                          "pendiente"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {selectedTestimonio.estado.nombre}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
