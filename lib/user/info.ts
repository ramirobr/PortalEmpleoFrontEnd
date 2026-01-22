import { CurriculumResponse, DashboardInfoResponse, PlainStringDataMessage, UserInfoResponse } from "@/types/user";
import { fetchApi } from "../apiClient";
import { User } from "next-auth";

export const getUserInfoByUserId = async (user: User) => {
  const json = await fetchApi<UserInfoResponse>(`/User/user-info/${user.id}`, {
    token: user.accessToken
  });
  return json?.data;
}

export const getDashboardInfoByUserId = async (id: string, token: string) => {
  const json = await fetchApi<DashboardInfoResponse>(`/User/dashboard-info/${id}`, {
    token
  });
  return json?.data;
}

export const getCurriculumByUserId = async (user?: User) => {
  if (!user) return
  const json = await fetchApi<CurriculumResponse>(`/User/${user.id}/curriculum`, {
    token: user.accessToken
  });
  return json?.data;
}

export const getUserPic = async (user?: User) => {
  if (!user) return
  const json = await fetchApi<PlainStringDataMessage>(`/User/user-picture/${user.id}`, {
    token: user.accessToken
  });
  return json?.data;
}