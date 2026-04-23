"use client";

import { useState } from "react";
import { CandidateFilters } from "./CandidateFilters";
import CandidateSearch from "./CandidateSearch";
import { CandidateSearchFiltersResponse } from "@/types/company";

interface CandidatesContentProps {
  initialFilters: Record<string, string>;
  filtersItems: CandidateSearchFiltersResponse | undefined;
  token?: string;
}

export default function CandidatesContent({
  initialFilters,
  filtersItems,
  token,
}: CandidatesContentProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
      <CandidateFilters
        initialFilters={initialFilters}
        filters={filtersItems}
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsFiltersOpen(false)}
        aria-hidden="true"
      />
      <CandidateSearch
        token={token}
        onToggleFilters={() => setIsFiltersOpen(true)}
      />
    </div>
  );
}
