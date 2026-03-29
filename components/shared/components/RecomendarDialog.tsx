"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star, ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/lib/apiClient";
import { toast } from "sonner";
import { GenericResponse } from "@/types/user";

interface RecomendarDialogProps {
  idUsuario: string;
  nombreCandidato: string;
}

const LABELS = ["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"];

export default function RecomendarDialog({
  idUsuario,
  nombreCandidato,
}: RecomendarDialogProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [razonRecomendacion, setRazonRecomendacion] = useState("");
  const [nombreRevisor, setNombreRevisor] = useState("");
  const [cargoRevisor, setCargoRevisor] = useState("");
  const [loading, setLoading] = useState(false);

  const idEmpresa = session?.user?.idEmpresa;

  const reset = () => {
    setPuntuacion(0);
    setHoveredStar(0);
    setRazonRecomendacion("");
    setNombreRevisor("");
    setCargoRevisor("");
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) reset();
  };

  const handleSubmit = async () => {
    if (!session?.user?.accessToken || !idEmpresa) return;
    if (puntuacion === 0) {
      toast.error("Debes seleccionar una puntuación");
      return;
    }
    if (razonRecomendacion.trim().length < 20) {
      toast.error("La recomendación debe tener al menos 20 caracteres");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchApi<GenericResponse<string>>(
        "/Recomendaciones/create",
        {
          method: "POST",
          token: session.user.accessToken,
          body: {
            idUsuario,
            idEmpresa,
            puntuacion,
            razonRecomendacion: razonRecomendacion.trim(),
            nombreRevisor: nombreRevisor.trim() || null,
            cargoRevisor: cargoRevisor.trim() || null,
          },
        },
      );

      if (response?.isSuccess) {
        toast.success("Recomendación enviada correctamente");
        handleOpenChange(false);
      } else {
        toast.error(
          response?.messages?.[0] || "Error al enviar la recomendación",
        );
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const activeStar = hoveredStar || puntuacion;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex-1 md:flex-none gap-2 bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-200">
          <ThumbsUp size={18} />
          Recomendar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recomendar a {nombreCandidato}</DialogTitle>
          <DialogDescription>
            Comparte tu experiencia con este candidato. Tu recomendación será
            visible en su perfil.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-2">
          {/* Datos del revisor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1.5">
                Tu nombre{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </p>
              <Input
                placeholder="Ej: Andrea Molina"
                value={nombreRevisor}
                onChange={(e) => setNombreRevisor(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1.5">
                Tu cargo{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </p>
              <Input
                placeholder="Ej: Jefa de RRHH"
                value={cargoRevisor}
                onChange={(e) => setCargoRevisor(e.target.value)}
              />
            </div>
          </div>

          {/* Star picker */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Puntuación
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setPuntuacion(star)}
                  className="p-0.5 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={cn(
                      "w-9 h-9 transition-colors",
                      activeStar >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200",
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1 h-4">
              {activeStar > 0 ? LABELS[activeStar] : ""}
            </p>
          </div>

          {/* Textarea */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Comentario{" "}
              <span className="text-gray-400 font-normal">
                (mín. 20 caracteres)
              </span>
            </p>
            <Textarea
              placeholder={`Describe tu experiencia con ${nombreCandidato}...`}
              value={razonRecomendacion}
              onChange={(e) => setRazonRecomendacion(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {razonRecomendacion.length} caracteres
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || puntuacion === 0}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar recomendación"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
