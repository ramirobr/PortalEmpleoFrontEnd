import { PremiumButton } from "@/components/shared/components/PremiumButton";
import { Search } from "lucide-react";

export default function DashboardCTAButton() {
  return (
    <div className="flex justify-center mt-12 mb-6">
      <PremiumButton
        href="/empleos-busqueda"
        variant="primary"
        size="lg"
        icon={<Search className="w-5 h-5" />}
        className="px-14 py-4 text-lg"
      >
        ¡Buscar Ofertas Ahora!
      </PremiumButton>
    </div>
  );
}
