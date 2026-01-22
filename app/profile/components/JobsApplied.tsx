import Badge from "@/components/shared/components/Badge";
import { ListaTrabajosAplicado } from "@/types/user";

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
            // TODO: Link? <Link href={`/jobs/${job.id}`} key={job.id} className="block">
            <div
              key={job.titulo}
              className="bg-white rounded-lg shadow p-5 flex flex-col gap-2n relative hover:shadow-md transition-shadow"
            >
              <div className="font-semibold text-primary text-base mt-6">
                {job.titulo}
              </div>
              <div className="text-sm text-gray-500">{job.empresa}</div>
              <div className="text-xs text-gray-400">
                Enviado en {new Date(job.fechaAplicacion).toDateString()}
              </div>
              <Badge
                variant={
                  job.estado === "Postulada"
                    ? "blue"
                    : job.estado === "Elegido"
                      ? "green"
                      : "yellow"
                }
                className="absolute top-2 right-2"
              >
                {job.estado}
              </Badge>
            </div>
          ))
        ) : (
          <h4 className="text-md font-medium">No hay postulaciones</h4>
        )}
      </div>
    </section>
  );
}
