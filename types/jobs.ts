import { GenericResponse } from "@/types/user"

export type Job = {
  idVacante: string
  nombreEmpresa: string
  logoEmpresa: any
  titulo: string
  descripcion: string
  requisitos: string
  nivelEstudios: string
  experienciaMinima: number
  modalidad: string
  ciudad: string
  provincia: string
  pais: string
  salarioBase: number
  salarioMaximo: number
  fechaPublicacion: string
  fechaCierre: string
  correoContacto: string
  numeroPostulantes: number
  numeroVistas: number
}

export type GetAllJobsResponse = GenericResponse<Jobs>

export type Jobs = {
  totalItems: number
  pageIndex: number
  pageSize: number
  data: Job[]
}

export type RecentJob = {
  ciudad: string
  provincia: string
  tituloPuesto: string
  modalidad: string
  logo: any
}

export type GetLastEightJobsResponse = GenericResponse<RecentJob[]>
