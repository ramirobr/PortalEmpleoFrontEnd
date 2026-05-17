import { Building2, CheckCircle2, ChevronRight, MapPin, Star } from "lucide-react";
import { StarRating } from "@/components/shared/components/StarRating";
import Link from "next/link";
import { ListaTrabajosAplicado } from "@/types/user";
import { PremiumButton } from "@/components/shared/components/PremiumButton";

interface DashboardEmpleosDestacadosProps {
  jobs: ListaTrabajosAplicado[];
  perfilCompletado?: number;
}

export default function DashboardEmpleosDestacados({
  jobs,
  perfilCompletado,
}: DashboardEmpleosDestacadosProps) {
  const REQUISITOS = [
    "Título Universitario",
    "Record Policial Limpio",
    "Experiencia Comprobada",
  ];

  const isExcelentProfile = (perfilCompletado ?? 0) >= 80;

  return (
    <section aria-labelledby="featured-jobs-title">
      <h2
        id="featured-jobs-title"
        className="text-lg font-semibold text-zinc-800 mb-4"
      >
        Empleos Destacados
      </h2>

      <ul className="flex flex-col gap-4">
        {jobs.length ? (
          jobs.slice(0, 3).map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                className="block group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                aria-label={`Ver detalles del empleo: ${job.titulo} en ${job.empresa}`}
              >
                <div className="bg-white rounded-xl border border-zinc-100 shadow-sm group-hover:shadow-md transition-shadow p-5">
                  {/* Top row: image + title + location */}
                  <div className="flex gap-4 items-start mb-4">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="size-6 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-zinc-900 text-base leading-tight group-hover:text-primary transition-colors">
                        {job.titulo}
                      </h3>
                      <div className="flex items-center gap-1.5 text-zinc-500 text-xs mt-1.5">
                        <MapPin className="size-3" aria-hidden="true" />
                        <span>{job.empresa} · Tiempo Completo</span>
                      </div>
                    </div>
                  </div>

                  {/* Confianza badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex items-center gap-1 bg-secondary/10 text-secondary rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                      aria-label={`Nivel de confianza del perfil: ${perfilCompletado ?? 0} por ciento`}
                    >
                      <Star className="size-3 fill-secondary" aria-hidden="true" />
                      Confianza: {perfilCompletado ?? 0}%
                    </div>
                  </div>

                  {/* Stars + company */}
                  <div className="flex items-center gap-2 mb-4 border-b border-zinc-50 pb-4">
                    <StarRating rating={4} size={14} />
                    <span className="text-xs text-zinc-400 ml-1 flex items-center gap-1">
                      <Building2 className="size-3" aria-hidden="true" />
                      Empresa verificada
                    </span>
                  </div>

                  {/* Requirements */}
                  <ul className="flex flex-col gap-2" aria-label="Requisitos del puesto">
                    {REQUISITOS.map((req) => (
                      <li key={req} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2
                            className="size-4 text-primary shrink-0"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-zinc-600 font-medium">{req}</span>
                        </div>
                        {req === "Título Universitario" && isExcelentProfile && (
                          <span className="text-[9px] font-bold bg-primary/10 text-primary rounded px-2 py-0.5 uppercase tracking-tighter border border-primary/20">
                            Match Ideal
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li className="bg-white rounded-xl border border-zinc-100 p-8 text-center text-zinc-400 text-sm">
            No hay empleos destacados disponibles
          </li>
        )}
      </ul>

      {jobs.length > 3 && (
        <div className="mt-6 flex justify-center">
          <PremiumButton
            href="/empleos-busqueda"
            variant="outline"
            size="sm"
            className="w-full lg:w-auto"
            icon={<ChevronRight className="size-4" />}
            iconPosition="right"
          >
            Ver todos los empleos
          </PremiumButton>
        </div>
      )}
    </section>
  );
}

