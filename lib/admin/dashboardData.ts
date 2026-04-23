import { fetchApi } from "@/lib/apiClient";
import { GenericResponse } from "@/types/user";

export interface RevenueData {
  month: string;
  amount: number;
}

export interface UserGrowthData {
  month: string;
  candidates: number;
  companies: number;
}

export interface AdminDashboardData {
  totalUsuariosActivos: number;
  totalOfertasActivas: number;
  totalEmpresasActivas: number;
}

export async function getAdminDashboard(token?: string) {
  return fetchApi<GenericResponse<AdminDashboardData>>("/Admin/dashboard", {
    method: "GET",
    token,
  });
}
