"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Job } from "./JobCard";

function getBadgeColor(type?: string) {
  switch (type) {
    case "Full Time":
      return "bg-secondary text-white";
    case "Part Time":
      return "bg-yellow-100 text-yellow-700";
    case "Internship":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function RecentJobCard({ job }: { job: Job }) {
  const router = useRouter();
  return (
    <div className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col items-center relative min-h-[320px]">
      {/* Job Type Badge */}
      <span
        className={`absolute left-4 top-4 px-3 py-1 rounded text-xs font-semibold ${getBadgeColor(
          job.jobType
        )}`}
      >
        {job.jobType || job.mode}
      </span>
      {/* Favorite Icon */}
      <span className="absolute right-4 top-4">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="12" fill="#E6F4EA" />
          <path
            d="M16.5 9.5c0-1.38-1.12-2.5-2.5-2.5-.96 0-1.78.55-2.18 1.36-.4-.81-1.22-1.36-2.18-1.36-1.38 0-2.5 1.12-2.5 2.5 0 2.28 4.68 5.36 4.68 5.36s4.68-3.08 4.68-5.36z"
            fill="#22C55E"
          />
        </svg>
      </span>
      {/* Logo */}
      <div className="mb-4 mt-8">
        {job.companyLogo ? (
          <Image
            src={job.companyLogo}
            alt={job.company}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border border-gray-200"
            unoptimized
            loading="lazy"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold border border-gray-200">
            {job.company[0]}
          </div>
        )}
      </div>
      {/* Title & Location */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
        {job.title}
      </h3>
      <p className="text-sm text-gray-500 mb-2 text-center">
        {job.companyLocation}
      </p>
      {/* Apply Button */}
      <button
        className="mt-auto px-5 py-2 border-2 border-primary text-primary rounded font-semibold hover:bg-green-50 transition cursor-pointer"
        onClick={() => router.push(`/jobs/${job.id}`)}
      >
        APLICAR
      </button>
    </div>
  );
}
