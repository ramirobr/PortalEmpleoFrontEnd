"use client";

import { useState, useEffect } from "react";
import { DashboardInfoData } from "@/types/user";
import { useAuthStore } from "@/context/authStore";
import DashboardHeroBanner from "./DashboardHeroBanner";
import DashboardStatsBanner from "./DashboardStatsBanner";
import DashboardEmpleosDestacados from "./DashboardEmpleosDestacados";
import DashboardEmplosMasBuscados from "./DashboardEmplosMasBuscados";
import DashboardCTAButton from "./DashboardCTAButton";

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
}: ProfileDashboardContainerProps) {
  const [dashboard] = useState<DashboardInfoData>(initialDashboard);
  const setNotifications = useAuthStore((s) => s.setNotifications);

  useEffect(() => {
    setNotifications(dashboard.notificaciones ?? []);
  }, [dashboard.notificaciones, setNotifications]);

  return (
    <div className="-mx-8">
      {/* Hero banner — full bleed (overrides container padding) */}
      <DashboardHeroBanner
        userName={userName || dashboard.userName}
        userPic={userPic}
        perfilCompletado={dashboard.perfilCompletado}
      />

      {/* Green stats banner */}
      <DashboardStatsBanner />

      {/* Rest of content back inside normal padding */}
      <div className="px-8">
       
        {/* Two-column job sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <DashboardEmpleosDestacados
            jobs={dashboard.listaTrabajosAplicados || []}
            perfilCompletado={dashboard.perfilCompletado}
          />
          <DashboardEmplosMasBuscados />
        </div>

        {/* CTA button */}
        <DashboardCTAButton />
      </div>
    </div>
  );
}
