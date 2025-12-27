import { getUserInfoByUserId } from "@/lib/user/userInfo";
import EditarDatosContacto from "../components/EditarDatosContacto";
import EditarDatosPersonales from "../components/EditarDatosPersonales";
import EditarEducacion from "../components/EditarEducacion";
import EditarExperenciaLaboral from "../components/EditarExperenciaLaboral";
import EditarFoto from "../components/EditarFoto";
import EditarHabilidades from "../components/EditarHabilidades";
import EditarResumen from "../components/EditarResumen";
import { auth } from "@/auth";
import { fetchDatosPersonalesFields } from "@/lib/user/profile";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session) return;
  console.log(session.user);
  const user = await getUserInfoByUserId(session.user.accessToken);
  const fields = await fetchDatosPersonalesFields();
  console.log(user);
  if (!user) return;

  return (
    <div className="flex flex-col gap-10">
      <EditarFoto />
      <EditarDatosPersonales user={user} fields={fields} />
      <EditarDatosContacto datosContacto={user.datosContacto} />
      <EditarEducacion educacion={user.educacion} />
      <EditarExperenciaLaboral
        experiencia={user.experienciaLaboral}
        pais={fields?.pais}
      />
      <EditarHabilidades habilidades={user.habiliades} />
      <EditarResumen />
    </div>
  );
}
