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
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import JobApplyForm from "../components/JobApplyForm";
import { getOrCreateConversacion } from "@/lib/mensajes/api";
import { MESSAGING_ENABLED } from "@/lib/utils";

type ArchivoPublico = {
  idArchivoEmpresa: string;
  nombreArchivo: string;
  extension?: string;
  contentType?: string;
  tipoArchivo: string;
};

export default function JobDetails(job: Job) {
  const id = useAuthStore((s) => s.id);
  const openFloatingChat = useAuthStore((s) => s.openFloatingChat);
  const { data: session } = useSession();
  const viewedRef = useRef(false);
  const [archivos, setArchivos] = useState<ArchivoPublico[]>([]);
  const [contactando, setContactando] = useState(false);

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
                    <h2 className="text-3xl font-semibold text-center md:text-left ">
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
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{job.descripcion}</div>
              </Card>
              <Card>
                <TituloSubrayado>Requisitos</TituloSubrayado>
                {job.requisitos ? (
                  (() => {
                    const lineas = job.requisitos.split("\n").map((l) => l.trim()).filter(Boolean);
                    const predefinidos = [
                      "Buena presencia", "Comunicativo/a", "Proactividad",
                      "Responsabilidad", "Trabajo en equipo", "Puntualidad",
                    ];
                    const badges = lineas.filter((l) => predefinidos.includes(l));
                    const extras = lineas.filter((l) => !predefinidos.includes(l));
                    return (
                      <div className="space-y-3">
                        {badges.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {badges.map((b) => (
                              <span
                                key={b}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                              >
                                <CheckCircle2 className="size-3.5" />
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                        {extras.length > 0 && (
                          <ul className="space-y-1">
                            {extras.map((e) => (
                              <li key={e} className="flex items-start gap-2 text-sm text-slate-700">
                                <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                                {e}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-sm text-slate-500">Sin requisitos especificados.</p>
                )}
              </Card>

              {/* Formulario de aplicación */}
              {session?.user.role === ROLES.Postulante && (
                <JobApplyForm
                  idUsuario={String(session?.user?.id || 0)}
                  idVacante={job.idVacante}
                  token={session?.user?.accessToken}
                />
              )}
            </div>
            <div>
              <Card>
                <TituloSubrayado>Resumen de la oferta</TituloSubrayado>
                <div className="flex flex-col gap-4 ">
                  <div className="flex items-center gap-4 pt-0">
                    <IconBadge size={32} icon={Banknote} className="shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Salario
                      </p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">
                        ${job.salarioBase.toLocaleString()} - $
                        {job.salarioMaximo.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <IconBadge size={32} icon={MapPin} className="shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Ciudad
                      </p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">{job.ciudad}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <IconBadge size={32} icon={Briefcase} className="shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Experiencia
                      </p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">
                        {job.experiencia}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <IconBadge size={32} icon={Building} className="shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Modalidad
                      </p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">{job.modalidad}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <IconBadge size={32} icon={GraduationCap} className="shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Nivel de estudios
                      </p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">
                        {job.nivelEstudios}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <IconBadge size={32} icon={Mail} className="shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Correo de contacto
                      </p>
                      <a
                        href={`mailto:${job.correoContacto}`}
                        className="text-sm font-semibold text-slate-900 mt-0.5 break-all hover:underline"
                      >
                        {job.correoContacto}
                      </a>
                    </div>
                  </div>
                  {job.inicioLabores && (
                    <div className="flex items-center gap-4 pt-4">
                      <IconBadge size={32} icon={Clock} className="shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Inicio de labores
                        </p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">
                          {job.inicioLabores === "Fecha específica" && job.fechaInicioLabores
                            ? `${job.inicioLabores}: ${job.fechaInicioLabores}`
                            : job.inicioLabores}
                        </p>
                      </div>
                    </div>
                  )}
                  {job.aniosExperiencia != null && (
                    <div className="flex items-center gap-4 pt-4">
                      <IconBadge size={32} icon={Briefcase} className="shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Años de experiencia
                        </p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{job.aniosExperiencia} año{job.aniosExperiencia !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Sobre la empresa */}
              <Card className="mt-6">
                <TituloSubrayado>Sobre la empresa</TituloSubrayado>
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-14 relative shrink-0">
                    <Image
                      src={logoSrc}
                      alt={`Logo de ${job.nombreEmpresa}`}
                      fill
                      sizes="56px"
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{job.nombreEmpresa}</p>
                    {job.correoContacto && (
                      <a
                        href={`mailto:${job.correoContacto}`}
                        className="text-sm text-primary flex items-center gap-1 mt-1"
                      >
                        <Mail className="size-3" />
                        {job.correoContacto}
                      </a>
                    )}
                  </div>
                </div>
                <Link
                  href={`/empleos-busqueda?empresa=${encodeURIComponent(job.nombreEmpresa)}`}
                  className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="size-4" />
                  Ver más empleos de esta empresa
                </Link>

                {/* Contactar empresa via mensajería interna */}
                {MESSAGING_ENABLED && session?.user.role === ROLES.Postulante && job.idEmpresa && (
                  <button
                    type="button"
                    disabled={contactando}
                    onClick={async () => {
                      if (!id || !session?.user.accessToken) return;
                      setContactando(true);
                      try {
                        const res = await getOrCreateConversacion(
                          {
                            idUsuario: id,
                            idEmpresa: job.idEmpresa!,
                            idVacante: job.idVacante,
                          },
                          session.user.accessToken,
                        );
                        if (res?.isSuccess) {
                          openFloatingChat(res.data.idConversacion, job.nombreEmpresa);
                        }
                      } finally {
                        setContactando(false);
                      }
                    }}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm cursor-pointer"
                  >
                    <MessageSquare className="size-4" />
                    {contactando ? "Iniciando chat…" : "Contactar empresa"}
                  </button>
                )}
                {archivos.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Documentos de la empresa</p>
                    <ul className="space-y-1">
                      {archivos.map((a) => (
                        <li key={a.idArchivoEmpresa} className="flex items-center gap-2 text-sm text-slate-600">
                          <FileText className="size-4 text-primary shrink-0" />
                          <span>{a.nombreArchivo}</span>
                          {a.tipoArchivo && (
                            <span className="text-xs text-slate-400">({a.tipoArchivo})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </div>
          </div>
          {/*FIN COLS*/}
        </div>
        {/*FIN CONTAINER*/}
      </section>
    </>
  );
}
