"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { DashboardInfoData } from "@/types/user";
import { fetchApi } from "@/lib/apiClient";
import Dashboard from "./Dashboard";
import NotificacionesCandidato from "./NotificacionesCandidato";
import JobsApplied from "./JobsApplied";
import DashboardProfileHeader from "./DashboardProfileHeader";
import DashboardQuickActions from "./DashboardQuickActions";

interface DashboardInfoResponse {
  data: DashboardInfoData;
}

interface ProfileDashboardContainerProps {
  initialDashboard: DashboardInfoData;
  userPic?: string;
  userName?: string;
  resumenProfesional?: string;
}

export default function ProfileDashboardContainer({
  initialDashboard,
  userPic,
  userName,
  resumenProfesional,
}: ProfileDashboardContainerProps) {
  const { data: session } = useSession();
  const [dashboard, setDashboard] =
    useState<DashboardInfoData>(initialDashboard);

  const reloadDashboard = useCallback(async () => {
    if (!session?.user?.id || !session?.user?.accessToken) return;

    try {
      const response = await fetchApi<DashboardInfoResponse>(
        `/User/dashboard-info/${session.user.id}`,
        {
          token: session.user.accessToken,
        },
      );

      if (response?.data) {
        setDashboard(response.data);
      }
    } catch (error) {
      console.error("Error reloading dashboard:", error);
    }
  }, [session]);

  return (
    <>
      <DashboardProfileHeader
        userName={userName || dashboard.userName}
        resumenProfesional={resumenProfesional || dashboard.resumenProfesional}
        userPic={userPic}
      />
      <DashboardQuickActions />
      <Dashboard
        visitas={dashboard.visitas}
        elegido={dashboard.elegido}
        revision={dashboard.revision}
        totalApplications={dashboard.totalApplications}
      />
      <NotificacionesCandidato
        notificacionesIniciales={dashboard.notificaciones || []}
        onNotificacionLeida={reloadDashboard}
      />
      <JobsApplied listaTrabajosAplicados={dashboard.listaTrabajosAplicados} />
    </>
  );
}
