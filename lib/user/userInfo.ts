import { UserInfoResponse } from "@/types/profile";
import { fetchApi } from "../apiClient";

const TEMP_ID = "2419319B-1264-4E74-89EC-4360DACC5EA8"

export const getUserInfoByUserId = async (/* id: string */ token: string) => {
  const json = await fetchApi<UserInfoResponse>(`/User/user-info/${TEMP_ID}`, {
    token
  });
  return json?.data;
}