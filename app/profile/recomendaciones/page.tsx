"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Star, Building2, ThumbsUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { fetchApi } from "@/lib/apiClient";
import { GenericResponse } from "@/types/user";
import { useAuthStore } from "@/context/authStore";

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

function StarRating({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "lg";
}) {
  const cls = size === "lg" ? "w-7 h-7" : "w-5 h-5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            cls,
            star <= value
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200",
          )}
        />
      ))}
    </div>
  );
}

function RecomendacionCard({
  rec,
  colorClass,
}: {
  rec: RecomendacionItem;
  colorClass: string;
}) {
  return (
    <Card className="p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0",
            colorClass,
          )}
        >
          {getIniciales(rec.nombreEmpresa)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 leading-tight">
            {rec.nombreEmpresa}
          </p>
          {rec.sector && (
            <p className="text-sm text-gray-500">{rec.sector}</p>
          )}
        </div>
        <StarRating value={rec.puntuacion} />
      </div>

      <p className="text-gray-600 leading-relaxed text-sm">
        &ldquo;{rec.razonRecomendacion}&rdquo;
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          {rec.nombreRevisor ? (
            <>
              <p className="text-sm font-medium text-gray-800">
                {rec.nombreRevisor}
              </p>
              {rec.cargoRevisor && (
                <p className="text-xs text-gray-500">{rec.cargoRevisor}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">Revisión anónima</p>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {new Date(rec.fechaRecomendacion).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </Card>
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
    <div className="max-w-4xl mx-auto py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/profile" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Recomendaciones</span>
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">
          Recomendaciones recibidas
        </h1>
        <p className="text-gray-500">
          Opiniones de empresas con las que has participado en procesos de
          selección.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400 gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando recomendaciones...</span>
        </div>
      ) : (
        <>
          {/* Resumen */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-[#f0f9f8] to-white border-[#18a999]/20">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-6xl font-bold text-[#18a999]">
                  {total > 0 ? promedioRedondeado.toFixed(1) : "—"}
                </span>
                <StarRating value={Math.round(promedio)} size="lg" />
                <span className="text-sm text-gray-500">
                  Puntuación promedio
                </span>
              </div>

              <div className="w-px h-16 bg-gray-200 hidden sm:block" />

              <div className="flex flex-col gap-2 flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = recomendaciones.filter(
                    (r) => r.puntuacion === star,
                  ).length;
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-4 text-right">
                        {star}
                      </span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-4">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col items-center gap-1 sm:ml-4">
                <div className="flex items-center gap-2 text-[#18a999]">
                  <ThumbsUp className="w-6 h-6" />
                  <span className="text-2xl font-bold">{total}</span>
                </div>
                <span className="text-sm text-gray-500">Recomendaciones</span>
              </div>
            </div>
          </Card>

          {/* Lista */}
          {total === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ThumbsUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-base">Aún no tienes recomendaciones.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Empresas que te recomiendan ({total})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
