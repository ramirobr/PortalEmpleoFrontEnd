"use client";
import { CandidateSearchResult } from "@/types/company";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, GraduationCap, Briefcase, DollarSign } from "lucide-react";

interface CandidateCardProps {
  candidate: CandidateSearchResult;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const router = useRouter();

  // Format salary
  const formattedSalary = new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(candidate.aspiracionSalarial);

  // Get top 3 skills
  const topSkills = candidate.habilidades.slice(0, 3);

  return (
    <div className="bg-white border shadow hover:border-primary hover:shadow-lg mb-3 relative border-gray-light rounded-xl transition-all overflow-hidden h-full flex justify-between flex-col">
      <div className="p-6 relative">
        <div className="flex flex-col items-center gap-4 flex-wrap justify-center">
          {candidate.fotografia ? (
            <Image
              src={candidate.fotografia}
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
          <div className="text-center">
            <h2 className="text-lg font-bold text-black mb-2 leading-snug text-center">
              {candidate.nombreCompleto}
            </h2>
            <p className="text-sm text-slate-600 mb-4">{candidate.puestoActual}</p>
          </div>
        </div>

        <hr className="my-3" />

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
            <div>
              <span className="text-sm font-bold text-slate-600 block">
                Ubicación
              </span>
              <span className="text-sm">
                {candidate.ciudad}, {candidate.provincia}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <GraduationCap className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
            <div>
              <span className="text-sm font-bold text-slate-600 block">
                Educación
              </span>
              <span className="text-sm">{candidate.nivelEducacion}</span>
              <span className="text-xs text-slate-500 block">
                {candidate.institucionEducativa}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
            <div>
              <span className="text-sm font-bold text-slate-600 block">
                Experiencia
              </span>
              <span className="text-sm">
                {candidate.aniosExperiencia}{" "}
                {candidate.aniosExperiencia === 1 ? "año" : "años"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
            <div>
              <span className="text-sm font-bold text-slate-600 block">
                Aspiración salarial
              </span>
              <span className="text-sm">{formattedSalary}</span>
            </div>
          </div>

          {topSkills.length > 0 && (
            <div>
              <span className="text-sm font-bold text-slate-600 block mb-2">
                Habilidades principales
              </span>
              <div className="flex flex-wrap gap-2">
                {topSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <button
          className="btn btn-primary block w-full shadow-md uppercase cursor-pointer rounded-tl-none rounded-tr-none"
          onClick={() =>
            router.push(`/empresa-profile/candidato/${candidate.idUsuario}`)
          }
        >
          VER PERFIL
        </button>
      </div>
    </div>
  );
}
