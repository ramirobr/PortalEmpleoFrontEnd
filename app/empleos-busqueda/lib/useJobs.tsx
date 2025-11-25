"use client";

import { useEffect, useState } from "react";
import { Job } from "../types";
import jobsData from "@/lib/mocks/jobs.json";

export function useJobs(params: URLSearchParams) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const limit = Number(params.get("limit") ?? 10);
  const page = Number(params.get("page") ?? 1);
  const sort = params.get("sort") ?? "recent";
  const q = params.get("q")?.toLowerCase() ?? "";
  const location = params.get("location") ?? "";
  const experience = params.get("experience") ?? "";
  const company = params.get("company") ?? "";
  const mode = params.get("mode") ?? "";
  const minSalary = Number(params.get("min") ?? 0);
  const maxSalary = Number(params.get("max") ?? Infinity);
  const fecha = params.get("date") ?? "";

  useEffect(() => {
    setLoading(true);
    let list = jobsData.jobs as Job[];

    list = list.filter((job) => {
      const matchesSearch = q
        ? [
            job.title,
            job.company,
            job.location,
            job.companyLocation,
            job.description,
            ...(job.skills ?? []),
            ...(job.requirements ?? []),
          ].some((f) => f.toLowerCase().includes(q))
        : true;

      const matchesLocation = location ? job.location === location : true;
      const matchesExperience = experience
        ? job.experience === experience
        : true;
      const matchesCompany = company ? job.company === company : true;
      const matchesMode = mode ? job.mode === mode : true;
      const matchesSalary = job.salary
        ? job.salary >= minSalary && job.salary <= maxSalary
        : true;

      const posted = Date.parse(job.postedDate);
      const hours = (Date.now() - posted) / 36e5;
      const limits: Record<string, number> = {
        last_24h: 24,
        last_week: 24 * 7,
        last_month: 24 * 30,
      };
      const matchesFecha = hours <= (limits[fecha] ?? Infinity);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesExperience &&
        matchesCompany &&
        matchesMode &&
        matchesSalary &&
        matchesFecha
      );
    });

    if (sort === "recent") {
      list = list.sort(
        (a, b) =>
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
    } else {
      list = list.sort(
        (a, b) =>
          new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    setJobs(list.slice(start, end));
    setTotal(list.length);
    setLoading(false);
  }, [params.toString()]);

  return { jobs, total, limit, page, loading };
}
