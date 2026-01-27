"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Search, MessageSquare, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminTestimonio } from "@/types/admin";
import { mockTestimonios } from "@/lib/admin/adminTestimonios";
import TestimoniosTable from "./components/TestimoniosTable";
import TablePagination from "@/components/shared/components/TablePagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminTestimoniosPage() {
  const { data: session } = useSession();
  const [testimonios, setTestimonios] = useState<AdminTestimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [calificacionFilter, setCalificacionFilter] = useState("todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state for viewing testimonial details
  const [selectedTestimonio, setSelectedTestimonio] =
    useState<AdminTestimonio | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch testimonios (using mock data for now)
  useEffect(() => {
    const fetchTestimonios = async () => {
      setLoading(true);
      // TODO: Replace with real API call when available
      // const response = await getAdminTestimonios(
      //   { pageSize, currentPage, search, estado: estadoFilter },
      //   session?.user?.accessToken
      // );
      // if (response?.isSuccess) {
      //   setTestimonios(response.data.data);
      // }

      // Using mock data for development
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTestimonios(mockTestimonios);
      setLoading(false);
    };

    fetchTestimonios();
  }, [session, currentPage, pageSize]);

  // Filter testimonios based on search and filters
  const filteredTestimonios = useMemo(() => {
    return testimonios.filter((testimonio) => {
      const matchesSearch =
        search === "" ||
        testimonio.candidato.nombreCompleto
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        testimonio.candidato.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        testimonio.testimonioDetalle
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        testimonio.empresa.toLowerCase().includes(search.toLowerCase());

      const matchesEstado =
        estadoFilter === "todos" ||
        testimonio.estado.nombre.toLowerCase() === estadoFilter.toLowerCase();

      const matchesCalificacion =
        calificacionFilter === "todas" ||
        testimonio.calificacion === parseInt(calificacionFilter);

      return matchesSearch && matchesEstado && matchesCalificacion;
    });
  }, [testimonios, search, estadoFilter, calificacionFilter]);

  // Paginate filtered results
  const paginatedTestimonios = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTestimonios.slice(startIndex, startIndex + pageSize);
  }, [filteredTestimonios, currentPage, pageSize]);

  const totalItems = filteredTestimonios.length;

  // Stats
  const stats = useMemo(() => {
    const total = testimonios.length;
    const aprobados = testimonios.filter(
      (t) => t.estado.nombre.toLowerCase() === "aprobado",
    ).length;
    const pendientes = testimonios.filter(
      (t) => t.estado.nombre.toLowerCase() === "pendiente",
    ).length;
    const rechazados = testimonios.filter(
      (t) => t.estado.nombre.toLowerCase() === "rechazado",
    ).length;
    const avgRating =
      testimonios.length > 0
        ? (
            testimonios.reduce((acc, t) => acc + t.calificacion, 0) / total
          ).toFixed(1)
        : "0";

    return { total, aprobados, pendientes, rechazados, avgRating };
  }, [testimonios]);

  const handleView = (idTestimonio: string) => {
    const testimonio = testimonios.find((t) => t.idTestimonio === idTestimonio);
    if (testimonio) {
      setSelectedTestimonio(testimonio);
      setIsViewDialogOpen(true);
    }
  };

  const handleApprove = async (idTestimonio: string) => {
    // TODO: Implement with real API
    console.log("Approve testimonio:", idTestimonio);
    setTestimonios((prev) =>
      prev.map((t) =>
        t.idTestimonio === idTestimonio
          ? { ...t, estado: { id: 1, nombre: "Aprobado" } }
          : t,
      ),
    );
  };

  const handleReject = async (idTestimonio: string) => {
    // TODO: Implement with real API
    console.log("Reject testimonio:", idTestimonio);
    setTestimonios((prev) =>
      prev.map((t) =>
        t.idTestimonio === idTestimonio
          ? { ...t, estado: { id: 3, nombre: "Rechazado" } }
          : t,
      ),
    );
  };

  const handleDelete = async (idTestimonio: string) => {
    // TODO: Implement with real API and confirmation dialog
    console.log("Delete testimonio:", idTestimonio);
    setTestimonios((prev) =>
      prev.filter((t) => t.idTestimonio !== idTestimonio),
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.aprobados}</p>
          <p className="text-sm text-gray-500">Aprobados</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pendientes}
          </p>
          <p className="text-sm text-gray-500">Pendientes</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.rechazados}</p>
          <p className="text-sm text-gray-500">Rechazados</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <p className="text-2xl font-bold text-yellow-500">
              {stats.avgRating}
            </p>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-sm text-gray-500">Promedio</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por candidato, empresa o contenido..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Estado Filter */}
          <Select
            value={estadoFilter}
            onValueChange={(value) => {
              setEstadoFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="aprobado">Aprobado</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="rechazado">Rechazado</SelectItem>
            </SelectContent>
          </Select>

          {/* Calificación Filter */}
          <Select
            value={calificacionFilter}
            onValueChange={(value) => {
              setCalificacionFilter(value);
              setCurrentPage(1);
            }}
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
        {/* Table */}
        <TestimoniosTable
          testimonios={paginatedTestimonios}
          loading={loading}
          onView={handleView}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="testimonios"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-gray-100"
        />
      </Card>

      {/* View Testimonial Dialog */}
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
              {/* Candidato Info */}
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

              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Calificación:</span>
                {renderStars(selectedTestimonio.calificacion)}
              </div>

              {/* Testimonio Content */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 italic">
                  &quot;{selectedTestimonio.testimonioDetalle}&quot;
                </p>
              </div>

              {/* Meta Info */}
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
