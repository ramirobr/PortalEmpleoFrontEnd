import { fetchApi } from "@/lib/apiClient";
import {
  AdminCandidato,
  AdminCandidatoUpdateRequest,
  AdminCandidatosPaginado,
  AdminCandidatosParams,
  DeleteCandidatoResponse,
  GetAdminCandidatoResponse,
  GetAdminCandidatosResponse,
  UpdateAdminCandidatoResponse,
  UpdateCandidatoStatusResponse,
} from "@/types/admin";
import { GenericResponse } from "@/types/user";

type RawAdminCandidato = Partial<AdminCandidato> & {
  nombre?: string;
  apellido?: string;
  ciudad?: string;
  pais?: string;
  aplicaciones?: number;
};

type RawCandidatosResponse = GenericResponse<
  Omit<AdminCandidatosPaginado, "data"> & { data: RawAdminCandidato[] }
>;

export async function getAdminCandidatos(
  params: AdminCandidatosParams,
  token?: string,
): Promise<GetAdminCandidatosResponse | null> {
  const response = await fetchApi<RawCandidatosResponse>("/Admin/candidatos", {
    method: "POST",
    token,
    body: {
      pageSize: params.pageSize,
      currentPage: params.currentPage,
      sortBy: params.sortBy ?? "",
      sortDirection: params.sortDirection ?? "",
      searchQuery: params.search ?? "",
      idEstado: params.estado ? Number(params.estado) : 0,
    },
  });

  if (!response?.isSuccess || !response.data) return response as GetAdminCandidatosResponse | null;

  return {
    ...response,
    data: {
      ...response.data,
      data: response.data.data.map(mapCandidato),
    },
  };
}

export async function updateCandidatoStatus(
  idUsuario: string,
  nuevoEstado: number,
  token?: string,
): Promise<UpdateCandidatoStatusResponse | null> {
  return fetchApi<UpdateCandidatoStatusResponse>(
    `/Admin/candidatos/${idUsuario}/estado/${nuevoEstado}`,
    {
      method: "PUT",
      token,
    },
  );
}

export async function getAdminCandidatoById(
  idUsuario: string,
  token?: string,
): Promise<GetAdminCandidatoResponse | null> {
  return fetchApi<GetAdminCandidatoResponse>(`/Admin/candidatos/${idUsuario}`, {
    token,
  });
}

export async function updateAdminCandidato(
  request: AdminCandidatoUpdateRequest,
  token?: string,
): Promise<UpdateAdminCandidatoResponse | null> {
  return fetchApi<UpdateAdminCandidatoResponse>(
    `/Admin/candidatos/${request.idUsuario}`,
    {
      method: "PUT",
      token,
      body: request,
    },
  );
}

export async function deleteCandidato(
  idUsuario: string,
  token?: string,
): Promise<DeleteCandidatoResponse | null> {
  return fetchApi<DeleteCandidatoResponse>(`/Admin/candidatos/${idUsuario}`, {
    method: "DELETE",
    token,
  });
}

function mapCandidato(candidato: RawAdminCandidato): AdminCandidato {
  const estado =
    typeof candidato.estado === "string"
      ? { id: 0, nombre: candidato.estado }
      : candidato.estado ?? { id: 0, nombre: "Sin estado" };

  return {
    idUsuario: candidato.idUsuario ?? "",
    nombreCompleto:
      candidato.nombreCompleto ??
      `${candidato.nombre ?? ""} ${candidato.apellido ?? ""}`.trim(),
    email: candidato.email ?? "",
    telefono: candidato.telefono ?? "",
    fotoUrl: candidato.fotoUrl,
    fechaRegistro: candidato.fechaRegistro ?? "",
    ubicacion:
      candidato.ubicacion ??
      [candidato.ciudad, candidato.pais].filter(Boolean).join(", "),
    totalAplicaciones:
      candidato.totalAplicaciones ?? candidato.aplicaciones ?? 0,
    estado,
    perfilCompleto: candidato.perfilCompleto ?? true,
  };
}
