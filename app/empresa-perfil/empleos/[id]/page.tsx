import { crearEmpleoFilters } from "@/lib/company/formFields";
import CrearEmpleoForm from "../../crear-empleo/Form";
import { fetchJobById } from "@/lib/jobs/job";
import { IdProp } from "@/types/generic";

export default async function page({ params }: IdProp) {
  const { id } = await params;
  const [fields, jobData] = await Promise.all([
    crearEmpleoFilters(),
    fetchJobById(id),
  ]);

  return (
    <>
      <h1 className="text-3xl font-semibold text-slate-900 mt-6">Editar Empleo</h1>
      <p className="text-slate-500 mb-8">
        Completa la información para encontrar al candidato ideal.
      </p>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-zinc-100">
        <CrearEmpleoForm fields={fields} initialValues={jobData} />
      </div>
    </>
  );
}
