import { CandidateSearchResult } from "@/types/company";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Briefcase, User, Check } from "lucide-react";
import React from "react";
import { PremiumButton } from "@/components/shared/components/PremiumButton";

interface CandidateCardProps {
  candidate: CandidateSearchResult;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const router = useRouter();

  // Get top 3 skills
  const topSkills = candidate.habilidades.slice(0, 3);

  return (
    <div className="@container/card group bg-white rounded-xl p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full border border-slate-50">
      {/* Header Row: Photo & Status */}
      <div className="flex flex-col @[300px]/card:flex-row justify-between items-start mb-8 gap-4 @[300px]/card:gap-0">
        <div className="relative w-16 h-16 shrink-0">
          {candidate.fotografia ? (
            <Image
              src={`data:image/jpeg;base64,${candidate.fotografia}`}
              alt={`Foto de ${candidate.nombreCompleto}`}
              fill
              className="rounded-xl object-cover border border-slate-100 p-1 shadow-inner"
              unoptimized
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
              <User className="w-8 h-8 text-primary/40" />
            </div>
          )}
        </div>

        {/* Enhanced Completion Badge */}
        <div className="flex flex-col items-end gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
              Perfil {candidate.porcentajePerfilCompletado}% completado
            </span>
          </div>
          {/* Progress Accent Line */}
          <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden mr-auto">
            <div
              className={`h-full bg-primary transition-all duration-1000 w-(--completion-pc)`}
              style={
                {
                  "--completion-pc": `${candidate.porcentajePerfilCompletado}%`,
                } as React.CSSProperties
              }
            />
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-display font-bold text-primary uppercase leading-tight mb-1 tracking-tight group-hover:text-primary-container transition-colors duration-300">
          {candidate.nombreCompleto}
        </h3>
        {candidate.puestoActual && (
          <p className="text-slate-600 font-bold uppercase tracking-widest text-[11px] mb-6">
            {candidate.puestoActual}
          </p>
        )}

        <div className="w-full h-px bg-slate-100 mb-6" />

        <div className="grid grid-cols-2 gap-4 mb-8 text-slate-500">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 ">
              <MapPin className="w-3 h-3" />
              <span className="text-sm font-medium">Ubicación</span>
            </div>
            <p className="text-sm font-medium text-slate-600 line-clamp-1">
              {candidate.ciudad}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 ">
              <Briefcase className="w-3 h-3" />
              <span className="text-sm font-medium">Experiencia</span>
            </div>
            <p className="text-sm font-medium text-slate-600 line-clamp-1">
              {candidate.aniosExperiencia}{" "}
              {candidate.aniosExperiencia === 1 ? "año" : "años"}
            </p>
          </div>
        </div>

        {/* Skills Preview */}
        {topSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {topSkills.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <PremiumButton
          className="w-full"
          onClick={() =>
            router.push(`/empresa-profile/candidato/${candidate.idUsuario}`)
          }
        >
          Ver Perfil
        </PremiumButton>
      </div>
    </div>
  );
}
