import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-primary py-6  border-t border-gray-200 text-center text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="text-white text-sm mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} Portal Empleo. Todos los derechos
          reservados.
        </div>
        <SocialLinks
          colorClass="text-white"
          hoverColorClass="hover:text-gray-200"
        />
      </div>
    </footer>
  );
}
