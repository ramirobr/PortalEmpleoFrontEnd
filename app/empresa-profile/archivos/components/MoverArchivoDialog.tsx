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
import { ArchivoEmpresa, CarpetaEmpresa } from "@/types/admin";
import { FolderOpen } from "lucide-react";

const ROOT = "__root__";

interface MoverArchivoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  archivo: ArchivoEmpresa | null;
  carpetas: CarpetaEmpresa[];
  onSubmit: (idCarpetaDestino: string | null) => Promise<void>;
  isSubmitting: boolean;
}

export default function MoverArchivoDialog({
  open,
  onOpenChange,
  archivo,
  carpetas,
  onSubmit,
  isSubmitting,
}: MoverArchivoDialogProps) {
  const [selectedCarpeta, setSelectedCarpeta] = useState<string>(ROOT);

  useEffect(() => {
    if (open && archivo) {
      setSelectedCarpeta(archivo.idCarpetaEmpresa ?? ROOT);
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
            Elige la carpeta de destino para{" "}
            <span className="font-medium">{archivo?.nombreArchivo}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label className="text-sm font-medium text-zinc-700 mb-2 block">
            Carpeta de Destino
          </label>
          <Select value={selectedCarpeta} onValueChange={setSelectedCarpeta}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ROOT}>
                <span className="flex items-center gap-2">
                  <FolderOpen className="size-4 text-zinc-400" />
                  Sin carpeta (raíz)
                </span>
              </SelectItem>
              {carpetas.map((c) => (
                <SelectItem key={c.idCarpetaEmpresa} value={c.idCarpetaEmpresa}>
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
            {isSubmitting ? "Moviendo..." : "Mover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
