"use client";
import jobsDetails from "../../mocks/jobDetails.json";
import Navbar from "../../shared/components/Navbar";

import Footer from "../../shared/components/Footer";
import { use } from "react";
import JobApplyForm from "../components/JobApplyForm";
import Banner from "../../shared/components/Banner";
import JobSection from "../components/JobSection";
import Image from "next/image";

type JobDetailsProps = { params: Promise<{ id: string }> | { id: string } };

function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Promise<T>).then === "function"
  );
}

// Add Job type
type Job = {
  id: string;
  title: string;
  company: string;
  companyLocation: string;
  descripcion: string;
  responsabilidades: string[];
  requisitos: string[];
  deseable: string[];
  experiencia: string;
  correo: string;
  telefono: string;
  salario: string;
  direccion: string;
  mapa: string;
  mode?: string;
  horario?: string;
  companyLogo?: string;
};

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}
function isValidPhone(phone: string) {
  return /^\+?[0-9\s-]+$/.test(phone);
}
function isValidMap(url: string) {
  return /^https?:\/\/.+/.test(url);
}

export default function JobDetailsPage({ params }: JobDetailsProps) {
  const resolvedParams = isPromise<{ id: string }>(params)
    ? use(params)
    : params;
  const jobId = String(resolvedParams.id);
  const job: Job = jobsDetails[jobId as keyof typeof jobsDetails];

  if (!job) {
    return (
      <div className="min-h-screen bg-zinc-50 ">
        <Navbar />
        <main className="mx-auto max-w-2xl py-12 px-4">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Trabajo no encontrado
          </h1>
        </main>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Banner />
      <main className="mx-auto py-12 px-4 flex flex-col gap-8">
        <div className="container max-w-6xl">
          <section className="grid md:grid-cols-[60%_40%] gap-6 mb-8">
            <div>
              <section className="border border-gray-light rounded shadow p-8 grid md:grid-cols-[40%_60%] gap-6">
                <div>
                  {job.companyLogo ? (
                    <Image
                      src={job.companyLogo}
                      alt={`Logo de la empresa ${job.company}`}
                      width={150}
                      height={150}
                      className="max-w-[150px] max-h-[150px] m-auto "
                      unoptimized
                    />
                  ) : null}

                  <p className="px-3 py-1 rounded text-2xl font-semibold bg-primary text-white text-center mt-4">
                    {job.title}
                  </p>
                </div>
                <div className="md:border-l-2 md:border-separator-gray md:pl-8">
                  <p className="mb-1">
                    <span className="font-bold">Ubicación:</span>{" "}
                    {job.companyLocation}
                  </p>
                  <p className="mb-1">
                    <span className="font-bold">Modalidad:</span> {job.mode}
                  </p>
                  <p className="mb-1">
                    <span className="font-bold">Dirección:</span>{" "}
                    {job.direccion}
                  </p>
                  {job.correo && (
                    <p className="mb-1">
                      <span className="font-bold">Correo:</span>{" "}
                      {isValidEmail(job.correo) ? (
                        <a
                          href={`mailto:${job.correo}`}
                          className="text-blue-600 underline"
                          aria-label={`Enviar correo a ${job.correo}`}
                        >
                          {job.correo}
                        </a>
                      ) : (
                        <span>{job.correo}</span>
                      )}
                    </p>
                  )}
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
                  )}
                  <p className="mb-1">
                    <span className="font-bold">Salario:</span> {job.salario}
                  </p>
                  {job.horario && (
                    <p className="mb-1">
                      <span className="font-bold">Horario:</span> {job.horario}
                    </p>
                  )}
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
                <JobSection title="Responsabilidades">
                  <ul className="list-disc pl-6 mb-4">
                    {job.responsabilidades?.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </JobSection>
                <JobSection title="Requisitos">
                  <ul className="list-disc pl-6 mb-4">
                    {job.requisitos?.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </JobSection>
                <JobSection title="Deseable">
                  <ul className="list-disc pl-6">
                    {job.deseable?.map((d: string, i: number) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </JobSection>
              </div>
            </div>
            <div>
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
                        title={`Mapa de ${job.company}`}
                      />
                    )}
                  </div>
                </JobSection>
              )}
            </div>
          </section>
          <JobApplyForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
