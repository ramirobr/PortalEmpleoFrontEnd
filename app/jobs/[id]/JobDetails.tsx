"use client";
import { Job } from "@/types/jobs";
import JobApplyForm from "../components/JobApplyForm";
import JobSection from "../components/JobSection";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/context/authStore";
import { addVisitaVacante } from "@/lib/jobs/job";
import { useSession } from "next-auth/react";

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

  return (
    <>
      <section className="grid md:grid-cols-[60%_40%] gap-6 mb-8">
        <div>
          <section className="border border-gray-light rounded shadow p-8 grid md:grid-cols-[40%_60%] gap-6">
            <div>
              {job.logoEmpresa && (
                <Image
                  src="/logos/company_logo.png" //FIXME Not valid image
                  alt={`Logo de la empresa ${job.titulo}`}
                  width={150}
                  height={150}
                  className="max-w-[150px] max-h-[150px] m-auto"
                  unoptimized
                />
              )}

              <p className="px-3 py-1 rounded text-2xl font-semibold bg-primary text-white text-center mt-4">
                {job.titulo}
              </p>
            </div>
            <div className="md:border-l-2 md:border-separator-gray md:pl-8">
              <p className="mb-1">
                <span className="font-bold">Empresa:</span> {job.nombreEmpresa}
              </p>
              <p className="mb-1">
                <span className="font-bold">Ubicación:</span> {job.pais},{" "}
                {job.ciudad} {job.provincia}
              </p>
              <p className="mb-1">
                <span className="font-bold">Modalidad:</span> {job.modalidad}
              </p>
              {/* FIXME direccion? 
              <p className="mb-1">
                <span className="font-bold">Dirección:</span> {job.direccion} 
              </p> */}
              {job.correoContacto && (
                <p className="mb-1">
                  <span className="font-bold">Correo:</span>{" "}
                  {isValidEmail(job.correoContacto) ? (
                    <a
                      href={`mailto:${job.correoContacto}`}
                      className="text-blue-600 underline"
                      aria-label={`Enviar correo a ${job.correoContacto}`}
                    >
                      {job.correoContacto}
                    </a>
                  ) : (
                    <span>{job.correoContacto}</span>
                  )}
                </p>
              )}
              {/* FIXME telefono?
              {job.telefono && (
                <p className="mb-1">
                  <span className="font-bold">Teléfono:</span>{" "}
                  {isValidPhone(job.telefono) ? (
                    <a
                      href={`tel:${job.telefono}`}
                      className="text-blue-600 underline"
                      aria-label={`Llamar a ${job.telefono}`}
                    >
                      {job.telefono}
                    </a>
                  ) : (
                    <span>{job.telefono}</span>
                  )}
                </p>
              )} */}
              <p className="mb-1">
                <span className="font-bold">Salario:</span> ${job.salarioBase} -
                ${job.salarioMaximo}
              </p>
              <p className="mb-1">
                <span className="font-bold">Experiencia:</span>{" "}
                {job.experiencia}
              </p>
            </div>
          </section>

          <div className=" pt-4 mt-4">
            <JobSection title="Descripción">
              <p className="whitespace-pre-wrap text-base mb-4">
                {job.descripcion}
              </p>
            </JobSection>
            {/* FIXME Responsabilidades?
            <JobSection title="Responsabilidades">
              <ul className="list-disc pl-6 mb-4">
                {job.responsabilidades?.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </JobSection> */}
            <JobSection title="Requisitos">{job.requisitos}</JobSection>
            {/* FIXME Deseable?
            <JobSection title="Deseable">
              <ul className="list-disc pl-6">
                {job.deseable?.map((d: string, i: number) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </JobSection> */}
          </div>
        </div>
        <div>
          {/* FIXME: mapa?
           {job.mapa && (
            <JobSection title="Ubicación">
              <div className="w-full h-80 rounded-md overflow-hidden border">
                {job.mapa.trim().startsWith("<iframe") ? (
                  <div dangerouslySetInnerHTML={{ __html: job.mapa }} />
                ) : (
                  <iframe
                    src={job.mapa.replace(
                      "https://maps.google.com/?q=",
                      "https://www.google.com/maps?q="
                    )}
                    width="100%"
                    height="100%"
                    className="border-0 w-full h-full"
                    allowFullScreen
                    title={`Mapa de ${job.titulo}`}
                  />
                )}
              </div>
            </JobSection>
          )} */}
        </div>
      </section>
      <JobApplyForm />
    </>
  );
}
