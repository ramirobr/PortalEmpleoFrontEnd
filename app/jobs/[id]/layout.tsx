import Banner from "@/components/shared/components/Banner";
import Navbar from "@/components/shared/components/Navbar";
import { Children } from "@/types/generic";
import { Footer } from "react-day-picker";

export default function layout({ children }: Children) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <Banner />
      <main className="mx-auto py-12 px-4 flex flex-col gap-8">
        <div className="container max-w-6xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
