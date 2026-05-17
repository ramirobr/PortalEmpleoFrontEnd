"use client";

import { useHasMounted } from "@/lib/hooks";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  const hasMounted = useHasMounted();

  return (
    <footer className="bg-primary py-6 border-t border-zinc-200 text-center text-white">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-between px-4 text-white text-sm mb-2 lg:mb-0">
          <div>
            &copy; {hasMounted ? new Date().getFullYear() : "2024"} Portal Empleo. Todos los derechos reservados.
          </div>
          <SocialLinks
            colorClass="text-white"
            hoverColorClass="hover:text-zinc-200"
          />
        </div>
      </div>
    </footer>
  );
}
