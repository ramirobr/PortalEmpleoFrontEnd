import { crearEmpleoFilters } from "@/lib/company/formFields";
import CrearEmpleoForm from "@/app/empresa-perfil/crear-empleo/Form";
import { fetchJobById } from "@/lib/jobs/job";
import { IdProp } from "@/types/generic";

export default async function AdminEditEmpleoPage({ params }: IdProp) {
  const { id } = await params;
  const [fields, jobData] = await Promise.all([
    crearEmpleoFilters(),
    fetchJobById(id),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-slate-900 mb-2">Editar Empleo</h1>
      <p className="text-slate-500 mb-8">
        Modifica la información de la vacante.
      </p>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-zinc-100">
        <CrearEmpleoForm fields={fields} initialValues={jobData} />
      </div>
    </div>
  );
}
