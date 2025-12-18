import { CatalogTypes } from "@/lib/catalog/fetch";
import { GenericResponse } from "./user";

export type CatalogsByType = {
  idCatalogo: number
  nombre: string
  tipoCatalogo: string
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
} & Record<CatalogTypes, CatalogsByType[] | undefined>