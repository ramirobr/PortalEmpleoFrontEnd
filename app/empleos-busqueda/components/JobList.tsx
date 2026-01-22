"use client";
import Badge from "@/components/shared/components/Badge";
import { Job } from "@/types/jobs";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  jobs: Job[];
}

export function JobList({ jobs }: Props) {
  const router = useRouter();

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {jobs?.map((job) => (
        <div
          key={job.idVacante}
          className="bg-white border rounded-lg shadow hover:border-primary hover:shadow-lg transition mb-3 relative border-gray-light rounded-xl transition-all overflow-hidden h-full flex justify-between flex-col"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {job.logoEmpresa ? (
                <Image
                  src={job.logoEmpresa}
                  alt={`Logo de la empresa ${job.nombreEmpresa}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border border-gray-light shrink-0"
                  unoptimized
                  loading="lazy"
                />
              ) : (
                <Image
                  src="/logos/company_logo.png"
                  alt={`Logo de la empresa ${job.nombreEmpresa}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border border-gray-light shrink-0"
                  unoptimized
                  loading="lazy"
                />
              )}
              <div className="text-center">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 leading-tight text-center">
                  {job.nombreEmpresa}
                </h2>
                <p className="text-lg font-bold text-black mb-4 leading-snug text-center">
                  {job.titulo || "Software Development"}
                </p>
                <Badge
                  variant="custom"
                  bgColor="bg-black"
                  textColor="text-white"
                  noButton={true}
                >
                  {job.modalidad}
                </Badge>
              </div>
            </div>

            <hr className="my-3" />

            <div className="mt-8 space-x-5">
              <p className="mb-1">
                <span className="text-sm uppercase font-bold text-slate-400">
                  Experiencia:
                </span>
                <br />
                <span className="text-md">{job.experiencia}</span>
              </p>
              <p className="mb-1">
                <span className="text-sm uppercase font-bold text-slate-400">
                  Ubicación:
                </span>{" "}
                <br />
                <span className="text-md">
                  {job.pais}, {job.ciudad}, {job.provincia}
                </span>
              </p>
            </div>
          </div>
          <div className="">
            <button
              className="btn btn-primary block w-full shadow-md uppercase cursor-pointer rounded-none"
              onClick={() => router.push(`/jobs/${job.idVacante}`)}
            >
              Aplicar
            </button>
            <button
              className="btn btn-secondary uppercase block w-full cursor-pointer rounded-tl-none rounded-tr-none"
              onClick={() => router.push(`/jobs/${job.idVacante}`)}
            >
              VER
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
