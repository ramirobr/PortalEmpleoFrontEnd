import CambiarContrasena from "@/app/profile/components/CambiarContrasena";

export default function EmpresaCambiarContrasenaPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-primary">Seguridad</h1>
      <CambiarContrasena />
    </div>
  );
}
