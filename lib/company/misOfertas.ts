import { fetchApi } from "@/lib/apiClient";
import {
  GetMisOfertasEmpleoResponse,
  MisOfertasEmpleoParams,
  MisOfertasEmpleoPaginado,
} from "@/types/company";

/**
 * Obtiene las ofertas de empleo de una empresa con paginación
 * @param params - Parámetros de búsqueda y paginación
 * @param token - Token de autenticación
 * @returns Promise con los datos de las ofertas o null si hay error
 */
export async function fetchMisOfertasEmpleo(
  params: MisOfertasEmpleoParams,
  token?: string
): Promise<MisOfertasEmpleoPaginado | null> {
  const response = await fetchApi<GetMisOfertasEmpleoResponse>(
    "/Company/mis-ofertas-empleo",
    {
      method: "POST",
      body: {
        pageSize: params.pageSize,
        currentPage: params.currentPage,
        sortBy: params.sortBy || "",
        sortDirection: params.sortDirection || "",
        idEmpresa: params.idEmpresa,
        periodoBusqueda: params.periodoBusqueda,
      },
      token,
    }
  );
  console.log("Parámetros de solicitud de mis ofertas de empleo:", params);
  console.log("Respuesta de mis ofertas de empleo:", response);

  if (!response || !response.isSuccess) {
    console.warn("Error al obtener ofertas de empleo:", response?.messages);
    return null;
  }

  return response.data;
}
