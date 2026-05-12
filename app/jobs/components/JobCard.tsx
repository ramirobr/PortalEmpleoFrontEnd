"use client";
import { Job, RecentJob } from "@/types/jobs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, MapPin, Clock, Briefcase } from "lucide-react";
import { PremiumButton } from "@/components/shared/components/PremiumButton";
import FavoriteButton from "@/components/shared/components/FavoriteButton";

interface JobCardProps {
  job: Job | RecentJob;
  isFavorite?: boolean;
}

export default function JobCard({ job, isFavorite = false }: JobCardProps) {
  const router = useRouter();

  const id = "idVacante" in job ? job.idVacante : job.id;
  const logo = "logoEmpresa" in job ? job.logoEmpresa : undefined;

  const companyName = "nombreEmpresa" in job ? job.nombreEmpresa : job.empresa;
  const title = job.titulo;
  const modality = job.modalidad;
  const location =
    "pais" in job
      ? `${job.ciudad}, ${job.provincia}`
      : `${job.ciudad}, ${job.provincia}`;

  return (
    <div className="relative @container/card group bg-white rounded-xl p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full border border-slate-50">
      <FavoriteButton jobId={id} isFavorite={isFavorite} />
      {/* Header Row: Logo & Verified Badge */}
      <div className="flex flex-col @[300px]/card:flex-row justify-between items-start mb-8 gap-4 @[300px]/card:gap-0">
        <div className="relative w-16 h-16 shrink-0">
          {logo ? (
            <Image
              src={`data:image/png;base64,${logo}`}
              alt={`Logo de la empresa ${companyName}`}
              fill
              className="rounded-xl object-cover border border-slate-100 p-2 shadow-inner"
              unoptimized
              loading="lazy"
            />
          ) : (
            <Image
              src="/logos/company_logo.png"
              alt={`Logo de la empresa ${companyName}`}
              fill
              className="rounded-xl object-cover border border-slate-100 p-2 shadow-inner"
              unoptimized
              loading="lazy"
            />
          )}
        </div>

        {/* Enhanced Verified Badge */}
        <div className="flex flex-col items-end gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
              Perfil 100% verificado
            </span>
          </div>
          {/* Accent Line Detail */}
          <div className="w-16 h-1 bg-primary rounded-full opacity-40 mr-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <p className="text-slate-600 font-medium text-sm mb-2">{companyName}</p>
        <h3 className="text-2xl font-display font-bold text-primary uppercase leading-none mb-6 tracking-tight group-hover:text-primary-container transition-colors duration-300">
          {title || "Oportunidad Profesional"}
        </h3>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8">
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="w-4 h-4 opacity-70" />
            <span className="text-sm font-medium">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            {modality?.toLowerCase().includes("remoto") ? (
              <Briefcase className="w-4 h-4 opacity-70" />
            ) : (
              <Clock className="w-4 h-4 opacity-70" />
            )}
            <span className="text-sm font-medium">{modality}</span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="mt-auto">
        <PremiumButton
          className="w-full"
          onClick={() => router.push(`/jobs/${id}`)}
        >
          Ver Vacante
        </PremiumButton>
      </div>
    </div>
  );
}
