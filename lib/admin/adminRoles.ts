import { fetchApi } from "@/lib/apiClient";
import {
  AdminRole,
  AdminRolesParams,
  CreateRoleRequest,
  CreateRoleResponse,
  DeleteRoleResponse,
  GetAdminRolesResponse,
  GetPermisosResponse,
  RolePermiso,
  UpdateRoleRequest,
  UpdateRoleResponse,
  UpdateRoleStatusResponse,
} from "@/types/admin";

/**
 * Fetch paginated list of roles for admin management
 */
export async function getAdminRoles(
  params: AdminRolesParams,
  token?: string,
): Promise<GetAdminRolesResponse | null> {
  const queryParams = new URLSearchParams({
    pageSize: params.pageSize.toString(),
    currentPage: params.currentPage.toString(),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortDirection && { sortDirection: params.sortDirection }),
    ...(params.search && { search: params.search }),
    ...(params.estado && { estado: params.estado }),
  });

  return fetchApi<GetAdminRolesResponse>(
    `/Admin/roles?${queryParams.toString()}`,
    { token },
  );
}

/**
 * Get all available permissions
 */
export async function getPermisos(
  token?: string,
): Promise<GetPermisosResponse | null> {
  return fetchApi<GetPermisosResponse>("/Admin/permisos", { token });
}

/**
 * Create a new role
 */
export async function createRole(
  request: CreateRoleRequest,
  token?: string,
): Promise<CreateRoleResponse | null> {
  return fetchApi<CreateRoleResponse>("/Admin/rol", {
    method: "POST",
    token,
    body: request,
  });
}

/**
 * Update an existing role
 */
export async function updateRole(
  request: UpdateRoleRequest,
  token?: string,
): Promise<UpdateRoleResponse | null> {
  return fetchApi<UpdateRoleResponse>(`/Admin/rol/${request.idRol}`, {
    method: "PUT",
    token,
    body: request,
  });
}

/**
 * Update role status (activate/deactivate)
 */
export async function updateRoleStatus(
  idRol: string,
  nuevoEstado: number,
  token?: string,
): Promise<UpdateRoleStatusResponse | null> {
  return fetchApi<UpdateRoleStatusResponse>("/Admin/rol/status", {
    method: "PUT",
    token,
    body: { idRol, nuevoEstado },
  });
}

/**
 * Delete a role
 */
export async function deleteRole(
  idRol: string,
  token?: string,
): Promise<DeleteRoleResponse | null> {
  return fetchApi<DeleteRoleResponse>(`/Admin/rol/${idRol}`, {
    method: "DELETE",
    token,
  });
}

/**
 * Mock permissions data for development
 */
export const mockPermisos: RolePermiso[] = [
  {
    idPermiso: "1",
    nombre: "Ver Dashboard",
    modulo: "Dashboard",
    descripcion: "Acceso al panel de control principal",
  },
  {
    idPermiso: "2",
    nombre: "Gestionar Empresas",
    modulo: "Empresas",
    descripcion: "Crear, editar y eliminar empresas",
  },
  {
    idPermiso: "3",
    nombre: "Ver Empresas",
    modulo: "Empresas",
    descripcion: "Ver listado de empresas",
  },
  {
    idPermiso: "4",
    nombre: "Gestionar Empleos",
    modulo: "Empleos",
    descripcion: "Crear, editar y eliminar ofertas de empleo",
  },
  {
    idPermiso: "5",
    nombre: "Ver Empleos",
    modulo: "Empleos",
    descripcion: "Ver listado de ofertas de empleo",
  },
  {
    idPermiso: "6",
    nombre: "Gestionar Candidatos",
    modulo: "Candidatos",
    descripcion: "Administrar candidatos y sus estados",
  },
  {
    idPermiso: "7",
    nombre: "Ver Candidatos",
    modulo: "Candidatos",
    descripcion: "Ver listado de candidatos",
  },
  {
    idPermiso: "8",
    nombre: "Gestionar Testimonios",
    modulo: "Testimonios",
    descripcion: "Aprobar, rechazar y eliminar testimonios",
  },
  {
    idPermiso: "9",
    nombre: "Gestionar Roles",
    modulo: "Roles",
    descripcion: "Crear, editar y eliminar roles del sistema",
  },
  {
    idPermiso: "10",
    nombre: "Gestionar Usuarios",
    modulo: "Usuarios",
    descripcion: "Administrar usuarios del sistema",
  },
];

/**
 * Mock data for development when API is not available
 */
export const mockRoles: AdminRole[] = [
  {
    idRol: "1",
    nombre: "Administrador",
    descripcion: "Acceso completo a todas las funcionalidades del sistema",
    permisos: mockPermisos,
    fechaCreacion: "2023-01-15",
    fechaActualizacion: "2024-06-20",
    usuariosAsignados: 3,
    estado: { id: 1, nombre: "Activo" },
  },
  {
    idRol: "2",
    nombre: "Administrador Empresa",
    descripcion: "Gestión de empresa y ofertas de empleo propias",
    permisos: mockPermisos.filter((p) =>
      ["3", "4", "5", "7"].includes(p.idPermiso),
    ),
    fechaCreacion: "2023-01-15",
    fechaActualizacion: "2024-03-10",
    usuariosAsignados: 45,
    estado: { id: 1, nombre: "Activo" },
  },
  {
    idRol: "3",
    nombre: "Postulante",
    descripcion: "Usuario candidato que puede aplicar a ofertas de empleo",
    permisos: mockPermisos.filter((p) => ["5"].includes(p.idPermiso)),
    fechaCreacion: "2023-01-15",
    fechaActualizacion: "2024-01-15",
    usuariosAsignados: 1250,
    estado: { id: 1, nombre: "Activo" },
  },
  {
    idRol: "4",
    nombre: "Moderador",
    descripcion: "Revisión y aprobación de contenido",
    permisos: mockPermisos.filter((p) =>
      ["1", "3", "5", "7", "8"].includes(p.idPermiso),
    ),
    fechaCreacion: "2023-06-01",
    fechaActualizacion: "2024-02-28",
    usuariosAsignados: 5,
    estado: { id: 1, nombre: "Activo" },
  },
  {
    idRol: "5",
    nombre: "Soporte",
    descripcion: "Atención a usuarios y resolución de problemas",
    permisos: mockPermisos.filter((p) =>
      ["1", "3", "5", "7"].includes(p.idPermiso),
    ),
    fechaCreacion: "2023-08-15",
    fechaActualizacion: "2024-04-05",
    usuariosAsignados: 8,
    estado: { id: 1, nombre: "Activo" },
  },
  {
    idRol: "6",
    nombre: "Invitado",
    descripcion: "Acceso limitado solo lectura",
    permisos: mockPermisos.filter((p) =>
      ["3", "5", "7"].includes(p.idPermiso),
    ),
    fechaCreacion: "2024-01-10",
    fechaActualizacion: "2024-01-10",
    usuariosAsignados: 0,
    estado: { id: 2, nombre: "Inactivo" },
  },
];
