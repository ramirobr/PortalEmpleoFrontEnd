import { fetchApi } from "@/lib/apiClient";
import {
  AdminCandidato,
  AdminCandidatosParams,
  DeleteCandidatoResponse,
  GetAdminCandidatosResponse,
  UpdateCandidatoStatusResponse,
} from "@/types/admin";

/**
 * Fetch paginated list of candidatos for admin management
 */
export async function getAdminCandidatos(
  params: AdminCandidatosParams,
  token?: string,
): Promise<GetAdminCandidatosResponse | null> {
  const queryParams = new URLSearchParams({
    pageSize: params.pageSize.toString(),
    currentPage: params.currentPage.toString(),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortDirection && { sortDirection: params.sortDirection }),
    ...(params.search && { search: params.search }),
    ...(params.estado && { estado: params.estado }),
  });

  return fetchApi<GetAdminCandidatosResponse>(
    `/Admin/candidatos?${queryParams.toString()}`,
    { token },
  );
}

/**
 * Update candidato status (activate/suspend)
 */
export async function updateCandidatoStatus(
  idUsuario: string,
  nuevoEstado: number,
  token?: string,
): Promise<UpdateCandidatoStatusResponse | null> {
  return fetchApi<UpdateCandidatoStatusResponse>("/Admin/candidato/status", {
    method: "PUT",
    token,
    body: { idUsuario, nuevoEstado },
  });
}

/**
 * Delete a candidato
 */
export async function deleteCandidato(
  idUsuario: string,
  token?: string,
): Promise<DeleteCandidatoResponse | null> {
  return fetchApi<DeleteCandidatoResponse>(`/Admin/candidato/${idUsuario}`, {
    method: "DELETE",
    token,
  });
}

/**
 * Mock data for development when API is not available
 */
export const mockCandidatos: AdminCandidato[] = [
  {
    idUsuario: "1",
    nombreCompleto: "María García López",
    email: "maria.garcia@email.com",
    telefono: "+593 9 1234 5678",
    fotoUrl: undefined,
    fechaRegistro: "2023-10-15",
    ubicacion: "Quito, Ecuador",
    totalAplicaciones: 12,
    estado: { id: 1, nombre: "Activo" },
    perfilCompleto: true,
  },
  {
    idUsuario: "2",
    nombreCompleto: "Carlos Rodríguez Muñoz",
    email: "carlos.rodriguez@email.com",
    telefono: "+593 9 8765 4321",
    fotoUrl: undefined,
    fechaRegistro: "2023-11-22",
    ubicacion: "Guayaquil, Ecuador",
    totalAplicaciones: 5,
    estado: { id: 1, nombre: "Activo" },
    perfilCompleto: true,
  },
  {
    idUsuario: "3",
    nombreCompleto: "Ana Martínez Silva",
    email: "ana.martinez@email.com",
    telefono: "+593 9 5555 1234",
    fotoUrl: undefined,
    fechaRegistro: "2023-12-01",
    ubicacion: "Cuenca, Ecuador",
    totalAplicaciones: 0,
    estado: { id: 2, nombre: "Suspendido" },
    perfilCompleto: false,
  },
  {
    idUsuario: "4",
    nombreCompleto: "Pedro Sánchez Torres",
    email: "pedro.sanchez@email.com",
    telefono: "+593 9 7777 8888",
    fotoUrl: undefined,
    fechaRegistro: "2024-01-10",
    ubicacion: "Manta, Ecuador",
    totalAplicaciones: 8,
    estado: { id: 1, nombre: "Activo" },
    perfilCompleto: true,
  },
  {
    idUsuario: "5",
    nombreCompleto: "Laura Fernández Díaz",
    email: "laura.fernandez@email.com",
    telefono: "+593 9 9999 0000",
    fotoUrl: undefined,
    fechaRegistro: "2024-01-18",
    ubicacion: "Quito, Ecuador",
    totalAplicaciones: 3,
    estado: { id: 3, nombre: "Pendiente" },
    perfilCompleto: false,
  },
  // Expanded data
  ...Array.from({ length: 25 }).map((_, i) => ({
    idUsuario: `mock-${i + 6}`,
    nombreCompleto: `Candidato Mock ${i + 6}`,
    email: `candidato${i + 6}@email.com`,
    telefono: "+593 9 0000 0000",
    fotoUrl: undefined,
    fechaRegistro: "2024-02-01",
    ubicacion: "Quito, Ecuador",
    totalAplicaciones: Math.floor(Math.random() * 20),
    estado: {
      id: i % 5 === 0 ? 2 : 1,
      nombre: i % 5 === 0 ? "Suspendido" : "Activo",
    },
    perfilCompleto: i % 3 !== 0,
  })),
];
