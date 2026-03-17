"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building2, Camera, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { fetchApi } from "@/lib/apiClient";
import { getCompanyLogo } from "@/lib/company/profile";
import { toast } from "sonner";
import { fileToBase64 } from "@/lib/utils";
import { useAuthStore } from "@/context/authStore";

interface LogoUploadDialogProps {
  companyId: string;
  companyName: string;
  accessToken?: string;
  onSuccess?: () => void;
}

export function LogoUploadDialog({
  companyId,
  companyName,
  accessToken,
  onSuccess,
}: LogoUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const companyLogo = useAuthStore((s) => s.companyLogo);
  const setCompanyLogo = useAuthStore((s) => s.setCompanyLogo);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Solo se permiten archivos de imagen");
        return;
      }
      setSelectedLogoFile(file);
      const preview = URL.createObjectURL(file);
      setCompanyLogo(preview);
    }
  };

  const handleSaveLogo = async () => {
    if (!selectedLogoFile) return;

    setIsSaving(true);
    try {
      const base64Full = await fileToBase64(selectedLogoFile);
      const base64Image = base64Full.includes(",")
        ? base64Full.split(",")[1]
        : base64Full;

      const response = await fetchApi(`/Company/update-logo`, {
        method: "PUT",
        body: {
          idEmpresa: companyId,
          base64Image: base64Image,
        },
        token: accessToken,
      });

      if (response) {
        const logoData = await getCompanyLogo(companyId, accessToken);
        setCompanyLogo(logoData);
        setOpen(false);
        setSelectedLogoFile(null);
        toast.success("Logo actualizado correctamente");
        onSuccess?.();
      }
    } catch {
      toast.error("Error al actualizar el logo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLogo = async () => {
    setIsSaving(true);
    try {
      const response = await fetchApi(`/Company/delete-logo/${companyId}`, {
        method: "DELETE",
        token: accessToken,
      });

      if (response) {
        setCompanyLogo();
        setSelectedLogoFile(null);
        setOpen(false);
        toast.success("Logo eliminado correctamente");
        onSuccess?.();
      }
    } catch {
      toast.error("Error al eliminar el logo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    setOpen(false);
    setSelectedLogoFile(null);
    if (companyId && accessToken) {
      try {
        const logoData = await getCompanyLogo(companyId, accessToken);
        setCompanyLogo(logoData);
      } catch {
        setCompanyLogo();
      }
    } else {
      setCompanyLogo();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative group cursor-pointer" title="Cambiar logo">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={`Logo de ${companyName}`}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Logo de Empresa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-4">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Vista previa del logo"
                className="w-32 h-32 rounded-lg object-cover border"
              />
            ) : (
              <div className="w-32 h-32 rounded-lg bg-primary/10 flex items-center justify-center border">
                <Building2 className="w-16 h-16 text-primary" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4 mr-2" />
                Seleccionar imagen
              </Button>
              {companyLogo && (
                <Button
                  size="icon"
                  onClick={handleDeleteLogo}
                  disabled={isSaving}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 text-center">
              Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveLogo}
              disabled={isSaving || !selectedLogoFile}
            >
              {isSaving && (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-2" />
              )}
              {isSaving ? "Guardando" : "Guardar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
