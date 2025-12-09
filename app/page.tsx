import Jumbo from "../components/shared/components/Jumbo";
import Navbar from "../components/shared/components/Navbar";
import Footer from "../components/shared/components/Footer";
import Testimonials from "../components/shared/components/Testimonials";
import RecentJobs from "@/components/shared/components/RecentJobs";
import { fetchTestimonials } from "@/lib/testimonials/fetch";
import { fetchRecentJobs } from "@/lib/jobs/recent";

export default async function Home() {
  const testimonials = await fetchTestimonials();
  const jobs = await fetchRecentJobs();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="">
        <Jumbo />
        <RecentJobs jobs={jobs} />
        <Testimonials testimonials={testimonials} />
      </main>
      <Footer />
    </div>
  );
}
