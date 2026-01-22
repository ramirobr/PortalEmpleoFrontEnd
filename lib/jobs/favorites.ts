import { PlainStringDataMessage } from "@/types/user";
import { fetchApi } from "../apiClient";
import { User } from "next-auth";
import { GetLastEightJobsResponse } from "@/types/jobs";

export async function addVacanteFavorita(idVacante: string, userId: string, token: string) {
  const json = await fetchApi<PlainStringDataMessage>("/Jobs/addVacanteFavorita", {
    method: "POST",
    body: {
      idVacante,
      userId
    },
    token,
  });
  if (!json?.isSuccess) {
    console.error("Error guardando vacante como favorita")
  }
}

export async function removeVacanteFavorita(idVacante: string, userId: string, token: string) {
  const json = await fetchApi<PlainStringDataMessage>(`/Jobs/removeVacanteFavorita/${idVacante}/${userId}`, {
    method: "DELETE",
    token,
  });
  if (!json?.isSuccess) {
    console.error("Error eliminando vacante como favorita")
  }
}

export async function getVacantesFavoritasByUser(user?: User) {
  if (!user) return
  const json = await fetchApi<GetLastEightJobsResponse>(`/Jobs/getVacantesFavoritasByUser/${user.id}`, {
    token: user.accessToken,
  });
  return json?.data
}
