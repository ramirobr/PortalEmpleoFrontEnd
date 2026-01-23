"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserTestimonial, estadoTestimonioMap } from "@/lib/testimonials/schema";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import EditTestimonioDialog from "./EditTestimonioDialog";
import { deleteTestimonial } from "@/lib/testimonials/fetch";
import { useSession } from "next-auth/react";

function TestimonioCard({
  testimonio,
  onEdit,
  onDelete,
}: {
  testimonio: UserTestimonial;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const estadoConfig = {
    aprobado: {
      icon: CheckCircle2,
      label: "Publicado",
      className: "text-green-600 bg-green-50",
    },
    pendiente: {
      icon: Clock,
      label: "En revisión",
      className: "text-yellow-600 bg-yellow-50",
    },
    rechazado: {
      icon: AlertCircle,
      label: "Rechazado",
      className: "text-red-600 bg-red-50",
    },
  };

  // Mapear el estado del API al estado interno
  const estadoKey = estadoTestimonioMap[testimonio.estadoTestimonio] || "pendiente";
  const estado = estadoConfig[estadoKey as keyof typeof estadoConfig];
  const EstadoIcon = estado.icon;

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        {/* Header con estado y acciones */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
              estado.className
            )}
          >
            <EstadoIcon className="w-4 h-4" />
            {testimonio.estadoTestimonio || estado.label}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(testimonio.idTestimonio)}
              title="Editar testimonio"
            >
              <Pencil className="w-4 h-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onDelete(testimonio.idTestimonio)}
              title="Eliminar testimonio"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Cargo y empresa */}
        <div>
          <h4 className="font-semibold text-gray-800">{testimonio.cargo}</h4>
          <p className="text-sm text-muted-foreground">{testimonio.empresa}</p>
        </div>

        {/* Testimonio */}
        <p className="text-gray-600 leading-relaxed">
          &ldquo;{testimonio.testimonioDetalle}&rdquo;
        </p>

        {/* Footer con calificación y fecha */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-5 h-5",
                  star <= testimonio.calificacion
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(testimonio.fechaTestimonio).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Card>
  );
}

interface TestimoniosListProps {
  testimonios: UserTestimonial[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRefresh: () => void;
}

export default function TestimoniosList({
  testimonios,
  totalItems,
  currentPage,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
  onRefresh,
}: TestimoniosListProps) {
  const { data: session } = useSession();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTestimonio, setSelectedTestimonio] = useState<UserTestimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageSizeChange = (value: string) => {
    onPageSizeChange(Number(value));
  };

  const handleEdit = (id: string) => {
    const testimonio = testimonios.find((t) => t.idTestimonio === id);
    if (testimonio) {
      setSelectedTestimonio(testimonio);
      setEditDialogOpen(true);
    }
  };

  const handleEditSuccess = () => {
    setSelectedTestimonio(null);
    onRefresh();
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId || !session?.user.accessToken) return;

    setIsDeleting(true);
    try {
      const response = await deleteTestimonial(selectedId, session.user.accessToken);
      
      if (response?.isSuccess) {
        toast.success("Testimonio eliminado correctamente");
        onRefresh();
      } else {
        toast.error(response?.messages?.[0] || "Error al eliminar el testimonio");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Ocurrió un error al eliminar el testimonio");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Cargando testimonios...</p>
        </div>
      </Card>
    );
  }

  if (testimonios.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Star className="w-12 h-12 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600">
            Aún no tienes testimonios
          </h3>
          <p className="text-sm">
            Comparte tu experiencia y ayuda a otros usuarios a conocer
            PortalEmpleo.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Mis testimonios ({totalItems})
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mostrar:</span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">por página</span>
          </div>
        </div>

        <div className="grid gap-4">
          {testimonios.map((testimonio) => (
            <TestimonioCard
              key={testimonio.idTestimonio}
              testimonio={testimonio}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <span className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * pageSize + 1} -{" "}
              {Math.min(currentPage * pageSize, totalItems)} de {totalItems} testimonios
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 border rounded bg-white disabled:opacity-50 cursor-pointer hover:bg-gray-50"
              >
                Anterior
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Página</span>
                <Select
                  value={String(currentPage)}
                  onValueChange={(value) => onPageChange(Number(value))}
                  disabled={loading}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <SelectItem key={page} value={String(page)}>
                        {page}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">de {totalPages}</span>
              </div>

              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages || loading}
                className="px-3 py-1 border rounded bg-white disabled:opacity-50 cursor-pointer hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar testimonio?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El testimonio será eliminado
              permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditTestimonioDialog
        testimonio={selectedTestimonio}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
