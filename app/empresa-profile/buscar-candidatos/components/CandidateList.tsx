import { CandidateSearchResult } from "@/types/company";
import CandidateCard from "./CandidateCard";

interface Props {
  candidates: CandidateSearchResult[];
}

export function CandidateList({ candidates }: Props) {
  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-slate-600 mb-2">
          No se encontraron candidatos
        </p>
        <p className="text-sm text-slate-500">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.idUsuario} candidate={candidate} />
      ))}
    </div>
  );
}
