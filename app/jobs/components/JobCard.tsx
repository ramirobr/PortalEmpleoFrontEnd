"use client";
import { Job, RecentJob } from "@/types/jobs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, MapPin, Clock, Briefcase } from "lucide-react";

interface JobCardProps {
  job: Job | RecentJob;
  isFavorite?: boolean;
}

export default function JobCard({ job }: JobCardProps) {
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
    <div className="group bg-white rounded-xl p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full border border-slate-50">
      {/* Header Row: Logo & Verified Badge */}
      <div className="flex justify-between items-start mb-8">
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
          <div className="w-16 h-1 bg-primary rounded-full opacity-40 ml-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <p className="text-slate-600 font-medium text-sm mb-2">{companyName}</p>
        <h3 className="text-2xl font-display font-black text-primary uppercase leading-none mb-6 tracking-tight group-hover:text-primary-container transition-colors duration-300">
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
        <button
          className="relative group/btn w-full flex items-center justify-center gap-3 px-12 py-2 bg-linear-to-r from-secondary-container to-secondary text-white font-black text-xs uppercase tracking-widest rounded-full transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-1"
          onClick={() => router.push(`/jobs/${id}`)}
        >
          <div className="absolute inset-x-0 top-0 h-full w-full bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
          <span className="relative z-10 font-bold">Ver Vacante</span>
        </button>
      </div>
    </div>
  );
}
