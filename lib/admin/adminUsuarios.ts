import { AdminUsuario } from "@/types/admin";
import { fetchApi } from "@/lib/apiClient";
import { z } from "zod";

/**
 * Schema for user form validation
 */
export const usuarioFormSchema = z.object({
  nombreCompleto: z.string().min(1, "El nombre completo es obligatorio"),
  email: z.string().email("Email inválido"),
  rol: z.string().min(1, "El rol es obligatorio"),
  tipoUsuario: z.enum(["admin", "empresa", "candidato"]),
  estado: z.enum(["activo", "inactivo", "suspendido", "pendiente"]),
});

export type UsuarioFormData = z.infer<typeof usuarioFormSchema>;

/**
 * Fetch paginated list of users for admin management
 * TODO: Replace with real endpoint when backend is available
 */
export async function getAdminUsuarios(
  params: {
    pageSize: number;
    currentPage: number;
    search?: string;
    estado?: string;
    rol?: string;
    tipoUsuario?: string;
  },
  token?: string,
) {
  const queryParams = new URLSearchParams({
    pageSize: params.pageSize.toString(),
    currentPage: params.currentPage.toString(),
    ...(params.search && { search: params.search }),
    ...(params.estado && { estado: params.estado }),
    ...(params.rol && { rol: params.rol }),
    ...(params.tipoUsuario && { tipoUsuario: params.tipoUsuario }),
  });

  return fetchApi<{ isSuccess: boolean; data: { totalItems: number; pageIndex: number; pageSize: number; data: AdminUsuario[] } }>(
    `/Admin/usuarios?${queryParams.toString()}`,
    { token },
  );
}

/**
 * Mock data for development when API is not available
 */
export const mockUsuarios: AdminUsuario[] = [
  {
    idUsuario: "usr-1",
    nombreCompleto: "María García López",
    email: "maria.garcia@email.com",
    rol: { idRol: "1", nombre: "Administrador" },
    fechaRegistro: "2023-01-15",
    ultimoAcceso: "2025-01-28T10:30:00",
    estado: { id: 1, nombre: "Activo" },
    tipoUsuario: "admin",
  },
  {
    idUsuario: "usr-2",
    nombreCompleto: "Carlos Mendoza Torres",
    email: "carlos.mendoza@empresa.com",
    rol: { idRol: "2", nombre: "Administrador Empresa" },
    fechaRegistro: "2023-03-20",
    ultimoAcceso: "2025-01-27T16:45:00",
    estado: { id: 1, nombre: "Activo" },
    tipoUsuario: "empresa",
  },
  {
    idUsuario: "usr-3",
    nombreCompleto: "Ana Patricia Ruiz",
    email: "ana.ruiz@email.com",
    rol: { idRol: "3", nombre: "Postulante" },
    fechaRegistro: "2024-02-10",
    ultimoAcceso: "2025-01-26T09:15:00",
    estado: { id: 1, nombre: "Activo" },
    tipoUsuario: "candidato",
  },
  {
    idUsuario: "usr-4",
    nombreCompleto: "Roberto Sánchez Vega",
    email: "roberto.sanchez@techcorp.com",
    rol: { idRol: "2", nombre: "Administrador Empresa" },
    fechaRegistro: "2023-06-05",
    ultimoAcceso: "2025-01-25T14:00:00",
    estado: { id: 1, nombre: "Activo" },
    tipoUsuario: "empresa",
  },
  {
    idUsuario: "usr-5",
    nombreCompleto: "Laura Fernández Díaz",
    email: "laura.fernandez@email.com",
    rol: { idRol: "3", nombre: "Postulante" },
    fechaRegistro: "2024-05-18",
    ultimoAcceso: "2025-01-24T11:30:00",
    estado: { id: 2, nombre: "Inactivo" },
    tipoUsuario: "candidato",
  },
  {
    idUsuario: "usr-6",
    nombreCompleto: "Admin Soporte Sistema",
    email: "soporte@portalempleo.com",
    rol: { idRol: "5", nombre: "Soporte" },
    fechaRegistro: "2023-08-01",
    ultimoAcceso: "2025-01-28T08:00:00",
    estado: { id: 1, nombre: "Activo" },
    tipoUsuario: "admin",
  },
  {
    idUsuario: "usr-7",
    nombreCompleto: "Jorge Pérez Morales",
    email: "jorge.perez@email.com",
    rol: { idRol: "3", nombre: "Postulante" },
    fechaRegistro: "2024-08-22",
    ultimoAcceso: undefined,
    estado: { id: 3, nombre: "Pendiente" },
    tipoUsuario: "candidato",
  },
  {
    idUsuario: "usr-8",
    nombreCompleto: "Tech Solutions SA",
    email: "contacto@techsolutions.com",
    rol: { idRol: "2", nombre: "Administrador Empresa" },
    fechaRegistro: "2023-11-12",
    ultimoAcceso: "2025-01-27T17:20:00",
    estado: { id: 1, nombre: "Activo" },
    tipoUsuario: "empresa",
  },
  {
    idUsuario: "usr-9",
    nombreCompleto: "Carmen López Ruiz",
    email: "carmen.lopez@email.com",
    rol: { idRol: "3", nombre: "Postulante" },
    fechaRegistro: "2024-09-05",
    ultimoAcceso: "2025-01-23T13:45:00",
    estado: { id: 4, nombre: "Suspendido" },
    tipoUsuario: "candidato",
  },
  {
    idUsuario: "usr-10",
    nombreCompleto: "Moderador Contenido",
    email: "moderador@portalempleo.com",
    rol: { idRol: "4", nombre: "Moderador" },
    fechaRegistro: "2023-09-15",
    ultimoAcceso: "2025-01-28T09:00:00",
    estado: { id: 1, nombre: "Activo" },
    tipoUsuario: "admin",
  },
];

/**
 * Mock functions for CRUD operations
 */
const mockUsuariosData = [...mockUsuarios];

export function createUsuarioMock(data: UsuarioFormData): AdminUsuario {
  const newId = `usr-${Date.now()}`;
  const rolMap: Record<string, { idRol: string; nombre: string }> = {
    administrador: { idRol: "1", nombre: "Administrador" },
    "administrador empresa": { idRol: "2", nombre: "Administrador Empresa" },
    postulante: { idRol: "3", nombre: "Postulante" },
    moderador: { idRol: "4", nombre: "Moderador" },
    soporte: { idRol: "5", nombre: "Soporte" },
  };

  const estadoMap: Record<string, { id: number; nombre: string }> = {
    activo: { id: 1, nombre: "Activo" },
    inactivo: { id: 2, nombre: "Inactivo" },
    suspendido: { id: 4, nombre: "Suspendido" },
    pendiente: { id: 3, nombre: "Pendiente" },
  };

  const newUsuario: AdminUsuario = {
    idUsuario: newId,
    nombreCompleto: data.nombreCompleto,
    email: data.email,
    rol: rolMap[data.rol] || rolMap.administrador,
    fechaRegistro: new Date().toISOString().split('T')[0],
    ultimoAcceso: undefined,
    estado: estadoMap[data.estado],
    tipoUsuario: data.tipoUsuario,
  };

  mockUsuariosData.push(newUsuario);
  return newUsuario;
}

export function updateUsuarioMock(idUsuario: string, data: UsuarioFormData): AdminUsuario | null {
  const index = mockUsuariosData.findIndex(u => u.idUsuario === idUsuario);
  if (index === -1) return null;

  const estadoMap: Record<string, { id: number; nombre: string }> = {
    activo: { id: 1, nombre: "Activo" },
    inactivo: { id: 2, nombre: "Inactivo" },
    suspendido: { id: 4, nombre: "Suspendido" },
    pendiente: { id: 3, nombre: "Pendiente" },
  };

  mockUsuariosData[index] = {
    ...mockUsuariosData[index],
    nombreCompleto: data.nombreCompleto,
    email: data.email,
    estado: estadoMap[data.estado],
  };

  return mockUsuariosData[index];
}

export function toggleUsuarioStatusMock(idUsuario: string): AdminUsuario | null {
  const index = mockUsuariosData.findIndex(u => u.idUsuario === idUsuario);
  if (index === -1) return null;

  const currentStatus = mockUsuariosData[index].estado.nombre.toLowerCase();
  const newStatus = currentStatus === "activo" ? { id: 2, nombre: "Inactivo" } : { id: 1, nombre: "Activo" };

  mockUsuariosData[index] = {
    ...mockUsuariosData[index],
    estado: newStatus,
  };

  return mockUsuariosData[index];
}

export function deleteUsuarioMock(idUsuario: string): boolean {
  const index = mockUsuariosData.findIndex(u => u.idUsuario === idUsuario);
  if (index === -1) return false;

  mockUsuariosData.splice(index, 1);
  return true;
}

export function getMockUsuarios(): AdminUsuario[] {
  return [...mockUsuariosData];
}
