"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  Briefcase,
  Building2,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DashboardKpiCard from "./components/DashboardKpiCard";
import { getAdminDashboard, AdminDashboardData } from "@/lib/admin/dashboardData";
import { getAdminEmpresas } from "@/lib/admin/adminEmpresas";
import { getAdminEmpleos } from "@/lib/admin/adminEmpleos";
import { AdminEmpleo, AdminEmpresa } from "@/types/admin";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Pill from "@/components/shared/components/Pill";
import Link from "next/link";
import { AdminTableLoading } from "./components/AdminTableStates";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<AdminDashboardData | null>(null);
  const [empresasRecientes, setEmpresasRecientes] = useState<AdminEmpresa[]>([]);
  const [empleosRecientes, setEmpleosRecientes] = useState<AdminEmpleo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [dashboardRes, empresasRes, empleosRes] = await Promise.all([
        getAdminDashboard(session?.user?.accessToken),
        getAdminEmpresas({ pageSize: 4, currentPage: 1 }, session?.user?.accessToken),
        getAdminEmpleos({ pageSize: 4, currentPage: 1 }, session?.user?.accessToken),
      ]);
      if (dashboardRes?.isSuccess) setKpis(dashboardRes.data);
      if (empresasRes?.isSuccess) setEmpresasRecientes(empresasRes.data.data);
      if (empleosRes?.isSuccess) setEmpleosRecientes(empleosRes.data.data);
      setLoading(false);
    };
    fetchData();
  }, [session]);

  if (loading) {
    return <AdminTableLoading message="Cargando dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardKpiCard
          title="Usuarios Activos"
          value={kpis?.totalUsuariosActivos ?? 0}
          icon={Users}
          iconColorClass="text-blue-600"
          iconBgClass="bg-blue-50"
        />
        <DashboardKpiCard
          title="Ofertas Activas"
          value={kpis?.totalOfertasActivas ?? 0}
          icon={Briefcase}
          iconColorClass="text-purple-600"
          iconBgClass="bg-purple-50"
        />
        <DashboardKpiCard
          title="Empresas Activas"
          value={kpis?.totalEmpresasActivas ?? 0}
          icon={Building2}
          iconColorClass="text-green-600"
          iconBgClass="bg-green-50"
        />
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
              {empresasRecientes.map((empresa) => (
                <div
                  key={empresa.idEmpresa}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-gray-200 text-gray-600 text-xs">
                        {empresa.nombreEmpresa.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {empresa.nombreEmpresa}
                      </p>
                      <p className="text-xs text-gray-500">{empresa.numeroDocumento}</p>
                    </div>
                  </div>
                  <Pill
                    variant="custom"
                    bgColor={
                      empresa.plan === "Premium"
                        ? "bg-teal-50 text-teal-600"
                        : "bg-gray-100 text-gray-600"
                    }
                    className="w-fit scale-90"
                    noButton
                  >
                    {empresa.plan}
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
              {empleosRecientes.map((empleo) => (
                <div
                  key={empleo.idVacante}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {empleo.tituloPuesto}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">
                        {empleo.empresa}
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

