"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Star, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  testimonialFormSchema,
  TestimonialFormData,
  UserTestimonial,
} from "@/lib/testimonials/schema";
import { updateTestimonial } from "@/lib/testimonials/fetch";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/context/authStore";

interface EditTestimonioDialogProps {
  testimonio: UserTestimonial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditTestimonioDialog({
  testimonio,
  open,
  onOpenChange,
  onSuccess,
}: EditTestimonioDialogProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const userId = useAuthStore((s) => s.id);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      cargo: "",
      empresa: "",
      testimonioDetalle: "",
      calificacion: 0,
    },
  });

  const watchCalificacion = form.watch("calificacion");

  // Cargar datos del testimonio cuando se abre el modal
  useEffect(() => {
    if (testimonio && open) {
      form.reset({
        cargo: testimonio.cargo,
        empresa: testimonio.empresa,
        testimonioDetalle: testimonio.testimonioDetalle,
        calificacion: testimonio.calificacion,
      });
    }
  }, [testimonio, open, form]);

  const handleSubmit = async (data: TestimonialFormData) => {
    if (!userId || !session?.user.accessToken || !testimonio) {
      toast.error("Error al actualizar el testimonio");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateTestimonial(
        {
          idTestimonio: testimonio.idTestimonio,
          idUsuario: userId,
          cargo: data.cargo,
          empresa: data.empresa,
          testimonioDetalle: data.testimonioDetalle,
          calificacion: data.calificacion,
        },
        session.user.accessToken,
      );

      if (response?.isSuccess) {
        toast.success("Testimonio actualizado correctamente");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(
          response?.messages?.[0] || "Error al actualizar el testimonio",
        );
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Ocurrió un error al actualizar el testimonio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setHoveredStar(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            Editar Testimonio
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo actual *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Tech Solutions S.A." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="testimonioDetalle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tu testimonio *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cuéntanos cómo PortalEmpleo te ayudó en tu búsqueda de empleo..."
                      className="min-h-[120px] resize-none"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <span className="text-xs text-gray-500">
                      {field.value?.length || 0}/500 caracteres
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="calificacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calificación *</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          title={`Calificar ${star} estrella${star > 1 ? "s" : ""}`}
                          className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => field.onChange(star)}
                        >
                          <Star
                            className={cn(
                              "w-8 h-8 transition-colors",
                              (hoveredStar || watchCalificacion) >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
