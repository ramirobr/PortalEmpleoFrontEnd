"server only"
import { CatalogsByType, CatalogsByTypeResponse } from "@/types/search";
import { fetchApi } from "../apiClient";

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
  "DISPONIBILIDAD",
  "GENERO",
  "ESTADO_CIVIL",
] as const;

export type CatalogTypes = typeof catalogTypes[number];
export async function fetchAllCatalogsByType(type: CatalogTypes): Promise<CatalogsByType[] | undefined> {
  const json = await fetchApi<CatalogsByTypeResponse>(`/Catalog/getAllCatalogsByType/${type}`);
  return json?.data;
}
