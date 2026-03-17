export interface DashboardKpi {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: "up" | "down" | "neutral";
}

export interface RevenueData {
  month: string;
  amount: number;
}

export interface UserGrowthData {
  month: string;
  candidates: number;
  companies: number;
}

export const mockDashboardKpis: DashboardKpi[] = [
  {
    label: "Total Usuarios",
    value: "1,234",
    change: 12.5,
    trend: "up",
  },
  {
    label: "Ofertas Activas",
    value: "567",
    change: 8.2,
    trend: "up",
  },
  {
    label: "Ingresos Mensuales",
    value: "$4.2M",
    change: -2.4,
    trend: "down",
  },
  {
    label: "Nuevas Empresas",
    value: "89",
    change: 5.1,
    trend: "up",
  },
];

export const mockRevenueData: RevenueData[] = [
  { month: "Ene", amount: 2500000 },
  { month: "Feb", amount: 2800000 },
  { month: "Mar", amount: 2600000 },
  { month: "Abr", amount: 3200000 },
  { month: "May", amount: 3500000 },
  { month: "Jun", amount: 3100000 },
  { month: "Jul", amount: 4200000 },
];

export const mockUserGrowthData: UserGrowthData[] = [
  { month: "Ene", candidates: 120, companies: 15 },
  { month: "Feb", candidates: 150, companies: 20 },
  { month: "Mar", candidates: 180, companies: 18 },
  { month: "Abr", candidates: 220, companies: 25 },
  { month: "May", candidates: 260, companies: 30 },
  { month: "Jun", candidates: 310, companies: 28 },
  { month: "Jul", candidates: 380, companies: 35 },
];
