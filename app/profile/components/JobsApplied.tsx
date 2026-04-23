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
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 flex flex-col gap-4 relative h-full border border-slate-50 group-hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <Pill
                    variant={
                      job.estado === "Postulada"
                        ? "blue"
                        : job.estado === "Elegido"
                          ? "green"
                          : "yellow"
                    }
                    className="uppercase text-[9px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full"
                  >
                    {job.estado}
                  </Pill>
                </div>
                
                <div className="mt-2">
                  <h4 className="font-display font-black text-primary text-xl leading-tight uppercase tracking-tight group-hover:text-primary-container transition-colors duration-300">
                    {job.titulo}
                  </h4>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-600 mt-2">
                    {job.empresa}
                  </p>
                </div>

                <div className="mt-auto pt-6 flex items-center gap-2 text-[11px] text-slate-600 font-bold uppercase tracking-wider border-t border-slate-100 italic">
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
