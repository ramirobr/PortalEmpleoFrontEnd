import { AplicanteReciente } from "@/types/company";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Briefcase, Star } from "lucide-react";
import { PremiumButton } from "@/components/shared/components/PremiumButton";
import Link from "next/link";

interface PostulantesRecientesProps {
  aplicantes: AplicanteReciente[];
}

const getPhotoSrc = (photo?: string) => {
  if (!photo) return null;
  return `data:image/jpeg;base64,${photo.trim()}`;
};

export default function PostulantesRecientes({
  aplicantes,
}: PostulantesRecientesProps) {
  const destacados = aplicantes.slice(0, 4);

  return (
    <section aria-labelledby="postulantes-destacados-title">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="postulantes-destacados-title"
          className="text-xl font-semibold text-slate-800"
        >
          Postulantes Destacados
        </h2>
        <Link
          href="/empresa-perfil/postulaciones"
          className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
        >
          Ver más →
        </Link>
      </div>

      {destacados.length === 0 ? (
        <p className="text-center text-slate-500 py-8 bg-white rounded-xl border border-zinc-100">
          No hay postulantes recientes
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {destacados.map((aplicante) => {
            const habilidad = aplicante.usuario.habilidades[0] || "";
            const habilidad2 = aplicante.usuario.habilidades[1] || "";
            const initials = aplicante.usuario.nombreCompleto
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={aplicante.usuario.idAplicacion}
                className="bg-white rounded-xl border border-zinc-100 shadow-sm hover:shadow-lg transition-all p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 group"
              >
                {/* Avatar with status ring */}
                <div className="relative shrink-0">
                  <Avatar className="size-16 border-2 border-white shadow-md">
                    {getPhotoSrc(aplicante.usuario.fotografia) && (
                      <AvatarImage
                        src={getPhotoSrc(aplicante.usuario.fotografia) || ""}
                        alt={aplicante.usuario.nombreCompleto}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 size-5 bg-secondary rounded-full border-2 border-white flex items-center justify-center shadow-sm" aria-hidden="true">
                    <Star className="size-2.5 text-white fill-white" />
                  </div>
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-lg leading-tight truncate">
                      {aplicante.usuario.nombreCompleto}
                    </h3>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 bg-secondary/10 text-secondary text-[12px] font-bold uppercase rounded-full">
                      Nuevo
                    </span>
                  </div>

                  <p className="text-sm font-medium text-primary mb-2">
                    {habilidad || "Candidato"}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5" aria-label={`Ubicación: ${aplicante.usuario.ubicacion}`}>
                      <MapPin className="size-3.5 text-slate-400" />
                      {aplicante.usuario.ubicacion}
                    </span>
                    {habilidad2 && (
                      <span className="flex items-center gap-1.5" aria-label={`Especialidad: ${habilidad2}`}>
                        <Briefcase className="size-3.5 text-slate-400" />
                        {habilidad2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 w-full sm:w-auto flex sm:flex-col items-center sm:items-end gap-3 mt-4 sm:mt-0">
                  {(() => {
                    const status = aplicante.usuario.estadoAplicacion.nombre.toLowerCase();
                    let badgeStyles = "bg-zinc-100 text-slate-700 border-zinc-200"; // Default
                    
                    if (status.includes("entrevista")) badgeStyles = "bg-purple-50 text-purple-700 border-purple-100";
                    if (status.includes("revisión") || status.includes("proceso")) badgeStyles = "bg-blue-50 text-blue-700 border-blue-100";
                    if (status.includes("contratado") || status.includes("finalizado")) badgeStyles = "bg-green-50 text-green-700 border-green-100";
                    if (status.includes("rechazado")) badgeStyles = "bg-red-50 text-red-700 border-red-100";
                    if (status.includes("postulada")) badgeStyles = "bg-cyan-50 text-cyan-700 border-cyan-100";

                    return (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-[12px] font-bold uppercase tracking-wider shadow-xs ${badgeStyles}`}>
                        <span className="size-1.5 rounded-full bg-current mr-1.5" />
                        {aplicante.usuario.estadoAplicacion.nombre}
                      </span>
                    );
                  })()}
                  <PremiumButton
                    href={`/empresa-perfil/candidato/${aplicante.usuario.idUsuario}`}
                    variant="primary"
                    size="sm"
                    className="flex-1 sm:flex-none min-h-[44px]"
                    aria-label={`Ver perfil completo de ${aplicante.usuario.nombreCompleto}`}
                  >
                    Ver Perfil
                  </PremiumButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
