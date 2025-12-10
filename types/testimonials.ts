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