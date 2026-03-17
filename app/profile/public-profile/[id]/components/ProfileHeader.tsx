import { Button } from "@/components/ui/button";
import { UserInfoData } from "@/types/user";
import { Download, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProfileHeaderProps {
  user: UserInfoData;
  isOwner: boolean;
  curriculumUrl: string;
}

export default function ProfileHeader({
  user,
  isOwner,
  curriculumUrl,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="h-32 bg-teal-500/10 w-full relative">
        <div className="absolute inset-0 bg-[radial-gradient(#14aa9f_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
      </div>
      <div className="px-8 pb-8">
        <div className="relative flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
              <Image
                src={
                  user.profilePictureUrl ||
                  (user.datosPersonales?.genero === "FEMENINO"
                    ? "/avatars/user_female.png"
                    : "/avatars/user.png")
                }
                alt={`${user.datosPersonales?.nombre} ${user.datosPersonales?.apellido}`}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 mt-2 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">
              {user.datosPersonales?.nombre} {user.datosPersonales?.apellido}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-gray-600 mt-1">
              {/* Job Title */}
              <span className="font-medium text-teal-600">
                {user.jobTitle ||
                  user.experienciaLaboral?.[0]?.puesto ||
                  "Candidato"}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>
                  {[user.datosContacto?.ciudad, user.datosContacto?.pais]
                    .filter(Boolean)
                    .join(", ") || "Ubicación no disponible"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
            {isOwner ? (
              <Button asChild className="flex-1 md:flex-none gap-2">
                <Link href="/profile/edit">Editar Perfil</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1 md:flex-none gap-2 border-teal-600 text-teal-600 hover:bg-teal-50"
                  asChild
                >
                  <a href={curriculumUrl} download>
                    <Download size={18} />
                    Descargar CV
                  </a>
                </Button>
                <Button className="flex-1 md:flex-none gap-2 bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-200">
                  <Mail size={18} />
                  Contactar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
