"use client";
import Badge from "@/components/shared/components/Badge";
import FavoriteButton from "@/components/shared/components/FavoriteButton";
import { ROLES } from "@/types/auth";
import { Job, RecentJob } from "@/types/jobs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <div className="bg-white border shadow hover:border-primary hover:shadow-lg mb-3 relative border-gray-light rounded-xl transition-all overflow-hidden h-full flex justify-between flex-col">
      <div className="p-6 relative">
        {session?.user.role === ROLES.Postulante && (
          <FavoriteButton
            jobId={id}
            isFavorite={isFavorite}
            onUnfavorite={() => isFavorite && setVisible(false)}
          />
        )}
        <div className="flex flex-col items-center gap-4 flex-wrap justify-center">
          {logo ? (
            <Image
              src={logo}
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
          <div className="text-center">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 leading-tight text-center">
              {companyName}
            </h2>
            <p className="text-lg font-bold text-black mb-4 leading-snug text-center">
              {title || "Software Development"}
            </p>
            <Badge
              variant="custom"
              bgColor="bg-black"
              textColor="text-white"
              noButton={true}
            >
              {modality}
            </Badge>
          </div>
        </div>

        <hr className="my-3" />

        <div className="mt-8 space-x-5">
          <p className="mb-1">
            <span className="text-sm uppercase font-bold text-slate-400">
              Experiencia:
            </span>
            <br />
            <span className="text-md">{experience}</span>
          </p>
          <p className="mb-1">
            <span className="text-sm uppercase font-bold text-slate-400">
              Ubicación:
            </span>{" "}
            <br />
            <span className="text-md">{location}</span>
          </p>
        </div>
      </div>
      <div className="">
        <button
          className="btn btn-primary block w-full shadow-md uppercase cursor-pointer rounded-none"
          onClick={() => router.push(`/jobs/${id}`)}
        >
          Aplicar
        </button>
        <button
          className="btn btn-secondary uppercase block w-full cursor-pointer rounded-tl-none rounded-tr-none"
          onClick={() => router.push(`/jobs/${id}`)}
        >
          VER
        </button>
      </div>
    </div>
  );
}
