"use client";
import Loader from "@/components/shared/components/Loader";
import { useCandidates } from "../hooks/useCandidates";
import { CandidateList } from "./CandidateList";
import { TopFilters } from "@/components/shared/components/TopFilters";

type Props = {
  token?: string;
  onToggleFilters?: () => void;
};

export default function CandidateSearch({ token, onToggleFilters }: Props) {
  const { candidates, total, loading } = useCandidates(token);

  return (
    <div className="flex-1">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader size={48} />
        </div>
      ) : (
        <>
          <TopFilters
            total={total}
            onToggleFilters={onToggleFilters}
            entityName="candidatos"
          />
          <CandidateList candidates={candidates} />
        </>
      )}
    </div>
  );
}
