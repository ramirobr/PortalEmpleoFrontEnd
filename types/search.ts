import { CatalogEndpoints } from "@/lib/catalog/fetch";
import { GenericResponse } from "./user";

export type CatalogsByType = {
  idCatalogo: number
  nombre: string
  descripcion: any
  codigo: any
  tipoCatalogo: string
  idCatalogoPadre: number
  orden: number
};

export type CatalogItem = {
  valor: number;
  nombre: string;
};

export type EmpresaItem = {
  idEmpresa: string
  razonSocial: string
};

export type CatalogsByTypeResponse = GenericResponse<CatalogsByType[]>
export type CatalogResponse = GenericResponse<CatalogItem[]>
export type ActiveCompaniesResponse = GenericResponse<EmpresaItem[]>
export type FiltersResponse = {
  activeCompanies: EmpresaItem[],
  ciudad: CatalogsByType[] | undefined
} & Record<CatalogEndpoints, CatalogItem[] | undefined>