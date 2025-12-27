"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

export type FavoriteButtonProps = {
  jobId: string;
  isFavorite?: boolean;
  session: Session | null;
};

export default function FavoriteButton({
  jobId,
  isFavorite = false,
  session,
}: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const router = useRouter();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Si no hay sesión, redirigir a crear cuenta
    if (!session) {
      router.push("/auth/crear");
      return;
    }

    // TODO: Aquí iría la llamada al API para agregar/remover favorito
    // const response = await fetch(`/api/favorites/${jobId}`, {
    //   method: favorite ? "DELETE" : "POST",
    // });
    // if (response.ok) {
    //   setFavorite(!favorite);
    // }

    // Por ahora solo cambia el estado local
    setFavorite(!favorite);
  };

  return (
    <button
      onClick={handleFavoriteClick}
      className="absolute right-4 top-4 hover:scale-110 transition cursor-pointer"
      aria-label={favorite ? "Remover de favoritos" : "Agregar a favoritos"}
    >
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="12"
          fill={favorite ? "#DCFCE7" : "#E6F4EA"}
        />
        <path
          d="M16.5 9.5c0-1.38-1.12-2.5-2.5-2.5-.96 0-1.78.55-2.18 1.36-.4-.81-1.22-1.36-2.18-1.36-1.38 0-2.5 1.12-2.5 2.5 0 2.28 4.68 5.36 4.68 5.36s4.68-3.08 4.68-5.36z"
          fill={favorite ? "#15803D" : "#D1D5DB"}
        />
      </svg>
    </button>
  );
}
