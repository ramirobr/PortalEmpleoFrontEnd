import { CheckCircle2, Star, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import { ListaTrabajosAplicado } from "@/types/user";
import { ChevronRight } from "lucide-react";

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
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Empleos Destacados
      </h2>

      <div className="flex flex-col gap-4">
        {jobs.length ? (
          jobs.slice(0, 3).map((job) => (
            <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
                {/* Top row: image + title + location */}
                <div className="flex gap-3 items-start mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-primary transition-colors">
                      {job.titulo}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{job.empresa} · Tiempo Completo</span>
                    </div>
                  </div>
                </div>

                {/* Confianza badge */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1 bg-secondary/15 text-secondary rounded-full px-3 py-1 text-xs font-semibold">
                    <Star className="w-3 h-3 fill-secondary" />
                    Nivel de Confianza: {perfilCompletado ?? 0}%
                  </div>
                </div>

                {/* Stars + company */}
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-secondary fill-secondary shrink-0" />
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 text-yellow-400"
                      fill={s <= 4 ? "#facc15" : "none"}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> ImplicaHR
                  </span>
                </div>

                {/* Requirements */}
                <div className="flex flex-col gap-1.5">
                  {REQUISITOS.map((req) => (
                    <div key={req} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary fill-secondary shrink-0" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </div>
                      {req === "Título Universitario" && isExcelentProfile && (
                        <span className="text-[10px] font-bold bg-secondary text-white rounded px-2 py-0.5 uppercase tracking-wider">
                          Perfil Excelente
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            No hay empleos destacados disponibles
          </div>
        )}
      </div>

      {jobs.length > 3 && (
        <Link
          href="/empleos-busqueda"
          className="flex items-center justify-center gap-1 mt-4 text-sm text-primary hover:text-secondary font-medium transition-colors"
        >
          Ver más
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </section>
  );
}
