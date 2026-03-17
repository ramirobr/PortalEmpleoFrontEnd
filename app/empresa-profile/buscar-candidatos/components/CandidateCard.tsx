"use client";
import { CandidateSearchResult } from "@/types/company";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, GraduationCap, Briefcase, User } from "lucide-react";

interface CandidateCardProps {
  candidate: CandidateSearchResult;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const router = useRouter();

  // Get top 3 skills
  const topSkills = candidate.habilidades.slice(0, 3);

  return (
    <div className="bg-white border-primary shadow hover:shadow-lg mb-3 relative border-l-8 border-l-primary rounded-xl transition-all overflow-hidden h-full flex flex-col">
      <div className="p-6 relative flex-1 flex flex-col">
        <div className="flex flex-col gap-4">
          {candidate.fotografia ? (
            <Image
              src={`data:image/jpeg;base64,${candidate.fotografia}`}
              alt={`Foto de ${candidate.nombreCompleto}`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border border-gray-light shrink-0"
              unoptimized
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-gray-light shrink-0">
              <span className="text-2xl font-bold text-primary">
                {candidate.nombreCompleto
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
          )}
          {/* Verified Profile Bar - matching JobCard */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 bg-primary rounded-full h-9 flex items-center px-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-[20%] bg-secondary" />
              <span className="relative z-10 text-white text-[11px] font-bold uppercase text-center w-full pr-[15%]">
                PERFIL 100% VERIFICADO
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={4}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div className=" w-full">
            <h2 className="text-xl font-bold text-primary mb-1 leading-snug capitalize">
              {candidate.nombreCompleto}
            </h2>
            {candidate.puestoActual && (
              <p className="text-sm font-bold uppercase tracking-widest mb-4">
                {candidate.puestoActual}
              </p>
            )}
          </div>
        </div>
        <div className="w-full h-px bg-gray-200 my-5"></div>
        <div className="space-y-4 flex-1">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                Ubicación
              </span>
              <span className="text-sm font-medium text-gray-700">
                {[candidate.ciudad, candidate.provincia]
                  .filter(Boolean)
                  .join(", ") || "No especificado"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <GraduationCap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                Educación
              </span>
              <span className="text-sm font-medium text-gray-700">
                {candidate.nivelEstudioMaximo}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                Resumen
              </span>
              <p className="text-sm font-medium text-gray-700 line-clamp-2">
                {candidate.resumenProfesional || "Sin resumen profesional"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                Experiencia
              </span>
              <span className="text-sm font-medium text-gray-700">
                {candidate.aniosExperiencia}{" "}
                {candidate.aniosExperiencia === 1 ? "año" : "años"}
              </span>
            </div>
          </div>

          {topSkills.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-2 tracking-wider">
                Habilidades
              </span>
              <div className="flex flex-wrap gap-1.5">
                {topSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className="bg-primary hover:bg-secondary text-white text-sm font-bold uppercase py-4 transition-colors text-center cursor-pointer w-full mt-auto"
        onClick={() =>
          router.push(`/empresa-profile/candidato/${candidate.idUsuario}`)
        }
      >
        VER PERFIL
      </button>
    </div>
  );
}
