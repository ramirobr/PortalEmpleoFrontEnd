"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArchivoUsuario, CarpetaUsuario } from "@/types/admin";
import { FolderOpen } from "lucide-react";

const ROOT = "__root__";

interface MoverArchivoCandidatoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  archivo: ArchivoUsuario | null;
  carpetas: CarpetaUsuario[];
  onSubmit: (idCarpetaDestino: string | null) => Promise<void>;
  isSubmitting: boolean;
}

export default function MoverArchivoCandidatoDialog({
  open,
  onOpenChange,
  archivo,
  carpetas,
  onSubmit,
  isSubmitting,
}: MoverArchivoCandidatoDialogProps) {
  const [selectedCarpeta, setSelectedCarpeta] = useState<string>(ROOT);

  useEffect(() => {
    if (open && archivo) {
      setSelectedCarpeta(archivo.idCarpetaUsuario ?? ROOT);
    }
  }, [open, archivo]);

  const handleSubmit = async () => {
    await onSubmit(selectedCarpeta === ROOT ? null : selectedCarpeta);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Mover Archivo</DialogTitle>
          <DialogDescription>
            Selecciona la carpeta destino para{" "}
            <span className="font-medium">{archivo?.nombreArchivo}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <span className="text-sm font-medium text-slate-700 mb-2 block">
            Carpeta Destino
          </span>
          <Select value={selectedCarpeta} onValueChange={setSelectedCarpeta}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ROOT}>
                <span className="flex items-center gap-2">
                  <FolderOpen className="size-4 text-slate-400" />
                  Raíz (sin carpeta)
                </span>
              </SelectItem>
              {carpetas.map((c) => (
                <SelectItem key={c.idCarpetaUsuario} value={c.idCarpetaUsuario}>
                  <span className="flex items-center gap-2">
                    <FolderOpen className="size-4 text-yellow-500" />
                    {c.nombreCarpeta}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Moviendo..." : "Mover Archivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
