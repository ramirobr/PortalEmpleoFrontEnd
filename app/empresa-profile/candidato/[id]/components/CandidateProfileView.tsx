"use client";

import { UserInfoData } from "@/types/user";
import CandidateHeader from "./CandidateHeader";
import CandidateContactInfo from "./CandidateContactInfo";
import CandidateEducacion from "./CandidateEducacion";
import CandidateExperiencia from "./CandidateExperiencia";
import CandidateHabilidades from "./CandidateHabilidades";
import CandidateIdiomas from "./CandidateIdiomas";
import RecomendarDialog from "@/components/shared/components/RecomendarDialog";

interface CandidateProfileViewProps {
  candidate: UserInfoData;
  picture?: string;
  idCandidato: string;
}

export default function CandidateProfileView({
  candidate,
  picture,
  idCandidato,
}: CandidateProfileViewProps) {
  const nombreCandidato = [
    candidate.datosPersonales?.nombre,
    candidate.datosPersonales?.apellido,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="p-6">
      {/* Header with back button */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <a
            href="/empresa-profile/postulaciones"
            className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a Postulaciones
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Perfil del Candidato</h1>
          <p className="text-gray-500 mt-1">
            Información detallada del postulante
          </p>
        </div>

        <div className="shrink-0 pt-8">
          <RecomendarDialog
            idUsuario={idCandidato}
            nombreCandidato={nombreCandidato}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <CandidateHeader
            datosPersonales={candidate.datosPersonales}
            ubicacion={`${candidate.datosContacto.ciudad}, ${candidate.datosContacto.pais}`}
            picture={picture}
          />

          <CandidateExperiencia experiencias={candidate.experienciaLaboral} />

          <CandidateEducacion educaciones={candidate.educacion} />
        </div>

        {/* Right Column - Secondary Info */}
        <div className="space-y-6">
          <CandidateContactInfo datosContacto={candidate.datosContacto} />

          <CandidateHabilidades habilidades={candidate.habiliades} />

          <CandidateIdiomas idiomas={candidate.idiomas} />
        </div>
      </div>
    </div>
  );
}
