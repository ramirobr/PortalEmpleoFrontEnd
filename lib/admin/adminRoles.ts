import { fetchApi } from "@/lib/apiClient";
import {
  AdminRole,
  AdminRolesPaginado,
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
import { GenericResponse } from "@/types/user";

type RawPermiso = Omit<RolePermiso, "idPermiso"> & {
  idPermiso: string;
  codigo?: string;
};

type RawRole = Omit<AdminRole, "estado" | "permisos"> & {
  estado: boolean | AdminRole["estado"];
  permisos: RawPermiso[];
};

type RawRolesResponse = GenericResponse<
  Omit<AdminRolesPaginado, "data"> & { data: RawRole[] }
>;

type RawRoleResponse = GenericResponse<RawRole | string>;

export async function getAdminRoles(
  params: AdminRolesParams,
  token?: string,
): Promise<GetAdminRolesResponse | null> {
  const response = await fetchApi<RawRolesResponse>("/Admin/roles-permisos", {
    method: "POST",
    token,
    body: {
      pageSize: params.pageSize,
      currentPage: params.currentPage,
      sortBy: params.sortBy ?? "",
      sortDirection: params.sortDirection ?? "",
      searchQuery: params.search ?? "",
      estado: params.estado ?? "",
    },
  });

  if (!response?.isSuccess || !response.data) return response as GetAdminRolesResponse | null;

  return {
    ...response,
    data: {
      ...response.data,
      data: response.data.data.map(mapRole),
    },
  };
}

export async function getPermisos(
  token?: string,
): Promise<GetPermisosResponse | null> {
  return fetchApi<GetPermisosResponse>("/Admin/permisos", { token });
}

export async function createRole(
  request: CreateRoleRequest,
  token?: string,
): Promise<CreateRoleResponse | null> {
  const response = await fetchApi<RawRoleResponse>("/Admin/crear-rol", {
    method: "POST",
    token,
    body: request,
  });

  return normalizeRoleResponse(response);
}

export async function updateRole(
  request: UpdateRoleRequest,
  token?: string,
): Promise<UpdateRoleResponse | null> {
  const response = await fetchApi<RawRoleResponse>(`/Admin/rol/${request.idRol}`, {
    method: "PUT",
    token,
    body: request,
  });

  return normalizeRoleResponse(response);
}

export async function updateRoleStatus(
  idRol: string,
  nuevoEstado: number,
  token?: string,
): Promise<UpdateRoleStatusResponse | null> {
  return fetchApi<UpdateRoleStatusResponse>("/Admin/rol/set-status", {
    method: "PUT",
    token,
    body: { idRol, activo: nuevoEstado === 1 },
  });
}

export async function deleteRole(
  idRol: string,
  token?: string,
): Promise<DeleteRoleResponse | null> {
  return fetchApi<DeleteRoleResponse>(`/Admin/rol/${idRol}`, {
    method: "DELETE",
    token,
  });
}

function normalizeRoleResponse<T extends CreateRoleResponse | UpdateRoleResponse>(
  response: RawRoleResponse | null,
): T | null {
  if (!response) return null;
  if (!response.isSuccess || typeof response.data === "string") {
    return response as unknown as T;
  }

  return {
    ...response,
    data: mapRole(response.data),
  } as T;
}

function mapRole(role: RawRole): AdminRole {
  return {
    ...role,
    descripcion: role.descripcion ?? "",
    permisos: role.permisos.map((permiso) => ({
      idPermiso: permiso.idPermiso,
      nombre: permiso.nombre,
      codigo: permiso.codigo,
      modulo: permiso.modulo,
      descripcion: permiso.descripcion ?? "",
    })),
    estado:
      typeof role.estado === "boolean"
        ? {
            id: role.estado ? 1 : 2,
            nombre: role.estado ? "Activo" : "Inactivo",
          }
        : role.estado,
  };
}
