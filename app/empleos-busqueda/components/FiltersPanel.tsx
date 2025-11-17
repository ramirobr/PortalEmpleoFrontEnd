import Filters from "../../shared/components/Filters";
import type { FiltersType, Job } from "../types";

interface FiltersPanelProps {
  search: string;
  setSearch: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  experience: string;
  setExperience: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  mode: string;
  setMode: (v: string) => void;
  jobs: Job[];
  filters: FiltersType;
}

import React from "react";

export default function FiltersPanel(props: FiltersPanelProps) {
  const [salaryRange, setSalaryRange] = React.useState<[number, number]>([1200, 4500]);
  return <Filters {...props} salaryRange={salaryRange} setSalaryRange={setSalaryRange} />;
}
