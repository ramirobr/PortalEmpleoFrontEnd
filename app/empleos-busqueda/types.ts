export type Job = {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  companyIndustry?: string;
  location: string;
  companyLocation: string;
  description: string;
  requirements: string[];
  postedDate: string;
  experience: string;
  mode: string;
  jobType?: string;
  skills?: string[];
  jobNumber?: number;
};

export type FilterOption = { label: string; value: string };

export type FiltersType = {
  dates: FilterOption[];
  experience: FilterOption[];
  companies: string[];
  modes: FilterOption[];
};
