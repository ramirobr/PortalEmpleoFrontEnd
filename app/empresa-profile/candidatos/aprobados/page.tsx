import PaginatedApplicantList from "@/app/empresa-profile/components/PaginatedApplicantList";

const generateApplicants = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Candidato Aprobado ${i + 1}`,
    location: "Quito, EC",
    salary: `$${1200 + i * 50}`,
    skills: ["React", "TypeScript", "Next.js"],
  }));
};

const approvedApplicants = generateApplicants(25);

export const metadata = {
  title: "Candidatos Aprobados | PortalEmpleo",
  description: "Lista de candidatos aprobados",
};

export default function AprobadosPage() {
  return (
    <div className="container mx-auto px-6 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mt-6">
        Candidatos Aprobados
      </h1>
      <p className="text-gray-500 mb-6">
        Gestiona los candidatos que han sido aprobados en el proceso.
      </p>
      <PaginatedApplicantList
        title=""
        applicants={approvedApplicants}
        disableApprove={true}
      />
    </div>
  );
}
