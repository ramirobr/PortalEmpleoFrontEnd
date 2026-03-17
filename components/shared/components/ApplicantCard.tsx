"use client";

import React from "react";
import Link from "next/link";

export interface Applicant {
  id: string;
  name: string;
  location: string;
  salary: string;
  skills: string[];
  photo: string;
}

interface ApplicantCardProps {
  applicant: Applicant;
  disableApprove?: boolean;
  disableReject?: boolean;
}

export default function ApplicantCard({ applicant }: ApplicantCardProps) {
  return (
    <div className="bg-white border-primary shadow hover:shadow-lg mb-3 relative border-l-8 border-l-primary rounded-xl transition-all overflow-hidden h-full flex flex-col">
      <div className="p-6 relative flex-1 flex flex-col">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border border-gray-light shrink-0">
            {applicant.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`data:image/jpeg;base64,${applicant.photo}`}
                className="w-full h-full object-cover"
                alt={`Foto de ${applicant.name}`}
              />
            ) : (
              <span className="text-xl font-bold text-primary">
                {applicant.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            )}
          </div>
        </div>

        {/* Name and Details */}
        <div className="text-center w-full mb-4">
          <h3 className="text-xl font-bold text-primary mb-1 leading-snug capitalize">
            {applicant.name}
          </h3>
          <div className="text-sm font-bold uppercase tracking-widest leading-snug">
            {applicant.skills?.length > 0 ? (
              <p>{applicant.skills[0]}</p>
            ) : (
              <p>Candidato</p>
            )}
          </div>
        </div>

        {/* Verified Profile Bar - matching JobCard */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 bg-primary rounded-full h-9 flex items-center px-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-[20%] bg-secondary" />
            <span className="relative z-10 text-white text-[11px] font-bold uppercase text-center w-full pr-[15%]">
              PERFIL 100% VERIFICADO
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 my-4" />

        <div className="space-y-4 flex-1">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 text-primary mt-0.5 shrink-0">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                Ubicación
              </span>
              <span className="text-sm font-medium text-gray-700">
                {applicant.location || "No especificada"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-4 h-4 text-primary mt-0.5 shrink-0">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-gray-400 block tracking-wider">
                Aspiración salarial
              </span>
              <p className="text-sm font-medium text-gray-700">
                {applicant.salary || "$750 - 800"}
              </p>
            </div>
          </div>

          {applicant.skills?.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-2 tracking-wider">
                Habilidades
              </span>
              <div className="flex flex-wrap gap-1.5">
                {applicant.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Link
        href={`/empresa-profile/candidato/${applicant.id}`}
        className="bg-primary hover:bg-secondary text-white text-sm font-bold uppercase py-4 transition-colors text-center cursor-pointer w-full mt-auto"
      >
        VER PERFIL
      </Link>
    </div>
  );
}
