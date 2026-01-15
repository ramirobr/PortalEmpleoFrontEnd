"use client";
import FavoriteButton from "@/components/shared/components/FavoriteButton";
import { RecentJob } from "@/types/jobs";
import Image from "next/image";
import Link from "next/link";

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

export type CardProps = {
  job: RecentJob;
  isFav?: boolean;
};

export default function RecentJobCard({ job, isFav }: CardProps) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col items-center relative min-h-80">
      <FavoriteButton jobId={job.id} isFavorite={isFav} />
      <div className="mb-4 mt-8">
        <Image
          // FIXME src={t.logo} logo path doesnt work
          src="/logos/company_logo.png"
          alt=""
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover border border-gray-200"
          unoptimized
          loading="lazy"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
        {job.titulo}
      </h3>
      <p className="text-sm text-gray-500 mb-2 text-center">{job.provincia}</p>
      <Link
        className="mt-auto px-5 py-2 border-2 border-primary text-primary rounded font-semibold hover:bg-green-50 transition cursor-pointer"
        href={`/jobs/${job.id}`}
      >
        APLICAR
      </Link>
    </div>
  );
}
