"use client";

import HeroBanner from "./HeroBanner";
import EmpresaStatsBanner from "./EmpresaStatsBanner";
import { CompanyProfileData, AplicanteReciente } from "@/types/company";

interface EmpresaDashboardContainerProps {
  companyName: string;
  cvsRecibidos: number;
  procesosActivos: number;
  anunciosCount: number;
  ofertasActivas: number;
  contrataciones: number;
  candidatosEnRevision: number;
  companyProfile: CompanyProfileData | null;
  aplicantesRecientes: AplicanteReciente[];
  children: React.ReactNode;
}

export default function EmpresaDashboardContainer({
  companyName,
  cvsRecibidos,
  procesosActivos,
  anunciosCount,
  ofertasActivas,
  contrataciones,
  candidatosEnRevision,
  companyProfile,
  aplicantesRecientes,
  children,
}: EmpresaDashboardContainerProps) {
  return (
    <>
      {/* Hero banner — full bleed */}
      <HeroBanner
        companyName={companyName}
        cvsRecibidos={cvsRecibidos}
        procesosActivos={procesosActivos}
        anunciosCount={anunciosCount}
        ofertasActivas={ofertasActivas}
        contrataciones={contrataciones}
        companyLogo={companyProfile?.logoUrl}
      />

      {/* Green stats banner */}
      <EmpresaStatsBanner
        contrataciones={contrataciones}
        cvsRecibidos={cvsRecibidos}
      />

      {/* Main content with standard padding */}
      <div className="mt-8">
        {children}
      </div>
    </>
  );
}
