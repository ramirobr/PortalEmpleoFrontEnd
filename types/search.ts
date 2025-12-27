import { CatalogTypes } from "@/lib/catalog/fetch";
import { GenericResponse } from "./user";
import { CatalogFieldsFromTypes } from "./generic";

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

export type ActiveCompanies = {
  activeCompanies: EmpresaItem[] | undefined
}
export const FILTERS = ["FILTRO_FECHAS", "EXPERIENCIA", "MODALIDAD_TRABAJO", "PROVINCIA", "CIUDAD"] as const;
export type FiltersResponse =
  CatalogFieldsFromTypes<typeof FILTERS, CatalogsByType[]> & ActiveCompanies;
