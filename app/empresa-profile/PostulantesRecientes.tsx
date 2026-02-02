import Pill from "@/components/shared/components/Pill";
import Link from "next/link";
import { AplicanteReciente } from "@/types/company";
import { Card, CardHeader, CardContent, CardAction } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PostulantesRecientesProps {
  aplicantes: AplicanteReciente[];
}

export default function PostulantesRecientes({
  aplicantes,
}: PostulantesRecientesProps) {
  return (
    <section
      className="p-6 bg-white rounded-lg shadow mt-8"
      aria-labelledby="recent-applicants-title"
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          id="recent-applicants-title"
          className="text-2xl font-semibold text-gray-900"
        >
          Postulantes Recientes
        </h2>
        <Link
          href="/empresa-profile/postulaciones"
          className="text-sm text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
          aria-label="Ver todos los postulantes"
        >
          Ver todos
        </Link>
      </div>

      {aplicantes.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No hay postulantes recientes
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aplicantes.map((aplicante) => (
            <Card key={aplicante.usuario.idAplicacion} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                      {aplicante.usuario.nombreCompleto
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {aplicante.usuario.nombreCompleto}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {aplicante.usuario.ubicacion}
                    </p>
                  </div>
                </div>
                <CardAction>
                  <Pill variant="gray" className="text-xs">
                    {aplicante.usuario.estadoAplicacion.nombre}
                  </Pill>
                </CardAction>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {aplicante.usuario.habilidades.slice(0, 4).map((skill, index) => (
                    <Pill key={index} variant="blue" className="text-xs">
                      {skill}
                    </Pill>
                  ))}
                  {aplicante.usuario.habilidades.length > 4 && (
                    <Pill variant="gray" className="text-xs">
                      +{aplicante.usuario.habilidades.length - 4} más
                    </Pill>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
