import { auth } from "@/auth";
import { getCurriculumByUserId, getUserInfoByUserId } from "@/lib/user/info";
import { fetchDatosPersonalesFields } from "@/lib/user/profile";
import EditarDatosContacto from "../components/EditarDatosContacto";
import EditarDatosPersonales from "../components/EditarDatosPersonales";
import EditarEducacion from "../components/EditarEducacion";
import EditarExperenciaLaboral from "../components/EditarExperenciaLaboral";
import EditarFoto from "../components/EditarFoto";
import EditarHabilidades from "../components/EditarHabilidades";
import EditarResumen from "../components/EditarResumen";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session) return;
  const curriculum = await getCurriculumByUserId(session.user);
  const user = await getUserInfoByUserId(session.user);
  const fields = await fetchDatosPersonalesFields();
  if (!user) return;
  console.log(session);

  return (
    <div className="flex flex-col gap-10">
      <EditarFoto />
      <EditarDatosPersonales user={user} fields={fields} />
      <EditarDatosContacto user={user} fields={fields} />
      <EditarEducacion educacion={user.educacion} fields={fields} />
      <EditarExperenciaLaboral
        experiencia={user.experienciaLaboral}
        fields={fields}
      />
      <EditarHabilidades
        habilidades={user.habiliades}
        fields={fields}
      />
      <EditarResumen curriculum={curriculum} fields={fields} />
    </div>
  );
}
