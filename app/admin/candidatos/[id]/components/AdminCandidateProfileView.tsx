"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UserInfoData } from "@/types/user";
import { normalizeImageSrc } from "@/lib/utils";
import AdminCandidateHeader from "./AdminCandidateHeader";
import AdminCandidateContactInfo from "./AdminCandidateContactInfo";
import AdminCandidateExperiencia from "./AdminCandidateExperiencia";
import AdminCandidateEducacion from "./AdminCandidateEducacion";
import AdminCandidateHabilidades from "./AdminCandidateHabilidades";
import AdminCandidateIdiomas from "./AdminCandidateIdiomas";
import AdminCandidateResumen from "./AdminCandidateResumen";

interface AdminCandidateProfileViewProps {
  candidate: UserInfoData;
  picture?: string;
}

export default function AdminCandidateProfileView({
  candidate,
  picture,
}: AdminCandidateProfileViewProps) {
  const ubicacion = [
    candidate.datosContacto?.ciudad,
    candidate.datosContacto?.provincia,
    candidate.datosContacto?.pais,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Link
          href="/admin/candidatos"
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors mb-4"
        >
          <ArrowLeft className="size-4 mr-1" />
          Volver a candidatos
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900">Perfil del candidato</h1>
        <p className="mt-1 text-slate-500">Consulta administrativa del postulante seleccionado.</p>
      </div>

      {/* Header Card */}
      <AdminCandidateHeader
        datosPersonales={candidate.datosPersonales}
        ubicacion={ubicacion || "Ubicación no disponible"}
        picture={normalizeImageSrc(picture as string | undefined)}
        estadoCuenta={candidate.estadoCuenta || "Sin estado"}
        fechaRegistro={candidate.fechaRegistro}
      />

      {/* Content Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left Column — main content */}
        <div className="space-y-6 xl:col-span-2">
          {candidate.resumen && <AdminCandidateResumen resumen={candidate.resumen} />}
          <AdminCandidateExperiencia experiencias={candidate.experienciaLaboral ?? []} />
          <AdminCandidateEducacion educaciones={candidate.educacion ?? []} />
        </div>

        {/* Right Column — secondary info */}
        <div className="space-y-6">
          <AdminCandidateContactInfo
            datosContacto={candidate.datosContacto}
            datosPersonales={candidate.datosPersonales}
          />
          <AdminCandidateHabilidades habilidades={candidate.habiliades ?? []} />
          <AdminCandidateIdiomas idiomas={candidate.idiomas ?? []} />
        </div>
      </div>
    </div>
  );
}
