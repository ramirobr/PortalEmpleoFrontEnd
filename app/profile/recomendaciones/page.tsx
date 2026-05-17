"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Building2, ThumbsUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { fetchApi } from "@/lib/apiClient";
import { GenericResponse } from "@/types/user";
import { useAuthStore } from "@/context/authStore";
import { StarRating } from "@/components/shared/components/StarRating";

interface RecomendacionItem {
  idRecomendacion: string;
  idEmpresa: string;
  nombreEmpresa: string;
  sector: string;
  nombreRevisor: string | null;
  cargoRevisor: string | null;
  puntuacion: number;
  razonRecomendacion: string;
  fechaRecomendacion: string;
}

interface PaginatedRecomendaciones {
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  data: RecomendacionItem[];
}

const COLOR_PALETTE = [
  "bg-blue-600",
  "bg-orange-500",
  "bg-green-600",
  "bg-purple-600",
  "bg-teal-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-indigo-600",
];

function getIniciales(nombre: string): string {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

function RecomendacionCard({
  rec,
  colorClass,
}: {
  rec: RecomendacionItem;
  colorClass: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 flex flex-col gap-6 relative border border-zinc-50 group hover:-translate-y-1.5">
      <div className="flex items-start gap-5">
        <div
          className={cn(
            "size-14 rounded-2xl flex items-center justify-center text-white font-bold font-display text-lg shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500",
            colorClass,
          )}
        >
          {getIniciales(rec.nombreEmpresa)}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <h4 className="font-display font-semibold text-primary text-xl uppercase tracking-tight leading-none mb-2">
            {rec.nombreEmpresa}
          </h4>
          {rec.sector && (
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] italic">
              {rec.sector}
            </p>
          )}
        </div>
        <div className="bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">
          <StarRating rating={rec.puntuacion} size={16} />
        </div>
      </div>

      <div className="relative">
        <span className="absolute -top-4 -left-2 text-6xl text-primary/5 font-serif select-none">
          “
        </span>
        <p className="text-zinc-600 leading-relaxed text-[15px] font-medium relative z-10 italic">
          {rec.razonRecomendacion}
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
            <ThumbsUp className="size-4 text-primary" />
          </div>
          <div>
            {rec.nombreRevisor ? (
              <>
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  {rec.nombreRevisor}
                </p>
                {rec.cargoRevisor && (
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">
                    {rec.cargoRevisor}
                  </p>
                )}
              </>
            ) : (
              <p className="text-[10px]  font-bold uppercase tracking-widest italic">
                Anónimo
              </p>
            )}
          </div>
        </div>
        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] italic">
          {new Date(rec.fechaRecomendacion).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

export default function RecomendacionesPage() {
  const { data: session } = useSession();
  const userId = useAuthStore((s) => s.id);
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.accessToken || !userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchApi<
          GenericResponse<PaginatedRecomendaciones>
        >(`/Recomendaciones/getByUsuario/${userId}`, {
          method: "POST",
          token: session.user.accessToken,
          body: { pageSize: 100, currentPage: 1 },
        });

        if (response?.isSuccess && response.data?.data) {
          setRecomendaciones(response.data.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, userId]);

  const total = recomendaciones.length;
  const promedio =
    total > 0
      ? recomendaciones.reduce((acc, r) => acc + r.puntuacion, 0) / total
      : 0;
  const promedioRedondeado = Math.round(promedio * 10) / 10;

  return (
    <div className="mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-zinc-900 mb-1">
          Recomendaciones recibidas
        </h1>
        <p className="text-zinc-500">
          Opiniones de empresas con las que has participado en procesos de
          selección.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-zinc-400 gap-3">
          <Loader2 className="size-6 animate-spin" />
          <span>Cargando recomendaciones...</span>
        </div>
      ) : (
        <>
          {/* Resumen */}
          <div className="p-10 mb-12 bg-white rounded-5xl shadow-sm border border-zinc-50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-64 bg-primary/2 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl animate-pulse" />
                  <span className="text-8xl font-display font-bold text-primary relative z-10 tracking-tighter">
                    {total > 0 ? promedioRedondeado.toFixed(1) : "—"}
                  </span>
                </div>
                <StarRating rating={Math.round(promedio)} size={28} />
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-2 italic">
                  Puntuación promedio
                </span>
              </div>

              <div className="w-px h-32 bg-zinc-100 hidden lg:block" />

              <div className="flex flex-col gap-4 flex-1 w-full max-w-md">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = recomendaciones.filter(
                    (r) => r.puntuacion === star,
                  ).length;
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-4">
                      <span className="text-xs font-bold text-zinc-600 w-4">
                        {star}
                      </span>
                      <StarRating rating={1} maxRating={1} size={16} />
                      <div className="flex-1 bg-zinc-50 rounded-full h-2.5 overflow-hidden border border-zinc-100/50">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-1000 w-[var(--star-pc)]"
                          style={
                            { "--star-pc": `${pct}%` } as React.CSSProperties
                          }
                        />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-600 w-4">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col items-center gap-2 lg:ml-auto p-8 rounded-xl bg-primary/2 border border-primary/5 min-w-[200px]">
                <div className="flex items-center gap-2 text-primary group-hover:scale-110 transition-transform duration-500">
                  <ThumbsUp className="size-10 fill-primary/10" />
                  <span className="text-5xl font-display font-bold tracking-tight">
                    {total}
                  </span>
                </div>
                <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] italic">
                  Postulaciones Validadas
                </span>
              </div>
            </div>
          </div>

          {/* Lista */}
          {total === 0 ? (
            <div className="text-center py-16 text-zinc-400">
              <ThumbsUp className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-base">Aún no tienes recomendaciones.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                  <Building2 className="size-5 text-primary" />
                  Empresas que te recomiendan ({total})
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {recomendaciones.map((rec, index) => (
                  <RecomendacionCard
                    key={rec.idRecomendacion}
                    rec={rec}
                    colorClass={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
