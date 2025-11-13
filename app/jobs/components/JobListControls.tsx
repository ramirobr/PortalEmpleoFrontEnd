import React from "react";

interface JobListControlsProps {
  sort: string;
  setSort: (value: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  total: number;
}

const JobListControls = ({
  sort,
  setSort,
  itemsPerPage,
  setItemsPerPage,
  total,
}: JobListControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-8 w-full">
      {/* Left: Total jobs found */}
      <div className="font-bold text-lg ">{total} empleos encontrados</div>
      {/* Right: Sort and items per page controls */}
      <div className="flex gap-4 items-center justify-end">
        <label htmlFor="sort" className="font-semibold text-md  mr-2">
          Ordenar por:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-md px-3 py-2 text-base focus:outline-none focus:ring focus:border-primary"
        >
          <option value="recent">Más Reciente</option>
          <option value="viewed">Más Visto</option>
          <option value="searched">Más Buscado</option>
        </select>
        <label htmlFor="itemsPerPage" className="font-semibold text-md  mr-2">
          Items por página:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="rounded-md px-3 py-2 text-base focus:outline-none focus:ring focus:border-primary"
        >
          {[10, 20, 30, 40, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default JobListControls;
// ...existing code from app/components/JobListControls.tsx
