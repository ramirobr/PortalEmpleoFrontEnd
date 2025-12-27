import { RecentJob } from "@/types/jobs";

// Mock data para trabajos favoritos
// TODO: Reemplazar con llamada real al API cuando esté disponible
export async function fetchFavoriteJobs(): Promise<RecentJob[]> {
  // Simulamos datos de favoritos
  return [
    {
      id: "1",
      titulo: "Desarrollador Frontend",
      empresa: "Tech Solutions",
      modalidad: "Remoto",
      ciudad: "Quito",
      provincia: "Pichincha",
      salario: "$1,500 - $2,500",
      fecha: "2025-12-10",
    },
    {
      id: "2",
      titulo: "Ingeniero Backend",
      empresa: "CloudSoft",
      modalidad: "Presencial",
      ciudad: "Guayaquil",
      provincia: "Guayas",
      salario: "$2,000 - $3,000",
      fecha: "2025-12-15",
    },
    {
      id: "3",
      titulo: "Desarrollador Frontend",
      empresa: "Tech Solutions",
      modalidad: "Remoto",
      ciudad: "Quito",
      provincia: "Pichincha",
      salario: "$1,500 - $2,500",
      fecha: "2025-12-10",
    },
    {
      id: "4",
      titulo: "Ingeniero Backend",
      empresa: "CloudSoft",
      modalidad: "Presencial",
      ciudad: "Guayaquil",
      provincia: "Guayas",
      salario: "$2,000 - $3,000",
      fecha: "2025-12-15",
    },
  ];
}
