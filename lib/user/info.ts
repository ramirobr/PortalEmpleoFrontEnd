import { CurriculumResponse, DashboardInfoResponse, UserInfoResponse } from "@/types/user";
import { User } from "next-auth";
import { fetchApi } from "../apiClient";

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
  const json = await fetchApi(`/User/user-picture/${user.id}`, {
    token: user.accessToken
  });
  return json?.data;
}

export const getCandidateInfoById = async (candidateId: string, token: string) => {
  const json = await fetchApi<UserInfoResponse>(`/User/user-info/${candidateId}`, {
    token
  });
  return json?.data;
}

export const getCandidatePicById = async (candidateId: string, token: string) => {
  const json = await fetchApi(`/User/user-picture/${candidateId}`, {
    token
  });
  return json?.data;
}

export const addProfileVisit = async (userId: string, idEmpresa: string, token: string) => {
  try {
    await fetchApi(`/User/add-profile-visit`, {
      method: 'POST',
      body: { userId, idEmpresa },
      token
    });
  } catch {
    // Silently fail - this is just for tracking visits
    console.warn('Failed to register profile visit');
  }
}