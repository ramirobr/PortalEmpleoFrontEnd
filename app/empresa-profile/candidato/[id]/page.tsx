import { auth } from "@/auth";
import { getCandidateInfoById, getCandidatePicById, addProfileVisit } from "@/lib/user/info";
import CandidateProfileView from "./components/CandidateProfileView";

export const metadata = {
  title: "Perfil del Candidato | PortalEmpleo",
  description: "Vista detallada del perfil del candidato",
};

interface CandidatoPageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidatoPage({ params }: CandidatoPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          No autorizado
        </h1>
        <p className="text-gray-500 mt-2">
          Debe iniciar sesión para ver esta página.
        </p>
      </div>
    );
  }

  const { user } = session;

  const [candidate, picture] = await Promise.all([
    getCandidateInfoById(id, user.accessToken),
    getCandidatePicById(id, user.accessToken),
  ]);

  // Register profile visit (fire and forget - don't block page load)
  if (user.idEmpresa) {
    addProfileVisit(id, user.idEmpresa, user.accessToken);
  }

  if (!candidate) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Candidato no encontrado
        </h1>
        <p className="text-gray-500 mt-2">
          No se pudo encontrar información del candidato con ID: {id}
        </p>
      </div>
    );
  }

  return <CandidateProfileView candidate={candidate} picture={picture} />;
}
