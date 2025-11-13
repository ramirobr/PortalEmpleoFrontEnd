import Link from "next/link";
import Image from "next/image";
// import SocialLinks from "./SocialLinks";

export default function Navbar() {
  return (
    <nav className="p-4 flex justify-between items-center shadow-lg">
      <Link
        href="/"
        aria-label="Ir a la página principal"
        className="flex items-center"
      >
        <Image
          src="/logos/logo-empresa.jpg"
          alt="Logo de la empresa"
          width={200}
          height={200}
          className=""
          loading="lazy"
        />
      </Link>
      <ul className="flex items-center space-x-4" aria-label="Main menu">
        <li>
          <Link
            href="/"
            className="font-bold uppercase text-primary hover:text-secondary focus:text-secondary"
          >
            JOBS
          </Link>
        </li>
        <li>
          <Link
            href="/profile"
            className="font-bold uppercase text-primary hover:text-secondary focus:text-secondary"
          >
            PROFILE
          </Link>
        </li>
      </ul>
      <div className="flex items-center space-x-2">
        <a
          href="/signin"
          className="btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Crear cuenta
        </a>
        <a
          href="/signin"
          className="btn btn-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Ingresar
        </a>
      </div>
      {/* <SocialLinks /> */}
    </nav>
  );
}
