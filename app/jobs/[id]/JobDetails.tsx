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
      <section className="w-full max-w-7xl mx-auto mb-8">
        {/* Header con título y empresa - ancho completo */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-t-xl p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.titulo}</h1>
          <p className="text-white/90 text-lg">{job.nombreEmpresa}</p>
        </div>

        {/* Card de información de la empresa - ancho completo */}
        <section className="border border-gray-light border-t-0 rounded-b-xl shadow-md bg-white mb-6">
          <div className="p-6 flex flex-col lg:flex-row gap-6">
            {/* Logo de la empresa */}
            <div className="flex-shrink-0 flex justify-center lg:justify-start">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl border-2 border-gray-100 shadow-sm overflow-hidden bg-gray-50 flex items-center justify-center">
                <Image
                  src={logoSrc}
                  alt={`Logo de ${job.nombreEmpresa}`}
                  width={100}
                  height={100}
                  className="object-contain w-full h-full p-2"
                  unoptimized
                />
              </div>
            </div>

            {/* Información del puesto - grid más amplio */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              <div className="flex items-center gap-3">
                <span className="text-primary text-lg">📍</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Ciudad</p>
                  <p className="font-medium text-gray-800">{job.ciudad}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-primary text-lg">🏢</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Modalidad</p>
                  <p className="font-medium text-gray-800">{job.modalidad}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-primary text-lg">🎓</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Nivel de estudios</p>
                  <p className="font-medium text-gray-800">{job.nivelEstudios}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-primary text-lg">⏱️</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Experiencia</p>
                  <p className="font-medium text-gray-800">{job.experiencia}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-primary text-lg">💰</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Salario</p>
                  <p className="font-medium text-gray-800">
                    ${job.salarioBase.toLocaleString()} - ${job.salarioMaximo.toLocaleString()}
                  </p>
                </div>
              </div>

              {job.correoContacto && (
                <div className="flex items-center gap-3">
                  <span className="text-primary text-lg">✉️</span>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Contacto</p>
                    {isValidEmail(job.correoContacto) ? (
                      <a
                        href={`mailto:${job.correoContacto}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors break-all"
                        aria-label={`Enviar correo a ${job.correoContacto}`}
                      >
                        {job.correoContacto}
                      </a>
                    ) : (
                      <p className="font-medium text-gray-800">{job.correoContacto}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contenido principal y formulario */}
        <div className={`grid grid-cols-1 gap-6 ${
          session?.user.role === ROLES.Postulante 
            ? "lg:grid-cols-[1fr_380px]" 
            : ""
        }`}>
          {/* Descripción y requisitos */}
          <div className="space-y-6">
            <JobSection title="Descripción">
              <p className="whitespace-pre-wrap text-base leading-relaxed">
                {job.descripcion}
              </p>
            </JobSection>
            <JobSection title="Requisitos">{job.requisitos}</JobSection>
          </div>

          {/* Formulario de aplicación */}
          {session?.user.role === ROLES.Postulante && (
            <div className="lg:sticky lg:top-4 self-start">
              <JobApplyForm
                idUsuario={String(session?.user?.id || 0)}
                idVacante={job.idVacante}
                token={session?.user?.accessToken}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
