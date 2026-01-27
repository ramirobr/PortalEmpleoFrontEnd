import { fetchApi } from "@/lib/apiClient";
import {
  AdminEmpleo,
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
  const queryParams = new URLSearchParams({
    pageSize: params.pageSize.toString(),
    currentPage: params.currentPage.toString(),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortDirection && { sortDirection: params.sortDirection }),
    ...(params.search && { search: params.search }),
    ...(params.estado && { estado: params.estado }),
  });

  return fetchApi<GetAdminEmpleosResponse>(
    `/Admin/vacantes?${queryParams.toString()}`,
    { token },
  );
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

/**
 * Mock data for development when API is not available
 */
export const mockEmpleos: AdminEmpleo[] = [
  {
    idVacante: "1",
    titulo: "Senior Frontend Developer",
    empresa: {
      nombre: "TechSolutions Ecuador",
      logoUrl: undefined,
    },
    fechaPublicacion: "2024-01-20",
    ubicacion: "Quito, Ecuador",
    postulantes: 45,
    estado: { id: 1, nombre: "Activo" },
    modalidad: "Remoto",
  },
  {
    idVacante: "2",
    titulo: "Diseñador UX/UI",
    empresa: {
      nombre: "Creative Labs Quito",
      logoUrl: undefined,
    },
    fechaPublicacion: "2024-01-22",
    ubicacion: "Guayaquil, Ecuador",
    postulantes: 12,
    estado: { id: 1, nombre: "Activo" },
    modalidad: "Híbrido",
  },
  {
    idVacante: "3",
    titulo: "Gerente de Ventas",
    empresa: {
      nombre: "Innova Retail",
      logoUrl: undefined,
    },
    fechaPublicacion: "2023-12-15",
    ubicacion: "Cuenca, Ecuador",
    postulantes: 8,
    estado: { id: 2, nombre: "Cerrado" },
    modalidad: "Presencial",
  },
  {
    idVacante: "4",
    titulo: "Data Analyst",
    empresa: {
      nombre: "Salud Primero Ecuador",
      logoUrl: undefined,
    },
    fechaPublicacion: "2024-01-25",
    ubicacion: "Quito, Ecuador",
    postulantes: 3,
    estado: { id: 3, nombre: "Pendiente" },
    modalidad: "Remoto",
  },
  {
    idVacante: "5",
    titulo: "Community Manager",
    empresa: {
      nombre: "Digital Marketing Cuenca",
      logoUrl: undefined,
    },
    fechaPublicacion: "2024-01-18",
    ubicacion: "Cuenca, Ecuador",
    postulantes: 89,
    estado: { id: 1, nombre: "Activo" },
    modalidad: "Remoto",
  },
  // Expanded data
  ...Array.from({ length: 25 }).map((_, i) => ({
    idVacante: `mock-${i + 6}`,
    titulo: `Vacante Mock ${i + 6}`,
    empresa: {
      nombre: `Empresa Mock ${i + 6}`,
      logoUrl: undefined,
    },
    fechaPublicacion: "2024-02-10",
    ubicacion: "Quito, Ecuador",
    postulantes: Math.floor(Math.random() * 50),
    estado: {
      id: i % 5 === 0 ? 2 : 1,
      nombre: i % 5 === 0 ? "Cerrado" : "Activo",
    },
    modalidad: i % 3 === 0 ? "Remoto" : "Presencial",
  })),
];
