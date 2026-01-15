import { CatalogsByType } from "./search";

export type FormFieldsResponse = {
  ciudad?: CatalogsByType[];
  industria?: CatalogsByType[];
  condicionFiscal?: CatalogsByType[];
  cantidadEmpleados?: CatalogsByType[];
  genero?: CatalogsByType[];
};

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
  idGenero?: number,
  email: string,
  password: string,
  aceptaTerminoCondiciones: boolean,
  quieroRecibirNewsLetter: boolean,
  quieroParticiparEncuestas: boolean
}