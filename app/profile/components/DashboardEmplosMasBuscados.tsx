import { CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

const EMPLEOS_POPULARES = [
  "Asistente Administrativo",
  "Técnico Electricista",
  "Supervisor de Producción",
  "Atención al Cliente",
  "Vendedor Comercial",
];

export default function DashboardEmplosMasBuscados() {
  return (
    <section aria-labelledby="popular-jobs-title">
      <h2 id="popular-jobs-title" className="text-lg font-bold text-gray-800 mb-4">
        Empleos Más Buscados
      </h2>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <ul className="flex flex-col divide-y divide-gray-50" aria-label="Búsquedas populares">
          {EMPLEOS_POPULARES.map((empleo) => (
            <li key={empleo}>
              <Link
                href={`/empleos-busqueda?query=${encodeURIComponent(empleo)}`}
                className="flex items-center gap-3 py-3 hover:text-primary transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                aria-label={`Buscar empleos de ${empleo}`}
              >
                <CheckCircle2 className="w-5 h-5 text-primary fill-primary/10 shrink-0" aria-hidden="true" />
                <span className="text-sm text-gray-700 group-hover:text-primary flex-1 transition-colors">
                  {empleo}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-2 pt-2 border-t border-gray-50">
          <Link
            href="/empleos-busqueda"
            className="flex items-center justify-end gap-1 text-xs text-primary hover:text-secondary font-medium transition-colors outline-none focus-visible:underline"
            aria-label="Ver todas las categorías de empleo"
          >
            Ver todas
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
