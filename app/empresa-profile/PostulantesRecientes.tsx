import Pill from "@/components/shared/components/Pill";
import Link from "next/link";
import { AplicanteReciente } from "@/types/company";

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
          href="/empresa-profile/candidatos"
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
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aplicantes.map((aplicante) => (
            <li key={aplicante.usuario.idAplicacion}>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {aplicante.usuario.nombreCompleto}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {aplicante.usuario.ubicacion}
                    </p>
                  </div>
                  <Pill variant="gray">
                    {aplicante.usuario.estadoAplicacion.nombre}
                  </Pill>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aplicante.usuario.habilidades.map((skill, index) => (
                    <Pill key={index} variant="gray">
                      {skill}
                    </Pill>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
