import { fetchApi } from "@/lib/apiClient";
import { GetUserRolePermissionsResponse } from "@/types/admin";

export async function getUserRolePermissions(
  userId: string,
  token?: string,
): Promise<GetUserRolePermissionsResponse | null> {
  return fetchApi<GetUserRolePermissionsResponse>(
    `/Admin/usuario/${userId}/rol-permisos`,
    { token },
  );
}
