import { CatalogEndpoints } from "@/lib/catalog/fetch";
import { CatalogItem, CatalogsByType } from "./search";

export type FormFieldsResponse = {
  ciudad: CatalogsByType[] | undefined
  industria: CatalogsByType[] | undefined
  condicionFiscal: CatalogsByType[] | undefined
  cantidadEmpleados: CatalogsByType[] | undefined
} & Record<CatalogEndpoints, CatalogItem[] | undefined>

export type CompanySignUpData = {
  nombreEmpresa: string,
  razonSocial: string,
  idCondicionFiscal: number,
  documento: string,
  idCiudad: number,
  calle: string,
  numeroCasa: string,
  codigoPostal: string,
  telefono: string,
  idIndustria: number,
  idCantidadEmpleados: number,
  sitioWeb: string,
  nombres: string,
  apellidos: string,
  email: string,
  password: string,
  aceptaTerminoCondiciones: boolean,
  quieroRecibirNewsLetter: boolean,
  quieroParticiparEncuestas: boolean
}