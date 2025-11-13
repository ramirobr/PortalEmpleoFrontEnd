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

export default function FiltersPanel(props: FiltersPanelProps) {
  return <Filters {...props} />;
}
