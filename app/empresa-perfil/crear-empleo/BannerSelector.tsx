"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArchivoEmpresa } from "@/types/admin";
import {
  getArchivosEmpresa,
  getArchivoDetalleEmpresa,
} from "@/lib/admin/adminArchivos";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { X } from "lucide-react";

interface BannerSelectorProps {
  idEmpresa: string;
  selectedArchivos?: string;
  onSelectArchivo?: (idArchivo: string | null, base64Data?: string) => void;
}

export default function BannerSelector({
  idEmpresa,
  selectedArchivos,
  onSelectArchivo,
}: BannerSelectorProps) {
  const { data: session } = useSession();
  const [archivos, setArchivos] = useState<ArchivoEmpresa[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedArchivos || null
  );
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch archivos de la empresa
  useEffect(() => {
    const fetchArchivos = async () => {
      if (!idEmpresa || !session?.user?.accessToken) return;
      setLoading(true);
      const response = await getArchivosEmpresa(
        idEmpresa,
        null,
        session.user.accessToken
      );
      if (response?.isSuccess && response.data) {
        // Filtrar solo imágenes (banners)
        const imagenes = response.data.filter(
          (a) =>
            a.contentType?.startsWith("image/") ||
            a.extension?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        );
        setArchivos(imagenes);
      }
      setLoading(false);
    };

    fetchArchivos();
  }, [idEmpresa, session]);

  // Cuando se selecciona un archivo, obtener el base64
  const handleSelectArchivo = async (idArchivo: string) => {
    if (!session?.user?.accessToken) return;

    setSelectedId(idArchivo);

    const response = await getArchivoDetalleEmpresa(
      idArchivo,
      session.user.accessToken
    );
    if (response?.isSuccess && response.data) {
      const base64 = response.data.archivo;
      setSelectedBanner(base64);
      onSelectArchivo?.(idArchivo, base64);
    }
  };

  const handleClear = () => {
    setSelectedId(null);
    setSelectedBanner(null);
    onSelectArchivo?.(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="bannerSelect" className="block text-sm font-semibold text-slate-700 mb-1">
          Banner del Empleo
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Selecciona una imagen de los archivos de tu empresa para mostrar como
          banner en el detalle del empleo.
        </p>

        <Select value={selectedId || ""} onValueChange={handleSelectArchivo}>
          <SelectTrigger id="bannerSelect" className="bg-zinc-50 border-zinc-200">
            <SelectValue placeholder="Seleccionar imagen..." />
          </SelectTrigger>
          <SelectContent>
            {archivos.length === 0 ? (
              <div className="p-2 text-sm text-slate-500">
                {loading ? "Cargando…" : "No hay imágenes disponibles"}
              </div>
            ) : (
              archivos.map((archivo) => (
                <SelectItem
                  key={archivo.idArchivoEmpresa}
                  value={archivo.idArchivoEmpresa}
                >
                  {archivo.nombreArchivo}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Preview del banner seleccionado */}
      {selectedBanner && (
        <Card className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">
              Vista previa del banner
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="p-1 h-auto hover:bg-red-50"
            >
              <X className="size-4 text-red-600" />
            </Button>
          </div>
          <div className="relative w-full h-40 bg-zinc-100 rounded-lg overflow-hidden">
            <Image
              src={
                selectedBanner.startsWith("data:")
                  ? selectedBanner
                  : `data:image/png;base64,${selectedBanner}`
              }
              alt="Banner preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          </div>
        </Card>
      )}
    </div>
  );
}
