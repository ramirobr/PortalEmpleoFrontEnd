import { AplicanteReciente } from "@/types/company";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Briefcase, Star } from "lucide-react";
import Link from "next/link";

interface PostulantesRecientesProps {
  aplicantes: AplicanteReciente[];
}

export default function PostulantesRecientes({
  aplicantes,
}: PostulantesRecientesProps) {
  const getPhotoSrc = (photo?: string) => {
    if (!photo) return null;
    return `data:image/jpeg;base64,${photo.trim()}`;
  };

  const destacados = aplicantes.slice(0, 4);

  return (
    <section aria-labelledby="postulantes-destacados-title">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="postulantes-destacados-title"
          className="text-xl font-bold text-gray-800"
        >
          Postulantes Destacados
        </h2>
        <Link
          href="/empresa-profile/postulaciones"
          className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
        >
          Ver más →
        </Link>
      </div>

      {destacados.length === 0 ? (
        <p className="text-center text-gray-500 py-8 bg-white rounded-xl border border-gray-100">
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
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Avatar */}
                <Avatar className="size-16 border-2 border-white shadow-md shrink-0">
                  {getPhotoSrc(aplicante.usuario.fotografia) && (
                    <AvatarImage
                      src={getPhotoSrc(aplicante.usuario.fotografia) || ""}
                      alt={aplicante.usuario.nombreCompleto}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-black font-display uppercase">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base leading-tight">
                    {aplicante.usuario.nombreCompleto}
                  </h3>

                  {habilidad && (
                    <p className="text-sm text-gray-600 mt-0.5">{habilidad}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-primary" />
                      {aplicante.usuario.ubicacion}
                    </span>
                    {habilidad2 && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="size-3 text-primary" />
                        {habilidad2}
                      </span>
                    )}
                  </div>

                  {habilidad && (
                    <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <Star className="size-3 text-label-star fill-label-star" />
                      Carrera ideal:{" "}
                      <span className="font-semibold text-gray-600">
                        {habilidad}
                      </span>
                    </p>
                  )}
                </div>

                {/* Badge + Ver Perfil — columna derecha alineada */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-full tracking-wide">
                    ✓ PERFIL EXCELENTE
                  </span>
                  <Link
                    href={`/empresa-profile/candidato/${aplicante.usuario.idUsuario}`}
                    className="px-5 py-2 bg-primary hover:bg-primary-deep text-white font-bold text-xs uppercase rounded-lg transition-colors"
                  >
                    Ver Perfil
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
