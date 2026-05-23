import { fetchApi } from "@/lib/apiClient";
import {
  AdminUsuarioCreateRequest,
  AdminUsuarioPasswordRequest,
  AdminUsuariosParams,
  CreateAdminUsuarioResponse,
  DeleteUsuarioResponse,
  GetAdminUsuariosResponse,
  UpdateAdminUsuarioPasswordResponse,
  UpdateUsuarioStatusResponse,
} from "@/types/admin";
import { CompanySignUpData } from "@/types/company";
import { SignupData } from "@/types/user";
import { z } from "zod";

export const usuarioFormSchema = z.object({
  nombreCompleto: z.string().min(1, "El nombre completo es obligatorio"),
  email: z.string().email("Email invalido"),
  roles: z.array(z.string()).min(1, "Selecciona al menos un rol"),
  tipoUsuario: z.enum(["admin", "empresa", "candidato"]),
  estado: z.string().min(1, "El estado es obligatorio"),
});

export type UsuarioFormData = z.infer<typeof usuarioFormSchema>;

export async function getAdminUsuarios(
  params: AdminUsuariosParams,
  token?: string,
): Promise<GetAdminUsuariosResponse | null> {
  return fetchApi<GetAdminUsuariosResponse>("/Admin/usuarios", {
    method: "POST",
    token,
    body: {
      pageSize: params.pageSize,
      currentPage: params.currentPage,
      sortBy: params.sortBy ?? "",
      sortDirection: params.sortDirection ?? "",
      searchQuery: params.search ?? "",
      idEstado: params.estado ? Number(params.estado) : 0,
      rol: params.rol === "todos" ? "" : params.rol ?? "",
      tipoUsuario: params.tipoUsuario === "todos" ? "" : params.tipoUsuario ?? "",
    },
  });
}

export async function updateUsuarioStatus(
  idUsuario: string,
  nuevoEstado: number,
  token?: string,
): Promise<UpdateUsuarioStatusResponse | null> {
  return fetchApi<UpdateUsuarioStatusResponse>(
    `/Admin/usuarios/${idUsuario}/estado/${nuevoEstado}`,
    {
      method: "PUT",
      token,
    },
  );
}

export async function createAdminPostulante(
  data: SignupData,
  token?: string,
) {
  return fetchApi("/Admin/usuarios/postulante", {
    method: "POST",
    token,
    body: data,
  });
}

export async function createAdminEmpresa(
  data: CompanySignUpData,
  token?: string,
) {
  return fetchApi("/Admin/usuarios/empresa", {
    method: "POST",
    token,
    body: data,
  });
}

export async function createAdminUsuario(
  data: AdminUsuarioCreateRequest,
  token?: string,
): Promise<CreateAdminUsuarioResponse | null> {
  return fetchApi<CreateAdminUsuarioResponse>("/Admin/usuarios/admin", {
    method: "POST",
    token,
    body: data,
  });
}

export async function updateAdminUsuario(
  idUsuario: string,
  data: {
    nombreCompleto: string;
    email: string;
    roles?: string[];
    idEstadoCuenta?: number;
  },
  token?: string,
) {
  return fetchApi(`/Admin/usuarios/${idUsuario}`, {
    method: "PUT",
    token,
    body: {
      idUsuario,
      ...data,
    },
  });
}

export async function updateAdminUsuarioPassword(
  data: AdminUsuarioPasswordRequest,
  token?: string,
): Promise<UpdateAdminUsuarioPasswordResponse | null> {
  return fetchApi<UpdateAdminUsuarioPasswordResponse>(
    `/Admin/usuarios/${data.idUsuario}/password`,
    {
      method: "PUT",
      token,
      body: data,
    },
  );
}

export async function deleteUsuario(
  idUsuario: string,
  token?: string,
): Promise<DeleteUsuarioResponse | null> {
  return fetchApi<DeleteUsuarioResponse>(`/Admin/usuarios/${idUsuario}`, {
    method: "DELETE",
    token,
  });
}
