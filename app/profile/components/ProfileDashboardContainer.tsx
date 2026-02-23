"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { DashboardInfoData } from "@/types/user";
import { fetchApi } from "@/lib/apiClient";
import Dashboard from "./Dashboard";
import NotificacionesCandidato from "./NotificacionesCandidato";
import JobsApplied from "./JobsApplied";

interface DashboardInfoResponse {
  data: DashboardInfoData;
}

interface ProfileDashboardContainerProps {
  initialDashboard: DashboardInfoData;
}

export default function ProfileDashboardContainer({
  initialDashboard,
}: ProfileDashboardContainerProps) {
  const { data: session } = useSession();
  const [dashboard, setDashboard] = useState<DashboardInfoData>(initialDashboard);

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
  }, [session?.user?.id, session?.user?.accessToken]);

  return (
    <>
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
