import React from "react";
import Badge from "@/components/shared/components/Badge";

const jobs = [
  {
    id: 1,
    title: "Junior Graphic Designer (Web)",
    company: "Employer",
    location: "New York",
    date: "Nov 20, 2025",
    status: "Aplicado",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Remote",
    date: "Nov 18, 2025",
    status: "Elegido",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignPro",
    location: "Quito",
    date: "Nov 15, 2025",
    status: "Revisión",
  },
  {
    id: 4,
    title: "Backend Engineer",
    company: "CloudWorks",
    location: "Guayaquil",
    date: "Nov 12, 2025",
    status: "Aplicado",
  },
  {
    id: 5,
    title: "Marketing Specialist",
    company: "Marketify",
    location: "Remote",
    date: "Nov 10, 2025",
    status: "Aplicado",
  },
];

export default function JobsApplied() {
  return (
    <section className="mt-10">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        Trabajos aplicados
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow p-5 flex flex-col gap-2n relative"
          >
            <div className="font-semibold text-primary text-base mt-6">
              {job.title}
            </div>
            <div className="text-sm text-gray-500">
              {job.company} &bull; {job.location}
            </div>
            <div className="text-xs text-gray-400">Enviado en {job.date}</div>
            <Badge
              variant={
                job.status === "Aplicado"
                  ? "blue"
                  : job.status === "Elegido"
                  ? "green"
                  : "yellow"
              }
              className="absolute top-2 right-2"
            >
              {job.status}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
