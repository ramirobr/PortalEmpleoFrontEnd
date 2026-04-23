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
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Empleos Más Buscados
      </h2>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col divide-y divide-gray-50">
          {EMPLEOS_POPULARES.map((empleo) => (
            <Link
              key={empleo}
              href={`/empleos-busqueda?query=${encodeURIComponent(empleo)}`}
              className="flex items-center gap-3 py-3 hover:text-secondary transition-colors group"
            >
              <CheckCircle2 className="w-5 h-5 text-secondary fill-secondary shrink-0" />
              <span className="text-sm text-gray-700 group-hover:text-secondary flex-1 transition-colors">
                {empleo}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-secondary transition-colors" />
            </Link>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-50">
          <Link
            href="/empleos-busqueda"
            className="flex items-center justify-end gap-1 text-xs text-primary hover:text-secondary font-medium transition-colors"
          >
            Ver todas
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
