import { ROLES } from "@/types/auth";
import { NavLink } from "@/components/shared/components/AsideMenu";
import {
  LockKeyholeOpen,
  UserRoundPlus,
  Building2,
  Building,
  KeyRound,
  Search,
  FolderOpen,
  MessageSquareQuote,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import React from "react";
import { MESSAGING_ENABLED } from "@/lib/utils";

export const getAuthLinks = (): NavLink[] => [
  {
    name: "Ingresar",
    href: "/auth/login",
    icon: <LockKeyholeOpen />,
  },
  {
    name: "Crear cuenta",
    href: "/auth/email",
    icon: <UserRoundPlus />,
  },
  {
    name: "Regístrate como empresa",
    href: "/auth/empresa",
    icon: <Building2 />,
  },
];

export const getUserLinks = (handleLogout?: () => void): NavLink[] => [
  {
    name: "Inicio",
    href: "/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M6 19h3v-5q0-.425.288-.712T10 13h4q.425 0 .713.288T15 14v5h3v-9l-6-4.5L6 10zm-2 0v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-4q-.425 0-.712-.288T13 20v-5h-2v5q0 .425-.288.713T10 21H6q-.825 0-1.412-.587T4 19m8-6.75"
        />
      </svg>
    ),
  },
  {
    name: "Dashboard",
    href: "/perfil",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 2H5L4 3v14l1 1h10l1-1V3l-1-1m0 15H5v-3h2a1 1 0 0 0 2 0 1 1 0 0 0-2-1H5v-3h2a1 1 0 0 0 2 0 1 1 0 0 0-2 0H5V7h2a1 1 0 0 0 2-1 1 1 0 0 0-2 0H5V3h10v14zm-8-3 1-1v1H7m0-4h1-1m0-4h1c1 0 0 0 0 0v1L7 6" />
      </svg>
    ),
  },
  {
    name: "Editar Perfil",
    href: "/perfil/editar",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
      </svg>
    ),
  },
  {
    name: "Buscar Empleos",
    href: "/empleos-busqueda",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
    ),
  },
  {
    name: "Empleos favoritos",
    href: "/perfil/favoritos",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.071 13.142 13.414 18.8a2 2 0 0 1-2.828 0l-5.657-5.657A5 5 0 1 1 12 6.072a5 5 0 0 1 7.071 7.07"
        />
      </svg>
    ),
  },
  {
    name: "Mis Testimonios",
    href: "/perfil/testimonios",
    icon: <MessageSquareQuote width={20} height={20} />,
  },
  {
    name: "Recomendaciones",
    href: "/perfil/recomendaciones",
    icon: <ThumbsUp width={20} height={20} />,
  },
  {
    name: "Mis Archivos",
    href: "/perfil/archivos",
    icon: <FolderOpen width={20} height={20} />,
  },
  ...(MESSAGING_ENABLED ? [{
    name: "Mensajes",
    href: "/perfil/mensajes",
    icon: <MessageSquare width={20} height={20} />,
  }] : []),
  {
    name: "Cambiar contraseña",
    href: "/perfil/cambiar-contrasena",
    icon: <KeyRound width={20} height={20} />,
  },
  {
    name: "Salir",
    onClick: handleLogout,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 4.001H5v14a2 2 0 0 0 2 2h8m1-5 3-3m0 0-3-3m3 3H9"
        />
      </svg>
    ),
  },
];

export const getEmpresaLinks = (handleLogout?: () => void): NavLink[] => [
  {
    name: "Inicio",
    href: "/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M6 19h3v-5q0-.425.288-.712T10 13h4q.425 0 .713.288T15 14v5h3v-9l-6-4.5L6 10zm-2 0v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-4q-.425 0-.712-.288T13 20v-5h-2v5q0 .425-.288.713T10 21H6q-.825 0-1.412-.587T4 19m8-6.75"
        />
      </svg>
    ),
  },
  {
    name: "Panel de Empresa",
    href: "/empresa-perfil",
    icon: <Building2 width={20} height={20} />,
  },
  {
    name: "Perfil de Empresa",
    href: "/empresa-perfil/perfil",
    icon: <Building width={20} height={20} />,
  },
  {
    name: "Publicar Empleo",
    href: "/empresa-perfil/crear-empleo",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    ),
  },
  {
    name: "Mis Ofertas",
    href: "/empresa-perfil/empleos",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
      </svg>
    ),
  },
  {
    name: "Postulaciones",
    href: "/empresa-perfil/postulaciones",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    name: "Buscar Candidatos",
    href: "/empresa-perfil/buscar-candidatos",
    icon: <Search width={20} height={20} />,
  },
  {
    name: "Mis Archivos",
    href: "/empresa-perfil/archivos",
    icon: <FolderOpen width={20} height={20} />,
  },
  ...(MESSAGING_ENABLED ? [{
    name: "Mensajes",
    href: "/empresa-perfil/mensajes",
    icon: <MessageSquare width={20} height={20} />,
  }] : []),
  {
    name: "Cambiar contraseña",
    href: "/empresa-perfil/cambiar-contrasena",
    icon: <KeyRound width={20} height={20} />,
  },
  {
    name: "Salir",
    onClick: handleLogout,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 4.001H5v14a2 2 0 0 0 2 2h8m1-5 3-3m0 0-3-3m3 3H9"
        />
      </svg>
    ),
  },
];
