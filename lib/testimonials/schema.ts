import { z } from "zod";

export const testimonialFormSchema = z.object({
  cargo: z.string().min(1, "El cargo es obligatorio"),
  empresa: z.string().min(1, "La empresa es obligatoria"),
  testimonioDetalle: z
    .string()
    .min(20, "El testimonio debe tener al menos 20 caracteres")
    .max(500, "El testimonio no puede exceder los 500 caracteres"),
  calificacion: z
    .number()
    .min(1, "La calificación mínima es 1")
    .max(5, "La calificación máxima es 5"),
});

export type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

// Tipo para testimonio del usuario desde el API
export type UserTestimonial = {
  idTestimonio: string;
  nombreCompleto: string;
  cargo: string;
  empresa: string;
  testimonioDetalle: string;
  fechaTestimonio: string;
  calificacion: number;
  idEstadoTestimonio: number;
  estadoTestimonio: string;
};

// Mapeo de estados del API a estados internos
export const estadoTestimonioMap: Record<string, string> = {
  "En revisión": "pendiente",
  "Aprobado": "aprobado",
  "Publicado": "aprobado",
  "Rechazado": "rechazado",
};

// Mock data para desarrollo
export const mockUserTestimonials: UserTestimonial[] = [
  {
    idTestimonio: "1",
    nombreCompleto: "Usuario Demo",
    cargo: "Frontend Developer",
    empresa: "Tech Solutions S.A.",
    testimonioDetalle:
      "Gracias a PortalEmpleo encontré el trabajo de mis sueños. La plataforma es muy intuitiva y me permitió conectar con empresas que realmente valoran el talento.",
    fechaTestimonio: "2026-01-15",
    calificacion: 5,
    idEstadoTestimonio: 3601,
    estadoTestimonio: "Aprobado",
  },
  {
    idTestimonio: "2",
    nombreCompleto: "Usuario Demo",
    cargo: "React Developer",
    empresa: "Innovation Labs",
    testimonioDetalle:
      "El proceso de búsqueda de empleo fue muy sencillo. Las alertas personalizadas me ayudaron a encontrar ofertas que realmente se ajustaban a mi perfil.",
    fechaTestimonio: "2025-11-20",
    calificacion: 4,
    idEstadoTestimonio: 3600,
    estadoTestimonio: "En revisión",
  },
];
