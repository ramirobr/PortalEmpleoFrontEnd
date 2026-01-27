"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Plus, Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  testimonialFormSchema,
  TestimonialFormData,
} from "@/lib/testimonials/schema";
import { createTestimonial } from "@/lib/testimonials/fetch";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/context/authStore";

interface TestimonioFormProps {
  onSuccess?: () => void;
}

export default function TestimonioForm({ onSuccess }: TestimonioFormProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSubmit = async (data: TestimonialFormData) => {
    if (!userId || !session?.user.accessToken) {
      toast.error("Debes iniciar sesión para enviar un testimonio");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createTestimonial(
        {
          idUsuario: userId,
          cargo: data.cargo,
          empresa: data.empresa,
          testimonioDetalle: data.testimonioDetalle,
          calificacion: data.calificacion,
        },
        session.user.accessToken,
      );

      if (response?.isSuccess) {
        toast.success(
          "¡Gracias por tu testimonio! Será revisado antes de publicarse.",
        );
        form.reset();
        setIsOpen(false);
        onSuccess?.();
      } else {
        toast.error(response?.messages?.[0] || "Error al enviar el testimonio");
      }
    } catch (error) {
      console.error("Error creating testimonial:", error);
      toast.error("Ocurrió un error al enviar el testimonio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              ¿Quieres compartir tu experiencia?
            </h3>
            <p className="text-sm text-muted-foreground">
              Tu testimonio ayuda a otros usuarios a conocer PortalEmpleo
            </p>
          </div>
          <Button onClick={() => setIsOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-primary mb-6">
        Nuevo Testimonio
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  <span className="text-xs text-muted-foreground">
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
                  Enviando...
                </>
              ) : (
                "Enviar Testimonio"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
