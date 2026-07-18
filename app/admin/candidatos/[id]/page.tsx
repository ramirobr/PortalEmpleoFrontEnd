import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { getAdminCandidatoById } from "@/lib/admin/adminCandidatos";
import { getCandidatePicById } from "@/lib/user/info";
import AdminCandidateProfileView from "./components/AdminCandidateProfileView";

interface AdminCandidatoDetallePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCandidatoDetallePage({
  params,
}: AdminCandidatoDetallePageProps) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const token = session?.user?.accessToken;

  if (!token) {
    return (
      <Card className="p-8">
        <h1 className="text-2xl font-semibold text-slate-900">No autorizado</h1>
        <p className="mt-2 text-slate-500">Debes iniciar sesión para ver este perfil.</p>
      </Card>
    );
  }

  const [candidateResponse, picture] = await Promise.all([
    getAdminCandidatoById(id, token),
    getCandidatePicById(id, token),
  ]);

  if (!candidateResponse?.isSuccess || !candidateResponse.data) {
    return (
      <Card className="p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Candidato no encontrado</h1>
        <p className="mt-2 text-slate-500">
          No se pudo cargar el perfil solicitado desde administración.
        </p>
      </Card>
    );
  }

  return (
    <AdminCandidateProfileView
      candidate={candidateResponse.data}
      picture={picture as string | undefined}
    />
  );
}

