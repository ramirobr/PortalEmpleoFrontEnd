import { fetchApi } from "@/lib/apiClient";
import {
  AdminEmpleosParams,
  DeleteEmpleoResponse,
  GetAdminEmpleosResponse,
  UpdateEmpleoStatusResponse,
} from "@/types/admin";

/**
 * Fetch paginated list of empleos for admin management
 */
export async function getAdminEmpleos(
  params: AdminEmpleosParams,
  token?: string,
): Promise<GetAdminEmpleosResponse | null> {
  return fetchApi<GetAdminEmpleosResponse>("/Admin/empleos", {
    method: "POST",
    token,
    body: {
      pageSize: params.pageSize,
      currentPage: params.currentPage,
      sortBy: params.sortBy ?? "",
      sortDirection: params.sortDirection ?? "",
      searchQuery: params.searchQuery ?? "",
      idEstado: params.idEstado ?? 0,
    },
  });
}

/**
 * Update empleo status (close/open/suspend)
 */
export async function updateEmpleoStatus(
  idVacante: string,
  nuevoEstado: number,
  token?: string,
): Promise<UpdateEmpleoStatusResponse | null> {
  return fetchApi<UpdateEmpleoStatusResponse>("/Admin/vacante/status", {
    method: "PUT",
    token,
    body: { idVacante, nuevoEstado },
  });
}

/**
 * Delete an empleo
 */
export async function deleteEmpleo(
  idVacante: string,
  token?: string,
): Promise<DeleteEmpleoResponse | null> {
  return fetchApi<DeleteEmpleoResponse>(`/Admin/vacante/${idVacante}`, {
    method: "DELETE",
    token,
  });
}
