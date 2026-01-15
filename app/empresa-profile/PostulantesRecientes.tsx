"use client";

import Badge from "@/components/shared/components/Badge";
import UserAvatar from "@/components/shared/components/UserAvatar";
import Link from "next/link";
import ApplicantCard from "@/components/shared/components/ApplicantCard";

const recentApplicants = [
  {
    id: 1,
    name: "Ana García",
    location: "Quito, EC",
    salary: "$1,200",
    skills: ["React", "TypeScript", "Tailwind"],
  },
  {
    id: 2,
    name: "Carlos López",
    location: "Guayaquil, EC",
    salary: "$1,500",
    skills: ["Node.js", "Express", "MongoDB"],
  },
  {
    id: 3,
    name: "María Rodríguez",
    location: "Cuenca, EC",
    salary: "$900",
    skills: ["Vue.js", "Firebase"],
  },
  {
    id: 4,
    name: "Juan Pérez",
    location: "Quito, EC",
    salary: "$2,000",
    skills: ["Angular", "RxJS", "Sass"],
  },
  {
    id: 5,
    name: "Sofía Martínez",
    location: "Ambato, EC",
    salary: "$1,100",
    skills: ["Python", "Django"],
  },
  {
    id: 6,
    name: "Luis Hernández",
    location: "Manta, EC",
    salary: "$1,300",
    skills: ["Java", "Spring Boot"],
  },
  {
    id: 7,
    name: "Elena Torres",
    location: "Loja, EC",
    salary: "$1,000",
    skills: ["PHP", "Laravel"],
  },
  {
    id: 8,
    name: "Diego Ramírez",
    location: "Quito, EC",
    salary: "$1,800",
    skills: ["Docker", "Kubernetes", "AWS"],
  },
  {
    id: 9,
    name: "Valentina Sánchez",
    location: "Guayaquil, EC",
    salary: "$1,400",
    skills: ["Figma", "UI/UX"],
  },
  {
    id: 10,
    name: "Andrés Flores",
    location: "Ibarra, EC",
    salary: "$1,150",
    skills: ["Swift", "iOS"],
  },
];

export default function PostulantesRecientes() {
  return (
    <section
      className="p-6 bg-white rounded-lg shadow mt-8"
      aria-labelledby="recent-applicants-title"
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          id="recent-applicants-title"
          className="text-2xl font-semibold text-gray-900"
        >
          Postulantes Recientes
        </h2>
        <Link
          href="/empresa-profile/candidatos"
          className="text-sm text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
          aria-label="Ver todos los postulantes"
        >
          Ver todos
        </Link>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recentApplicants.map((applicant) => (
          <li key={applicant.id}>
            <ApplicantCard applicant={applicant} />
          </li>
        ))}
      </ul>
    </section>
  );
}
