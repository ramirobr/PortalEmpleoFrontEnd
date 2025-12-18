import Navbar from "../../../components/shared/components/Navbar";
import AsideMenu from "../components/AsideMenu";
import EditarFoto from "../components/EditarFoto";
import EditarDatosPersonales from "../components/EditarDatosPersonales";
import EditarDatosContacto from "../components/EditarDatosContacto";
import EditarEducacion from "../components/EditarEducacion";
import EditarExperenciaLaboral from "../components/EditarExperenciaLaboral";
import EditarHabilidades from "../components/EditarHabilidades";
import { auth } from "@/auth";

export default async function EditProfilePage() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Navbar />
      <div className="flex">
        <AsideMenu session={session} />
        <main className="flex-1 px-10 py-8">
          <EditarFoto />
          <EditarDatosPersonales />
          <EditarDatosContacto />
          <EditarEducacion />
          <EditarExperenciaLaboral />
          <EditarHabilidades />
        </main>
      </div>
    </div>
  );
}
