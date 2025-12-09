"server only"
import { CatalogItem, CatalogResponse, CatalogsByType, CatalogsByTypeResponse } from "@/types/search";
import { fetchApi } from "../apiClient";

const endpoints = [
  'provincias',
  'tipoEmpleo',
  'cantidadEmpleados',
  'condicionFiscal',
  'industria',
  'modalidadTrabajo',
  'filtroFechas',
  'nivelEstudio',
  'experiencia',
  'nivelIdioma'
] as const;

export type CatalogEndpoints = typeof endpoints[number];

export async function fetchCatalog(endpoint: CatalogEndpoints): Promise<CatalogItem[] | undefined> {
  const json = await fetchApi<CatalogResponse>(`/Catalog/${endpoint}`);
  return json?.data;
}

export async function fetchAllCatalogsByType(type: string): Promise<CatalogsByType[] | undefined> {
  const json = await fetchApi<CatalogsByTypeResponse>(`/Catalog/getAllCatalogsByType/${type}`);
  return json?.data;
}
