"use client";
import Pill from "@/components/shared/components/Pill";
import FavoriteButton from "@/components/shared/components/FavoriteButton";
import { ROLES } from "@/types/auth";
import { Job, RecentJob } from "@/types/jobs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";

interface JobCardProps {
  job: Job | RecentJob;
  isFavorite?: boolean;
}

export default function JobCard({ job, isFavorite = false }: JobCardProps) {
  const [visible, setVisible] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  if (!visible) return null;

  const id = "idVacante" in job ? job.idVacante : job.id;
  const logo = "logoEmpresa" in job ? job.logoEmpresa : undefined; //

  const companyName = "nombreEmpresa" in job ? job.nombreEmpresa : job.empresa;
  const title = job.titulo;
  const modality = job.modalidad;
  const experience = "experiencia" in job ? job.experiencia : "N/A"; // RecentJob doesn't have experience?
  const location =
    "pais" in job
      ? `${job.pais}, ${job.ciudad}, ${job.provincia}`
      : `${job.ciudad}, ${job.provincia}`;

  return (
    <div className="bg-white border-primary shadow hover:shadow-lg mb-3 relative border-l-8 border-l-primary rounded-xl transition-all overflow-hidden h-full flex flex-col">
      <div className="p-6 relative flex-1 flex flex-col">
        {logo ? (
          <Image
            src={`data:image/png;base64,${logo}`}
            alt={`Logo de la empresa ${companyName}`}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border border-gray-light shrink-0"
            unoptimized
            loading="lazy"
          />
        ) : (
          <Image
            src="/logos/company_logo.png"
            alt={`Logo de la empresa ${companyName}`}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border border-gray-light shrink-0"
            unoptimized
            loading="lazy"
          />
        )}
        {/*session?.user.role === ROLES.Postulante && (
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton
              jobId={id}
              isFavorite={isFavorite}
              onUnfavorite={() => isFavorite && setVisible(false)}
            />
          </div>
        )}*/}

        <div className="flex items-center gap-2 mt-4 mb-4">
          <div className="flex-1 bg-primary rounded-full h-9 flex items-center px-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-[20%] bg-secondary" />
            <span className="relative z-10 text-white text-sm font-medium">
              Perfil 100% verificado
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <Check className="w-5 h-5 text-white" strokeWidth={4} />
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-wrap r mt-2">
          <h2 className="text-xl text-primary font-bold mb-1 leading-snug">
            {companyName}
          </h2>
          <div className="w-full h-px bg-gray-200 my-5" />

          <p className="text-[14px] font-bold uppercase tracking-widest mb-2 leading-tight">
            {title || "Software Development"}
          </p>
          <p className="text-[12px] font-bold mb-2 leading-tight">{location}</p>

          <Pill
            variant="custom"
            bgColor="bg-primary"
            textColor="text-white"
            noButton={true}
          >
            {modality}
          </Pill>
        </div>

        {/*<div className="mt-2 space-y-4">
          <p className="mb-1 leading-tight">
            <span className="text-xs uppercase font-extrabold text-[#1f3f3f]">
              EXPERIENCIA:
            </span>
            <br />
            <span className="text-sm text-gray-700">{experience}</span>
          </p>
        </div>*/}
      </div>
      <div className="flex flex-col w-full mt-auto">
        <div className="w-full h-[1px] bg-white/10" />
        <button
          className="bg-primary hover:bg-secondary text-white text-sm font-bold uppercase py-4 transition-colors text-center cursor-pointer w-full"
          onClick={() => router.push(`/jobs/${id}`)}
        >
          VER
        </button>
      </div>
    </div>
  );
}
