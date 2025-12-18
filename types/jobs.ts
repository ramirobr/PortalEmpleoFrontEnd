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
  id: string
  titulo: string
  empresa: string
  modalidad: string
  ciudad: string
  provincia: string
  salario: string
  fecha: string
}

export type GetLastEightJobsResponse = GenericResponse<RecentJob[]>
