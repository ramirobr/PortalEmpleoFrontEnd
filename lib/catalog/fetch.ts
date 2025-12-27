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

const catalogTypes = [
  "CANTIDAD_EMPLEADOS",
  "CATEGORIA_HABILIDAD",
  "CIUDAD",
  "CONDICION_FISCAL",
  "ESTADO_APLICACION",
  "ESTADO_CUENTA",
  "ESTADO_EMPRESA",
  "ESTADO_VACANTE",
  "EXPERIENCIA",
  "FILTRO_FECHAS",
  "INDUSTRIA",
  "MODALIDAD_TRABAJO",
  "NIVEL_ESTUDIO",
  "NIVEL_IDIOMA",
  "PAIS",
  "PROVINCIA",
  "TIPO_ACEPTACION",
  "TIPO_DOCUMENTO",
  "TIPO_EMPLEO",
  "TIPO_USUARIO",
] as const;

export type CatalogTypes = typeof catalogTypes[number];

export async function fetchAllCatalogsByType(type: CatalogTypes): Promise<CatalogsByType[] | undefined> {
  const json = await fetchApi<CatalogsByTypeResponse>(`/Catalog/getAllCatalogsByType/${type}`);
  return json?.data;
}
