import { GenericResponse } from "./user"

interface DashboardInfoData {
  userName: string
  userEmail: string
  userRole: string
  ubicacion: string
  totalApplications: number
  revision: number
  elegido: number
  visitas: number
  tieneCurriculumPrincipal: boolean
  totalEducaciones: number
  totalExperiencias: number
  totalHabilidades: number
  totalIdiomas: number
  totalCertificaciones: number
  resumenProfesional: string
  disponibilidad: string
  listaTrabajosAplicados: ListaTrabajosAplicado[]
}

interface ListaTrabajosAplicado {
  estado: string
  fechaAplicacion: string
  titulo: string
  empresa: string
}

export type DashboardInfoResponse = GenericResponse<DashboardInfoData[]>

export interface UserInfoData {
  userId: string
  estadoCuenta: string
  fechaRegistro: string
  ultimoAcceso: string
  datosPersonales: DatosPersonales
  datosContacto: DatosContacto
  educacion: Educacion[]
  experienciaLaboral: ExperienciaLaboral[]
  habiliades: Habilidades[]
}

interface DatosPersonales {
  nombre: string
  apellido: string
  tipoDocumento: string
  numeroDocumento: string
  fechaNacimiento: string
  nacionalidad: string
}

export interface DatosContacto {
  email: string
  phoneNumber: string
  address: string
  ciudad: string
  pais: string
  provincia: string
}

export interface Educacion {
  id: string
  titulo: string
  institucion: string
  fechaInicio: string
  fechaFin: string
  estaCursando: boolean
  periodo: string
}

export interface ExperienciaLaboral {
  id: string
  puesto: string
  empresa: string
  fechaInicio: string
  fechaFin: string
  estaTrabajando: boolean
  descripcion: string
  ciudad: string
  pais: string
  sector: string
}

export interface Habilidades {
  id: string
  nombre: string
  nivel: string
  categoria: string
}

export type UserInfoResponse = GenericResponse<UserInfoData>
