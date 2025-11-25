import Jumbo from "../components/shared/components/Jumbo";
import Navbar from "../components/shared/components/Navbar";
import Footer from "../components/shared/components/Footer";
import Testimonials from "../components/shared/components/Testimonials";
import RecentJobs from "@/components/shared/components/RecentJobs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="">
        <Jumbo />
        <RecentJobs />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
