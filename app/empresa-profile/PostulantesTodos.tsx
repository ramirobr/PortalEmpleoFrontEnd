"use client";

import React, { useState } from "react";
import ApplicantCard from "@/components/shared/components/ApplicantCard";
import { Slider } from "@/components/ui/slider";

// Mock Data Generator
const generateApplicants = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Candidato ${i + 1}`,
    location: i % 2 === 0 ? "Quito, EC" : "Guayaquil, EC",
    salary: `$${1000 + i * 50}`,
    skills: i % 2 === 0 ? ["React", "TypeScript"] : ["Node.js", "Express"],
  }));
};

const allApplicants = generateApplicants(25); // 25 items for 3 pages

export default function PostulantesTodos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [salaryRange, setSalaryRange] = useState([500, 3000]);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Filter Logic
  const filteredApplicants = allApplicants.filter((app) => {
    const query = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(query) ||
      app.location.toLowerCase().includes(query) ||
      app.salary.toLowerCase().includes(query) ||
      app.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplicants = filteredApplicants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6">
      {/* Top Search Bar */}

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Filter Panel (40%) */}
        <aside className="w-full md:w-[30%] bg-white p-6 rounded-lg shadow h-fit sticky top-4">
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar postulantes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
            Filtros
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <select className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-primary focus:border-primary">
                <option>Todas</option>
                <option>Quito, EC</option>
                <option>Guayaquil, EC</option>
                <option>Cuenca, EC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Expectativa Salarial: ${salaryRange[0]} - ${salaryRange[1]}
              </label>
              <Slider
                min={0}
                max={5000}
                step={50}
                value={salaryRange}
                onValueChange={setSalaryRange}
                className="py-4"
              />
            </div>

            <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors mt-4 cursor-pointer">
              Aplicar Filtros
            </button>
          </div>
        </aside>

        {/* List (60%) */}
        <div className="w-full md:w-[70%] flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Resultados ({filteredApplicants.length})
          </h2>
          {currentApplicants.map((applicant) => (
            <ApplicantCard key={applicant.id} applicant={applicant} />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded bg-white disabled:opacity-50 cursor-pointer"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded cursor-pointer ${currentPage === page ? "bg-primary text-white" : "bg-white hover:bg-gray-50"}`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded bg-white disabled:opacity-50 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
