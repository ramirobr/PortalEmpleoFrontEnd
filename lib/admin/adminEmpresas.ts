import { fetchApi } from "@/lib/apiClient";
import {
  AdminEmpresa,
  AdminEmpresasParams,
  DeleteEmpresaResponse,
  GetAdminEmpresasResponse,
  UpdateEmpresaStatusRequest,
  UpdateEmpresaStatusResponse,
} from "@/types/admin";

/**
 * Fetch paginated list of empresas for admin management
 */
export async function getAdminEmpresas(
  params: AdminEmpresasParams,
  token?: string,
): Promise<GetAdminEmpresasResponse | null> {
  const queryParams = new URLSearchParams({
    pageSize: params.pageSize.toString(),
    currentPage: params.currentPage.toString(),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortDirection && { sortDirection: params.sortDirection }),
    ...(params.search && { search: params.search }),
    ...(params.estado && { estado: params.estado }),
    ...(params.plan && { plan: params.plan }),
  });

  return fetchApi<GetAdminEmpresasResponse>(
    `/Admin/empresas?${queryParams.toString()}`,
    { token },
  );
}

/**
 * Update empresa status (activate/suspend)
 */
export async function updateEmpresaStatus(
  request: UpdateEmpresaStatusRequest,
  token?: string,
): Promise<UpdateEmpresaStatusResponse | null> {
  return fetchApi<UpdateEmpresaStatusResponse>("/Admin/empresa/status", {
    method: "PUT",
    token,
    body: request,
  });
}

/**
 * Delete an empresa
 */
export async function deleteEmpresa(
  idEmpresa: string,
  token?: string,
): Promise<DeleteEmpresaResponse | null> {
  return fetchApi<DeleteEmpresaResponse>(`/Admin/empresa/${idEmpresa}`, {
    method: "DELETE",
    token,
  });
}

/**
 * Mock data for development when API is not available
 */
export const mockEmpresas: AdminEmpresa[] = [
  {
    idEmpresa: "1",
    nombreEmpresa: "TechSolutions Ecuador",
    rut: "1791234567001",
    logoUrl: undefined,
    fechaRegistro: "2023-10-12",
    ofertasActivas: 14,
    plan: { id: 1, nombre: "Premium" },
    estado: { id: 1, nombre: "Activo" },
  },
  {
    idEmpresa: "2",
    nombreEmpresa: "Creative Labs Quito",
    rut: "0991234567001",
    logoUrl: undefined,
    fechaRegistro: "2023-11-05",
    ofertasActivas: 3,
    plan: { id: 2, nombre: "Básico" },
    estado: { id: 1, nombre: "Activo" },
  },
  {
    idEmpresa: "3",
    nombreEmpresa: "Innova Retail Guayaquil",
    rut: "1798765432001",
    logoUrl: undefined,
    fechaRegistro: "2023-12-18",
    ofertasActivas: 0,
    plan: { id: 1, nombre: "Premium" },
    estado: { id: 2, nombre: "Suspendido" },
  },
  {
    idEmpresa: "4",
    nombreEmpresa: "Salud Primero Ecuador",
    rut: "0191234567001",
    logoUrl: undefined,
    fechaRegistro: "2024-01-22",
    ofertasActivas: 8,
    plan: { id: 1, nombre: "Premium" },
    estado: { id: 1, nombre: "Activo" },
  },
  {
    idEmpresa: "5",
    nombreEmpresa: "Digital Marketing Cuenca",
    rut: "1198765432001",
    logoUrl: undefined,
    fechaRegistro: "2024-02-15",
    ofertasActivas: 5,
    plan: { id: 2, nombre: "Básico" },
    estado: { id: 1, nombre: "Activo" },
  },
];
