import Link from "next/link";
import Pill from "@/components/shared/components/Pill";
import { ListaTrabajosAplicado } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type JobsAppliedProps = {
  listaTrabajosAplicados: ListaTrabajosAplicado[];
};

export default function JobsApplied({
  listaTrabajosAplicados,
}: JobsAppliedProps) {
  return (
    <section className="mt-10">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        Postulaciones Recientes
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listaTrabajosAplicados?.length ? (
          listaTrabajosAplicados.map((job) => (
            <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
              <div className="bg-white rounded-xl border-l-8 border-l-primary shadow hover:shadow-lg transition-all overflow-hidden p-6 flex flex-col gap-3 relative h-full">
                <Pill
                  variant={
                    job.estado === "Postulada"
                      ? "blue"
                      : job.estado === "Elegido"
                        ? "green"
                        : "yellow"
                  }
                  className="absolute top-4 right-4 uppercase text-[10px] font-extrabold tracking-widest px-3"
                >
                  {job.estado}
                </Pill>
                
                <div className="mt-4">
                  <div className="font-bold text-primary text-xl leading-snug group-hover:text-secondary transition-colors">
                    {job.titulo}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-1">
                    {job.empresa}
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-gray-500 font-medium border-t border-gray-50">
                   <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   Aplicado {formatDistanceToNow(new Date(job.fechaAplicacion), { addSuffix: true, locale: es })}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <h4 className="text-md font-medium">No hay postulaciones</h4>
        )}
      </div>
    </section>
  );
}
