"use client";
import IconBadge from "@/components/shared/components/IconBadge";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/context/authStore";
import { addVisitaVacante } from "@/lib/jobs/job";
import { fetchApi } from "@/lib/apiClient";
import { timeAgo } from "@/lib/utils";
import { ROLES } from "@/types/auth";
import { Job } from "@/types/jobs";
import { GenericResponse } from "@/types/user";
import {
  Banknote,
  Briefcase,
  Building,
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import JobApplyForm from "../components/JobApplyForm";

type ArchivoPublico = {
  idArchivoEmpresa: string;
  nombreArchivo: string;
  extension?: string;
  contentType?: string;
  tipoArchivo: string;
};

export default function JobDetails(job: Job) {
  const id = useAuthStore((s) => s.id);
  const { data: session } = useSession();
  const viewedRef = useRef(false);
  const [archivos, setArchivos] = useState<ArchivoPublico[]>([]);

  useEffect(() => {
    if (
      !id ||
      !session ||
      session.user.role !== ROLES.Postulante ||
      viewedRef.current
    )
      return;
    viewedRef.current = true;
    addVisitaVacante(job.idVacante, id, session.user.accessToken);
  }, [id, job.idVacante, session]);

  useEffect(() => {
    if (!job.idEmpresa) return;
    fetchApi<GenericResponse<ArchivoPublico[]>>(
      `/Archivos/public-archivos-empresa/${job.idEmpresa}`
    ).then((res) => {
      if (res?.data) setArchivos(res.data);
    });
  }, [job.idEmpresa]);

  // Construir la URL del logo desde base64
  const logoSrc = job.logoEmpresa
    ? job.logoEmpresa.startsWith("data:")
      ? job.logoEmpresa
      : `data:image/png;base64,${job.logoEmpresa}`
    : "/logos/company_logo.png";

  // Construir la URL del banner desde base64
  const bannerSrc = job.bannerEmpresa
    ? job.bannerEmpresa.startsWith("data:")
      ? job.bannerEmpresa
      : `data:image/png;base64,${job.bannerEmpresa}`
    : null;

  return (
    <>
      {/* Banner */}
      {bannerSrc && (
        <section>
          <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-200">
            <Image
              src={bannerSrc}
              alt={`Banner para ${job.titulo}`}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        </section>
      )}
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
                        {job.ciudad}{job.provincia ? `, ${job.provincia}` : ""}
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
                <TituloSubrayado>Descripción del puesto</TituloSubrayado>
                <div>{job.descripcion}</div>
              </Card>
              <Card>
                <TituloSubrayado>Requisitos</TituloSubrayado>
                <div>{job.requisitos}</div>
              </Card>
            </div>
            <div>
              <Card>
                <TituloSubrayado>Resumen de la oferta</TituloSubrayado>
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
                {job.inicioLabores && (
                  <div className="font-bold flex items-center gap-4">
                    <IconBadge size={32} icon={Briefcase} />
                    <div>
                      <p className="text-primary uppercase tracking-wide">
                        Inicio de labores
                      </p>
                      <p className="font-medium text-gray-800">{job.inicioLabores}</p>
                    </div>
                  </div>
                )}
                {job.aniosExperiencia != null && (
                  <div className="font-bold flex items-center gap-4">
                    <IconBadge size={32} icon={Briefcase} />
                    <div>
                      <p className="text-primary uppercase tracking-wide">
                        Años de experiencia
                      </p>
                      <p className="font-medium text-gray-800">{job.aniosExperiencia} año{job.aniosExperiencia !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Sobre la empresa */}
              <Card className="mt-6">
                <TituloSubrayado>Sobre la empresa</TituloSubrayado>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 relative shrink-0">
                    <Image
                      src={logoSrc}
                      alt={`Logo de ${job.nombreEmpresa}`}
                      fill
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{job.nombreEmpresa}</p>
                    {job.correoContacto && (
                      <a
                        href={`mailto:${job.correoContacto}`}
                        className="text-sm text-primary flex items-center gap-1 mt-1"
                      >
                        <Mail className="w-3 h-3" />
                        {job.correoContacto}
                      </a>
                    )}
                  </div>
                </div>
                <Link
                  href={`/empleos-busqueda?empresa=${encodeURIComponent(job.nombreEmpresa)}`}
                  className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver más empleos de esta empresa
                </Link>
                {archivos.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Documentos de la empresa</p>
                    <ul className="space-y-1">
                      {archivos.map((a) => (
                        <li key={a.idArchivoEmpresa} className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4 text-primary shrink-0" />
                          <span>{a.nombreArchivo}</span>
                          {a.tipoArchivo && (
                            <span className="text-xs text-gray-400">({a.tipoArchivo})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
