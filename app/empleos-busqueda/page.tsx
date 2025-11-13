"use client";
import Navbar from "../shared/components/Navbar";
import FiltersPanel from "./components/FiltersPanel";
import JobSection from "./components/JobSection";
import Loader from "../shared/components/Loader";
import Banner from "../shared/components/Banner";
import Footer from "../shared/components/Footer";
import { useJobSearch } from "./useJobSearch";

export default function EmpleosBusquedaPage() {
  const {
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
  } = useJobSearch();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-aut">
        <Banner />
        <section className="container py-12 flex gap-8">
          <FiltersPanel
            search={search}
            setSearch={setSearch}
            location={location}
            setLocation={setLocation}
            date={date}
            setDate={setDate}
            experience={experience}
            setExperience={setExperience}
            company={company}
            setCompany={setCompany}
            mode={mode}
            setMode={setMode}
            jobs={jobs}
            filters={filters}
          />
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <Loader size={48} />
              </div>
            ) : (
              <JobSection
                jobs={jobs}
                page={page}
                setPage={setPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalJobs={
                  allJobs.filter((job) => {
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
                    const matchesLocation = location
                      ? job.location === location
                      : true;
                    const matchesExperience = experience
                      ? job.experience === experience
                      : true;
                    const matchesCompany = company
                      ? job.company === company
                      : true;
                    const matchesMode = mode ? job.mode === mode : true;
                    let matchesDate = true;
                    if (date && date !== "all") {
                      const posted = new Date(job.postedDate);
                      const now = new Date();
                      if (date === "last_month") {
                        matchesDate =
                          posted >=
                          new Date(
                            now.getFullYear(),
                            now.getMonth() - 1,
                            now.getDate()
                          );
                      } else if (date === "last_week") {
                        matchesDate =
                          posted >=
                          new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            now.getDate() - 7
                          );
                      } else if (date === "last_24h") {
                        matchesDate =
                          posted >=
                          new Date(now.getTime() - 24 * 60 * 60 * 1000);
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
                  }).length
                }
                loading={loading}
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
