import { auth } from "@/auth";
import { getCandidateInfoById, getCandidatePicById } from "@/lib/user/info";
import { fetchDatosPersonalesFields } from "@/lib/user/profile";
import { CatalogsByType } from "@/types/search";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import LanguagesSection from "./components/LanguagesSection";
import ProfileHeader from "./components/ProfileHeader";
import ProfileSidebar from "./components/ProfileSidebar";

interface PublicProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { id } = await params;
  const session = await auth();

  const user = await getCandidateInfoById(id, session?.user?.accessToken || "");
  const profilePic = await getCandidatePicById(
    id,
    session?.user?.accessToken || "",
  );
  const catalogs = await fetchDatosPersonalesFields();

  if (user) {
    if (profilePic) {
      user.profilePictureUrl = profilePic;
    }

    if (catalogs) {
      if (user.datosContacto) {
        if (user.datosContacto.idPais) {
          const pais = catalogs.pais?.find(
            (p: CatalogsByType) =>
              String(p.idCatalogo) === String(user.datosContacto.idPais),
          );
          if (pais) {
            user.datosContacto.pais = pais.nombre;
          }
        }

        if (user.datosContacto.idCiudad) {
          const ciudad = catalogs.ciudad?.find(
            (c: CatalogsByType) =>
              String(c.idCatalogo) === String(user.datosContacto.idCiudad),
          );
          if (ciudad) {
            user.datosContacto.ciudad = ciudad.nombre;
          }
        }
      }
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl text-gray-600">
          No se encontró el perfil del usuario.
        </p>
      </div>
    );
  }

  const isOwner = session?.user?.id === id;
  const curriculumUrl = `${process.env.NEXT_PUBLIC_API}/User/${id}/curriculum`;

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={user}
        isOwner={isOwner}
        curriculumUrl={curriculumUrl}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <ExperienceSection experiencia={user.experienciaLaboral} />
          <EducationSection educacion={user.educacion} />
          <LanguagesSection idiomas={user.idiomas} />
        </div>

        {/* Right Column - Sidebar */}
        <ProfileSidebar user={user} />
      </div>
    </div>
  );
}
