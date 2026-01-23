import { fetchApi } from "@/lib/apiClient";
import { GenericResponse } from "@/types/user";

export type Candidate = {
  idUsuario: string;
  nombreCompleto: string;
  ubicacion: string;
  fotografia:string;
  habilidades: string[];
};

export type CandidatesListResponse = {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: Candidate[];
};

export type CandidatesListParams = {
  pageSize: number;
  currentPage: number;
  sortBy: string;
  sortDirection: string;
  idProvincia: number | string;
  idCiudad: number | string;
  searchTermn: string;
};

export async function fetchCandidatesList(
  params: CandidatesListParams,
  token?: string
): Promise<CandidatesListResponse | null> {
  const response = await fetchApi<GenericResponse<CandidatesListResponse>>("/Company/lista-candidatos",
    {
      method: "POST",
      body: {
        pageSize: params.pageSize,
        currentPage: params.currentPage - 1, // Convert from 1-indexed to 0-indexed
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
        idProvincia: params.idProvincia ? Number(params.idProvincia) : 0,
        idCiudad: params.idCiudad ? Number(params.idCiudad) : 0,
        searchTermn: params.searchTermn,
      },
      token,
    }
  );
  return response?.data || null;
}
