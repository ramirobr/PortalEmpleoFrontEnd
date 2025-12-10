import { CatalogEndpoints } from "@/lib/catalog/fetch";
import { CatalogItem, CatalogsByType } from "./search";

export type FormFieldsResponse = {
  ciudad: CatalogsByType[] | undefined
} & Record<CatalogEndpoints, CatalogItem[] | undefined>

export type CompanySignUpData = {
  nombreEmpresa: string
  razonSocial: string
  condicionFiscal: string
  documento: string
  provincia: string
  ciudad: string
  calle: string
  numeroCasa: string
  codigoPostal: string
  telefono: string
  industria: string
  cantidadEmpleados: string
  nombres: string
  apellidos: string
  email: string
  password: string
  aceptaTerminoCondiciones: boolean
  quieroRecibirNewsLetter: boolean
  quieroParticiparEncuestas: boolean
}