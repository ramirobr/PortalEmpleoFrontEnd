import RecentJobs from "@/components/shared/components/RecentJobs";
import MainLayout from "@/components/shared/layout/MainLayout";
import { fetchRecentJobs } from "@/lib/jobs/recent";
import { fetchTestimonials } from "@/lib/testimonials/fetch";
import Footer from "../components/shared/components/Footer";
import Jumbo from "../components/shared/components/Jumbo";
import Testimonials from "../components/shared/components/Testimonials";
import CallToAction from "../components/shared/components/CallToAction";
import { auth } from "@/auth";
import { getVacantesFavoritasByUser } from "@/lib/jobs/favorites";

export default async function Home() {
  const testimonials = await fetchTestimonials();
  const jobs = await fetchRecentJobs();
  const session = await auth();
  const favoriteJobs = await getVacantesFavoritasByUser(session?.user);

  return (
    <MainLayout>
      <Jumbo />
      <RecentJobs jobs={jobs} favJobsByUser={favoriteJobs} />
      <CallToAction />
      <Testimonials testimonials={testimonials} />
      <Footer />
    </MainLayout>
  );
}
