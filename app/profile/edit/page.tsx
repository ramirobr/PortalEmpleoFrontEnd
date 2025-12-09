"use client";
import Navbar from "../../../components/shared/components/Navbar";
import AsideMenu from "../components/AsideMenu";
import EditarFoto from "../components/EditarFoto";
import EditarDatosPersonales from "../components/EditarDatosPersonales";
import EditarDatosContacto from "../components/EditarDatosContacto";
import EditarEducacion from "../components/EditarEducacion";

export default function EditProfilePage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Navbar />
      <div className="flex">
        <AsideMenu />
        <main className="flex-1 px-10 py-8">
          <EditarFoto />
          <EditarDatosPersonales />
          <EditarDatosContacto />
          <EditarEducacion />
        </main>
      </div>
    </div>
  );
}
