"use client";
import {
  removeVacanteFavorita,
  addVacanteFavorita,
} from "@/lib/jobs/favorites";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Heart } from "lucide-react";

export type FavoriteButtonProps = {
  jobId: string;
  isFavorite?: boolean;
  onUnfavorite?: () => void;
};

export default function FavoriteButton({
  jobId,
  isFavorite = false,
  onUnfavorite,
}: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const { data: session } = useSession();
  const { push } = useRouter();

  const handleFavoriteClick = async () => {
    if (!session) {
      push("/auth/email");
      return;
    }

    favorite
      ? removeVacanteFavorita(jobId, session.user.id, session.user.accessToken)
      : addVacanteFavorita(jobId, session.user.id, session.user.accessToken);
    setFavorite(!favorite);
    onUnfavorite?.();
  };

  const isLoggedIn = !!session;

  return (
    <button
      onClick={handleFavoriteClick}
      className="absolute right-4 top-4 hover:scale-110 transition cursor-pointer p-2 rounded-full"
      aria-label={favorite ? "Remover de favoritos" : "Agregar a favoritos"}
    >
      <Heart
        className={`size-6 transition-colors ${
          !isLoggedIn
            ? "text-slate-400 fill-zinc-400"
            : favorite
              ? "text-primary fill-primary"
              : "text-slate-400"
        }`}
      />
    </button>
  );
}
