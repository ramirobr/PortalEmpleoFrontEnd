import { GetJobByIdResponse } from "@/types/jobs";
import { fetchApi } from "../apiClient";

export async function fetchJobById(id: string) {
  const json = await fetchApi<GetJobByIdResponse>(`/Jobs/getJobById/${id}`);
  return json?.data;
}

export async function addVisitaVacante(idVacante: string, userId: string, token: string) {
  const json = await fetchApi("/Jobs/addVisitaVacante", {
    method: "POST",
    body: {
      idVacante,
      userId
    },
    token,
  });
  if (!json?.isSuccess) {
    console.error("Error añadiendo visita a la vacante")
  }
}