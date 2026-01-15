"use client";
import { Job } from "@/types/jobs";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  jobs: Job[];
}

export function JobList({ jobs }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {jobs?.map((job) => (
        <div
          key={job.idVacante}
          className="bg-white border rounded-md p-6 shadow hover:shadow-lg transition mb-3 relative border-gray-light"
        >
          <div className="flex items-center gap-4">
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
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {job.nombreEmpresa}
              </h2>
              <p className="text-sm text-gray-500">
                {job.titulo || "Software Development"}
              </p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="flex mt-8">
            <div className="w-4/5">
              <p className="mb-1">
                <span className="font-semibold">Tipo de trabajo:</span>{" "}
                {job.titulo}
              </p>

              <div className="mb-1 flex items-center gap-2">
                <span className="font-semibold">Habilidades:</span>
                {/* {job.skills && job.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((skill) => (
                      <div
                        key={skill}
                        className="bg-secondary text-white px-2 py-0.5 rounded text-xs font-medium"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                ) : (
                )} */}
                <span className="text-gray-400">
                  No hay habilidades listadas
                </span>
              </div>

              <p className="mb-1">
                <span className="font-semibold">Experiencia:</span>{" "}
                {job.experiencia}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Ubicación:</span> {job.pais},{" "}
                {job.ciudad}, {job.provincia}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Modalidad:</span>{" "}
                {job.modalidad}
              </p>
            </div>

            <div className="w-1/5 flex flex-col gap-3 items-end md:items-start md:ml-6 mt-4 md:mt-0">
              <button
                className="btn btn-primary block w-full shadow-md uppercase cursor-pointer"
                onClick={() => router.push(`/jobs/${job.idVacante}`)}
              >
                Aplicar
              </button>
              <button
                className="btn btn-secondary uppercase block w-full cursor-pointer"
                onClick={() => router.push(`/jobs/${job.idVacante}`)}
              >
                VER
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
