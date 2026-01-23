"use client";

import React from "react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import Badge from "./Badge";
import {
  MapPinIcon,
  EyeIcon,
  CheckIcon,
  XCircleIcon,
  TrashIcon,
} from "@/components/shared/icons/Icons";

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

export default function ApplicantCard({
  applicant,
  disableApprove,
  disableReject,
}: ApplicantCardProps) {
  return (
    <div className="flex flex-col p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group focus-within:ring-2 focus-within:ring-primary focus-within:bg-gray-50 gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <UserAvatar
              src={applicant.photo ? `data:image/jpeg;base64,${applicant.photo}` : undefined}
              size={48}
              alt={`Foto de ${applicant.name}`}
              className="ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
            <div className="flex items-center text-sm text-gray-500 gap-2 mt-0.5">
              <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
              <span>{applicant.location}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {applicant.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="custom"
                  fontSize="text-xs"
                  bgColor="bg-green-100"
                  textColor="text-green-700"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="flex items-center gap-2 mt-2">
        <Link
          href={`/empresa-profile/candidato/${applicant.id}`}
          className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
          aria-label={`Ver perfil de ${applicant.name}`}
          title="Ver Perfil"
        >
          <EyeIcon className="w-3 h-3" />
        </Link>

        <button
          disabled={disableApprove}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            disableApprove
              ? "bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed"
              : "bg-sky-50 text-teal-600 hover:bg-teal-600 hover:text-white"
          }`}
          aria-label={`Aprobar a ${applicant.name}`}
          title={disableApprove ? "Ya aprobado" : "Aprobar"}
          onClick={() =>
            !disableApprove && console.log("Aprobar", applicant.id)
          }
        >
          <CheckIcon className="w-3 h-3" />
        </button>

        <button
          disabled={disableReject}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            disableReject
              ? "bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed"
              : "bg-sky-50 text-teal-600 hover:bg-teal-600 hover:text-white"
          }`}
          aria-label={`Rechazar a ${applicant.name}`}
          title={disableReject ? "Ya rechazado" : "Rechazar"}
          onClick={() =>
            !disableReject && console.log("Rechazar", applicant.id)
          }
        >
          <XCircleIcon className="w-3 h-3" />
        </button>

        <button
          className="p-2 bg-sky-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
          aria-label={`Eliminar a ${applicant.name}`}
          title="Eliminar"
          onClick={() => console.log("Eliminar", applicant.id)}
        >
          <TrashIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
