import { fetchApi } from "@/lib/apiClient";
import { GenericResponse } from "@/types/user";
import {
  AplicanteReal,
  GetAplicantesResponse,
  SearchCandidatesRequest,
  CandidateSearchPaginado,
  GetCandidateSearchResponse
} from "@/types/company";

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

export async function fetchAplicantesByVacante(
  idVacante: string,
  token?: string
): Promise<AplicanteReal[] | null> {
  const response = await fetchApi<GetAplicantesResponse>(
    `/Jobs/getUsuariosPostuladosByVacanteId/${idVacante}`,
    {
      method: "GET",
      token,
    }
  );
  return response?.data || null;
}

export async function searchCandidates(
  params: Partial<SearchCandidatesRequest>,
  token?: string
): Promise<CandidateSearchPaginado | null> {
  const requestBody: SearchCandidatesRequest = {
    pageSize: params.pageSize ?? 20,
    currentPage: params.currentPage ?? 1,
    searchTerm: params.searchTerm ?? "",
    sortBy: params.sortBy ?? "",
    sortDirection: params.sortDirection ?? "",
    idPais: params.idPais ?? 0,
    idProvincia: params.idProvincia ?? 0,
    idCiudad: params.idCiudad ?? 0,
    idNivelEstudio: params.idNivelEstudio ?? 0,
    idExperiencia: params.idExperiencia ?? 0,
    aniosExperienciaMin: params.aniosExperienciaMin ?? null,
    aniosExperienciaMax: params.aniosExperienciaMax ?? null,
    idDisponibilidad: params.idDisponibilidad ?? 0,
    edadMinima: params.edadMinima ?? null,
    edadMaxima: params.edadMaxima ?? null,
    salarioMinimoEsperado: params.salarioMinimoEsperado ?? null,
    salarioMaximoEsperado: params.salarioMaximoEsperado ?? null,
    idGenero: params.idGenero ?? 0,
    movilidadPropia: params.movilidadPropia ?? null,
    poseeLicenciaConducir: params.poseeLicenciaConducir ?? null,
    habilidades: params.habilidades ?? [],
  };

  const response = await fetchApi<GetCandidateSearchResponse>(
    "/Jobs/searchCandidates",
    {
      method: "POST",
      body: requestBody,
      token,
    }
  );

  return response?.data || null;
}
