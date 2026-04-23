import CrearEmpleoForm from "./Form";
import { crearEmpleoFilters } from "@/lib/company/formFields";

export default async function page() {
  const fields = await crearEmpleoFilters();

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mt-6">
        Publicar Nuevo Empleo
      </h1>
      <p className="text-gray-500 mb-8">
        Completa la información para encontrar al candidato ideal.
      </p>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <CrearEmpleoForm fields={fields} />
      </div>
    </>
  );
}
