"use client";
import jobsDetails from "../../mocks/jobDetails.json";
import Navbar from "../../shared/components/Navbar";

import Footer from "../../shared/components/Footer";
import { useState, use } from "react";
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
  const job: Job = jobsDetails[resolvedParams.id as keyof typeof jobsDetails];
  const [form, setForm] = useState({
    name: "",
    email: "",
    cv: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!form.email.trim()) newErrors.email = "El correo es obligatorio.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Correo inválido.";
    if (form.cv && !/^https?:\/\/.+/.test(form.cv))
      newErrors.cv = "El enlace debe ser una URL válida.";
    return newErrors;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
      return;
    }
    setSuccess(true);
    setForm({ name: "", email: "", cv: "", message: "" });
    setErrors({});
  }

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
          <section className="rounded-md shadow-lg p-4 mb-4 bg-arsenic">
            <h1 className="text-2xl font-bold mb-2 text-white !mb-0">
              {job.title}
            </h1>
          </section>
          <section>
            <div className="flex items-center gap-4 mb-1">
              {job.companyLogo ? (
                <Image
                  src={job.companyLogo}
                  alt={`Logo de la empresa ${job.company}`}
                  width={48}
                  height={48}
                  className="rounded-full border border-gray-300 object-cover"
                  unoptimized
                />
              ) : null}
              <p className="text-lg font-semibold text-gray-700">
                {job.company}
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              Ubicación: {job.companyLocation}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Dirección: {job.direccion}
            </p>
            {job.correo && isValidEmail(job.correo) && (
              <p className="text-sm text-gray-500 mb-1">
                Correo:{" "}
                <a
                  href={`mailto:${job.correo}`}
                  className="text-blue-600 underline"
                >
                  {job.correo}
                </a>
              </p>
            )}
            {job.telefono && isValidPhone(job.telefono) && (
              <p className="text-sm text-gray-500 mb-1">
                Teléfono:{" "}
                <a
                  href={`tel:${job.telefono}`}
                  className="text-blue-600 underline"
                >
                  {job.telefono}
                </a>
              </p>
            )}
            <p className="text-sm text-gray-500 mb-1">Salario: {job.salario}</p>
            {job.horario && (
              <p className="text-sm text-gray-500 mb-1">
                Horario: {job.horario}
              </p>
            )}
            {job.mapa && isValidMap(job.mapa) && (
              <p className="text-sm text-blue-600 underline mb-1">
                <a href={job.mapa} target="_blank" rel="noopener noreferrer">
                  Ver mapa
                </a>
              </p>
            )}
            <p className="text-sm text-gray-500 mb-1">
              Experiencia requerida: {job.experiencia}
            </p>
            <div className="border-t pt-4 mt-4">
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
            {job.mapa && isValidMap(job.mapa) && (
              <section className="max-w-6xl mx-auto my-8">
                <JobSection title="Ubicación en el mapa">
                  <div className="w-full h-80 rounded-md overflow-hidden border">
                    <iframe
                      src={job.mapa.replace(
                        "https://maps.google.com/?q=",
                        "https://www.google.com/maps?q="
                      )}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Mapa de ${job.company}`}
                    />
                  </div>
                </JobSection>
              </section>
            )}
          </section>
          <section className="bg-white rounded-lg shadow p-8 mt-10">
            <h2 className="text-2xl font-bold mb-4 text-green-700 ">
              Formulario de aplicación
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
              noValidate
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className="text-xs text-red-600">{errors.name}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="text-xs text-red-600">{errors.email}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="cv"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Enlace a tu CV o portafolio
                </label>
                <input
                  type="url"
                  id="cv"
                  name="cv"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
                    errors.cv ? "border-red-500" : ""
                  }`}
                  value={form.cv}
                  onChange={handleChange}
                />
                {errors.cv && (
                  <span className="text-xs text-red-600">{errors.cv}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Mensaje adicional
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                  placeholder="¿Por qué te interesa este puesto?"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold mt-2"
              >
                Enviar aplicación
              </button>
              {success && (
                <div className="mt-4 text-green-700 font-semibold">
                  ¡Tu aplicación ha sido enviada exitosamente!
                </div>
              )}
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
