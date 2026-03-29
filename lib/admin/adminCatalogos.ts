import { fetchApi } from "@/lib/apiClient";
import {
  AdminCatalogo,
  CatalogoFormValues,
  CreateCatalogoResponse,
  DeleteCatalogoResponse,
  GetAdminCatalogosResponse,
  UpdateCatalogoResponse,
} from "@/types/admin";
import { CatalogsByType, CatalogsByTypeResponse } from "@/types/search";

/**
 * Fetch all catalogs (admin view includes inactive)
 */
export async function getAdminCatalogos(
  token?: string,
): Promise<GetAdminCatalogosResponse | null> {
  return fetchApi<GetAdminCatalogosResponse>("/Catalog/getAllCatalogs", {
    token,
  });
}

/**
 * Create a new catalog entry
 */
export async function createCatalogo(
  data: CatalogoFormValues,
  token?: string,
): Promise<CreateCatalogoResponse | null> {
  return fetchApi<CreateCatalogoResponse>("/Catalog/create", {
    method: "POST",
    token,
    body: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      tipoCatalogo: data.tipoCatalogo,
      codigo: data.codigo,
      valorEntero: data.valorEntero,
      valorCadena: data.valorCadena,
      orden: data.orden,
      activo: data.activo,
      idCatalogoPadre: data.idCatalogoPadre,
    },
  });
}

/**
 * Update an existing catalog entry
 */
export async function updateCatalogo(
  idCatalogo: number,
  data: CatalogoFormValues,
  token?: string,
): Promise<UpdateCatalogoResponse | null> {
  return fetchApi<UpdateCatalogoResponse>("/Catalog/update", {
    method: "PUT",
    token,
    body: {
      idCatalogo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      tipoCatalogo: data.tipoCatalogo,
      codigo: data.codigo,
      valorEntero: data.valorEntero,
      valorCadena: data.valorCadena,
      orden: data.orden,
      activo: data.activo,
      idCatalogoPadre: data.idCatalogoPadre,
    },
  });
}

/**
 * Delete a catalog entry by ID
 */
export async function deleteCatalogo(
  idCatalogo: number,
  token?: string,
): Promise<DeleteCatalogoResponse | null> {
  return fetchApi<DeleteCatalogoResponse>(`/Catalog/delete/${idCatalogo}`, {
    method: "DELETE",
    token,
  });
}

/**
 * Extract unique catalog types from a catalog list
 */
export function getCatalogTypes(catalogs: AdminCatalogo[]): string[] {
  return [...new Set(catalogs.map((c) => c.tipoCatalogo))].sort();
}

/**
 * Fetch active catalogs by type (client-side, requires auth token)
 */
export async function getCatalogosByType(
  type: string,
  token?: string,
): Promise<CatalogsByType[]> {
  const response = await fetchApi<CatalogsByTypeResponse>(
    `/Catalog/getAllCatalogsByType/${type}`,
    { token },
  );
  return response?.data ?? [];
}
