"use client";
import { Job } from "@/types/jobs";
import JobApplyForm from "../components/JobApplyForm";
import JobSection from "../components/JobSection";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/context/authStore";
import { addVisitaVacante } from "@/lib/jobs/job";
import { useSession } from "next-auth/react";
import { ROLES } from "@/types/auth";
import { Card } from "@/components/ui/card";
import {
  Banknote,
  Briefcase,
  Building,
  Building2,
  Calendar,
  GraduationCap,
  Mail,
  MapPin,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import IconBadge from "@/components/shared/components/IconBadge";

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}
function isValidPhone(phone: string) {
  return /^\+?[0-9\s-]+$/.test(phone);
}
function isValidMap(url: string) {
  return /^https?:\/\/.+/.test(url);
}

export default function JobDetails(job: Job) {
  const id = useAuthStore((s) => s.id);
  const { data: session } = useSession();
  const viewedRef = useRef(false);

  useEffect(() => {
    if (!id || !session || viewedRef.current) return;
    viewedRef.current = true;
    addVisitaVacante(job.idVacante, id, session.user.accessToken);
  }, [id, job.idVacante, session]);
  console.log(job);

  // Construir la URL del logo desde base64
  const logoSrc = job.logoEmpresa
    ? job.logoEmpresa.startsWith("data:")
      ? job.logoEmpresa
      : `data:image/png;base64,${job.logoEmpresa}`
    : "/logos/company_logo.png";

  return (
    <>
      <section>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-8">
              <Card>
                <div className="flex md:flex-row flex-col items-center gap-6">
                  <div className="w-[100px] h-[100px] rounded-xl">
                    <Image
                      src={logoSrc}
                      alt={`Logo de ${job.nombreEmpresa}`}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full rounded-xl object-center"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h2 className="text-3xl font-bold text-center md:text-left ">
                      {job.titulo}
                    </h2>
                    <div className="flex md:flex-row flex-col items-center md:gap-6 gap-3">
                      <p className="text-primary font-medium flex items-center gap-2">
                        <Building2 />
                        {job.nombreEmpresa}
                      </p>
                      <p className="text-primary font-medium flex items-center gap-2">
                        <MapPin />
                        {job.nombreEmpresa}
                      </p>
                    </div>
                    <p className="text-primary font-medium flex items-center gap-2">
                      <Calendar />
                      {timeAgo(job.fechaPublicacion)}
                    </p>
                  </div>
                </div>
              </Card>
              <Card>
                <TituloSubrayado className="text-black">
                  Descripción del puesto
                </TituloSubrayado>
                <div>{job.descripcion}</div>
              </Card>
              <Card>
                <TituloSubrayado className="text-black">
                  Requisitos
                </TituloSubrayado>
                <div>{job.requisitos}</div>
              </Card>
            </div>
            <div>
              <Card>
                <TituloSubrayado className="text-black">
                  Resumen de la oferta
                </TituloSubrayado>
                <div className="font-bold flex items-center gap-4">
                  <IconBadge size={32} icon={Banknote} />
                  <div>
                    <p className="text-primary uppercase tracking-wide">
                      Salario
                    </p>
                    <p className="font-medium text-gray-800">
                      ${job.salarioBase.toLocaleString()} - $
                      {job.salarioMaximo.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="font-bold flex items-center gap-4">
                  <IconBadge size={32} icon={MapPin} />
                  <div>
                    <p className="text-primary uppercase tracking-wide">
                      Ciudad
                    </p>
                    <p className="font-medium text-gray-800">{job.ciudad}</p>
                  </div>
                </div>
                <div className="font-bold flex items-center gap-4">
                  <IconBadge size={32} icon={Briefcase} />
                  <div>
                    <p className="text-primary uppercase tracking-wide">
                      Experiencia
                    </p>
                    <p className="font-medium text-gray-800">
                      {job.experiencia}
                    </p>
                  </div>
                </div>
                <div className="font-bold flex items-center gap-4">
                  <IconBadge size={32} icon={Building} />
                  <div>
                    <p className="text-primary uppercase tracking-wide">
                      Modalidad
                    </p>
                    <p className="font-medium text-gray-800">{job.modalidad}</p>
                  </div>
                </div>
                <div className="font-bold flex items-center gap-4">
                  <IconBadge size={32} icon={GraduationCap} />
                  <div>
                    <p className="text-primary uppercase tracking-wide">
                      Nivel de estudios
                    </p>
                    <p className="font-medium text-gray-800">
                      {job.nivelEstudios}
                    </p>
                  </div>
                </div>
                <div className="font-bold flex items-center gap-4">
                  <IconBadge size={32} icon={Mail} />
                  <div>
                    <p className="text-primary uppercase tracking-wide">
                      Correo de contacto
                    </p>
                    <a
                      href={`mailto:${job.correoContacto}`}
                      className="font-medium text-gray-800 break-all"
                    >
                      {job.correoContacto}
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* Formulario de aplicación */}
            {session?.user.role === ROLES.Postulante && (
              <JobApplyForm
                idUsuario={String(session?.user?.id || 0)}
                idVacante={job.idVacante}
                token={session?.user?.accessToken}
              />
            )}
          </div>
          {/*FIN COLS*/}
        </div>
        {/*FIN CONTAINER*/}
      </section>
    </>
  );
}
