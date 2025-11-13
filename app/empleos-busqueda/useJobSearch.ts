import { useState, useEffect } from "react";
import type { Job, FiltersType } from "./types";

export function useJobSearch() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<FiltersType>({
    dates: [],
    experience: [],
    companies: [],
    modes: [],
  });
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [experience, setExperience] = useState("");
  const [company, setCompany] = useState("");
  const [mode, setMode] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mock = await import("../mocks/jobs.json");
      setAllJobs(mock.jobs);
      setFilters(mock.filters);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  useEffect(() => {
    setLoading(true);
    async function fetchPageJobs() {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filtered = allJobs.filter((job) => {
        const searchText = search.toLowerCase();
        const matchesSearch = [
          job.title,
          job.company,
          job.location,
          job.companyLocation,
          job.description,
          job.experience,
          job.mode,
          job.jobType,
          job.companyIndustry,
          ...(job.requirements || []),
          ...(job.skills || []),
        ]
          .filter((field) => typeof field === "string" && field)
          .some((field) =>
            (field as string).toLowerCase().includes(searchText)
          );

        const matchesLocation = location ? job.location === location : true;
        const matchesExperience = experience
          ? job.experience === experience
          : true;
        const matchesCompany = company ? job.company === company : true;
        const matchesMode = mode ? job.mode === mode : true;
        let matchesDate = true;
        if (date && date !== "all") {
          const posted = new Date(job.postedDate);
          const now = new Date();
          if (date === "last_month") {
            matchesDate =
              posted >=
              new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          } else if (date === "last_week") {
            matchesDate =
              posted >=
              new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          } else if (date === "last_24h") {
            matchesDate =
              posted >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
          }
        }
        return (
          matchesSearch &&
          matchesLocation &&
          matchesExperience &&
          matchesCompany &&
          matchesMode &&
          matchesDate
        );
      });
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      setJobs(filtered.slice(start, end));
      setLoading(false);
    }
    fetchPageJobs();
  }, [
    allJobs,
    search,
    location,
    date,
    experience,
    company,
    mode,
    itemsPerPage,
    page,
  ]);

  return {
    allJobs,
    filters,
    search,
    setSearch,
    location,
    setLocation,
    date,
    setDate,
    experience,
    setExperience,
    company,
    setCompany,
    mode,
    setMode,
    itemsPerPage,
    setItemsPerPage,
    page,
    setPage,
    loading,
    jobs,
  };
}
