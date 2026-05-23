import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PublicProfileIndexPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect(`/perfil/perfil-publico/${session.user.id}`);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl text-slate-600">
        Debes iniciar sesión para ver tu perfil público.
      </p>
    </div>
  );
}
