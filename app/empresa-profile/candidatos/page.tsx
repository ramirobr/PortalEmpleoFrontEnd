import PostulantesTodos from "../PostulantesTodos";

export const metadata = {
  title: "Todos los Postulantes | PortalEmpleo",
  description: "Lista completa de postulantes",
};

export default function CandidatosPage() {
  return (
    <>
      <section className="mb-6 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mt-6">Candidatos</h1>
        <p className="text-gray-500">
          Gestiona y filtra todos los candidatos de tu empresa.
        </p>
      </section>
      <PostulantesTodos />
    </>
  );
}
