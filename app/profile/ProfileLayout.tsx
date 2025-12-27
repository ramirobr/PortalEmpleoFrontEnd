"use client";
import Navbar from "@/components/shared/components/Navbar";
import { Children } from "@/types/generic";
import { useEffect, useState } from "react";
import AsideMenu from "@/components/shared/components/AsideMenu";

export default function ProfileLayout({ children }: Children) {
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  const toggleAside = () => setIsAsideOpen((prev) => !prev);
  const closeAside = () => setIsAsideOpen(false);

  useEffect(() => {
    document.body.style.overflow = isAsideOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAsideOpen]);

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar onHamburgerClick={toggleAside} isAsideOpen={isAsideOpen} />
      <div className="flex relative">
        <AsideMenu
          isOpen={isAsideOpen}
          onClose={closeAside}
          side="left"
          className="absolute top-0 left-0 h-full w-64 transform-none bg-white shadow-none md:shadow"
        />
        <main className="w-full flex-1 py-10">
          <div className="container">{children}</div>
        </main>
      </div>
    </div>
  );
}
