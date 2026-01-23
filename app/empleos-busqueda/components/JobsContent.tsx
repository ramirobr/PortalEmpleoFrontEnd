"use client";

import { useState } from "react";
import { Filters } from "@/components/shared/components/Filters";
import Search from "./Search";
import { FiltersResponse } from "@/types/search";

interface JobsContentProps {
  initialFilters: Record<string, string>;
  filtersItems: FiltersResponse | undefined;
  token?: string;
}

export default function JobsContent({
  initialFilters,
  filtersItems,
  token,
}: JobsContentProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
      <Filters
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
      <Search token={token} onToggleFilters={() => setIsFiltersOpen(true)} />
    </div>
  );
}
