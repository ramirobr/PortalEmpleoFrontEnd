import PaginatedApplicantList from "@/app/empresa-profile/components/PaginatedApplicantList";

const generateApplicants = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Candidato Rechazado ${i + 1}`,
    location: "Guayaquil, EC",
    salary: `$${1000 + i * 50}`,
    skills: ["Java", "Spring", "Hibernate"],
  }));
};

const rejectedApplicants = generateApplicants(25);

export const metadata = {
  title: "Candidatos Rechazados | PortalEmpleo",
  description: "Lista de candidatos rechazados",
};

export default function RechazadosPage() {
  return (
    <div className="container mx-auto px-6 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mt-6">
        Candidatos Rechazados
      </h1>
      <p className="text-gray-500 mb-6">
        Historial de candidatos que no continuaron en el proceso.
      </p>
      <PaginatedApplicantList
        title=""
        applicants={rejectedApplicants}
        disableReject={true}
      />
    </div>
  );
}
