"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Building2,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DashboardKpiCard from "./components/DashboardKpiCard";
import { SimpleBarChart, DualLineChart } from "./components/DashboardCharts";
import {
  mockDashboardKpis,
  mockRevenueData,
  mockUserGrowthData,
} from "@/lib/admin/dashboardData";
import { mockEmpresas } from "@/lib/admin/adminEmpresas";
import { mockEmpleos } from "@/lib/admin/adminEmpleos";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pill from "@/components/shared/components/Pill";
import Link from "next/link";
import { AdminTableLoading } from "./components/AdminTableStates";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AdminTableLoading message="Cargando dashboard..." />;
  }

  // Icons map for KPIs
  const kpiIcons = [Users, Briefcase, DollarSign, TrendingUp];
  const kpiColors = [
    "text-blue-600",
    "text-purple-600",
    "text-green-600",
    "text-orange-600",
  ];
  const kpiBgs = ["bg-blue-50", "bg-purple-50", "bg-green-50", "bg-orange-50"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockDashboardKpis.map((kpi, index) => (
          <DashboardKpiCard
            key={index}
            title={kpi.label}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            icon={kpiIcons[index]}
            iconColorClass={kpiColors[index]}
            iconBgClass={kpiBgs[index]}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart (2/3 width) */}
        <Card className="lg:col-span-2 p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle>Ingresos Mensuales</CardTitle>
            <p className="text-sm text-gray-500">
              Resumen de facturación último semestre
            </p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <SimpleBarChart data={mockRevenueData} height={240} />
          </CardContent>
        </Card>

        {/* User Growth Chart (1/3 width) */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle>Crecimiento de Usuarios</CardTitle>
            <p className="text-sm text-gray-500">
              Nuevos registros vs. periodo anterior
            </p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <DualLineChart data={mockUserGrowthData} height={240} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Companies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Empresas Recientes</CardTitle>
            <Link
              href="/admin/empresas"
              className="text-sm text-primary hover:underline"
            >
              Ver todas
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEmpresas.slice(0, 4).map((empresa) => (
                <div
                  key={empresa.idEmpresa}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-lg">
                      <AvatarImage
                        src={empresa.logoUrl}
                        alt={empresa.nombreEmpresa}
                      />
                      <AvatarFallback className="rounded-lg bg-gray-200 text-gray-600 text-xs">
                        {empresa.nombreEmpresa.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {empresa.nombreEmpresa}
                      </p>
                      <p className="text-xs text-gray-500">{empresa.rut}</p>
                    </div>
                  </div>
                  <Pill
                    variant="custom"
                    bgColor={
                      empresa.plan.nombre === "Premium"
                        ? "bg-teal-50 text-teal-600"
                        : "bg-gray-100 text-gray-600"
                    }
                    className="w-fit scale-90"
                    noButton
                  >
                    {empresa.plan.nombre}
                  </Pill>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Empleos Recientes</CardTitle>
            <Link
              href="/admin/empleos"
              className="text-sm text-primary hover:underline"
            >
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEmpleos.slice(0, 4).map((empleo) => (
                <div
                  key={empleo.idVacante}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {empleo.titulo}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">
                        {empleo.empresa.nombre}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />
                        {empleo.ubicacion}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-gray-900 block">
                      {empleo.postulantes}
                    </span>
                    <span className="text-[10px] text-gray-500">posts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
