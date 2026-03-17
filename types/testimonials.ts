import { GenericResponse } from "./user"

export type Testimonial = {
  idTestimonio: string
  nombreCompleto: string
  cargo: string
  empresa: string
  testimonioDetalle: string
  fechaTestimonio: string
  calificacion: number
  foto: string
  fechaCreacion: string
}

export type TestimonialsResponse = GenericResponse<Testimonial[]>

export interface AdminTestimonial {
  totalItems: number
  pageIndex: number
  pageSize: number
  data: TestimonialData[]
}

export interface TestimonialData {
  idTestimonio: string
  candidato: Candidato
  cargo: string
  empresa: string
  testimonioDetalle: string
  fechaCreacion: string
  calificacion: number
  estado: Estado
}

export interface Candidato {
  idUsuario: string
  nombreCompleto: string
  email: string
  fotoUrl: string
}

export const EstadoNombre = {
  Publicado: "Publicado",
  Rechazado: "Rechazado",
  EnRevision: "En revisión",
} as const;

export type ESTADOS = typeof EstadoNombre[keyof typeof EstadoNombre]

export interface Estado {
  id: number
  nombre: ESTADOS
}

export type AdminTestimonialsResponse = GenericResponse<AdminTestimonial>

export interface TestimonialCounters {
  totalTestimonios: number
  totalTestimoniosPublicados: number
  totalTestimoniosEnRevision: number
  totalTestimoniosRechazados: number
  calificacionPromedio: number
}

export type TestimonialCountersResponse = GenericResponse<TestimonialCounters>
