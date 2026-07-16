"use client";

import { useEffect, useRef } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CarpetaUsuario, TipoArchivo } from "@/types/admin";
import { Upload } from "lucide-react";

const uploadSchema = z.object({
  nombreArchivo: z
    .string()
    .min(1, "El nombre es requerido")
    .max(300, "Máximo 300 caracteres"),
  idTipoArchivo: z.coerce
    .number()
    .int()
    .min(1, "Selecciona un tipo de archivo"),
  idCarpetaUsuario: z.string().optional(),
  archivoBase64: z.string().min(1, "Selecciona un archivo"),
  extension: z.string().optional(),
  contentType: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

const NO_FOLDER = "__root__";

interface ArchivoUploadCandidatoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carpetas: CarpetaUsuario[];
  tiposArchivo: TipoArchivo[];
  defaultCarpetaId?: string | null;
  onSubmit: (data: {
    idTipoArchivo: number;
    nombreArchivo: string;
    extension?: string;
    contentType?: string;
    idCarpetaUsuario?: string;
    archivoBase64: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function ArchivoUploadCandidatoDialog({
  open,
  onOpenChange,
  carpetas,
  tiposArchivo,
  defaultCarpetaId,
  onSubmit,
  isSubmitting,
}: ArchivoUploadCandidatoDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema) as Resolver<UploadFormValues>,
    defaultValues: {
      nombreArchivo: "",
      idTipoArchivo: 0,
      idCarpetaUsuario: defaultCarpetaId ?? undefined,
      archivoBase64: "",
      extension: "",
      contentType: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        nombreArchivo: "",
        idTipoArchivo: 0,
        idCarpetaUsuario: defaultCarpetaId ?? undefined,
        archivoBase64: "",
        extension: "",
        contentType: "",
      });
    }
  }, [open, defaultCarpetaId, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.includes(".")
      ? "." + file.name.split(".").pop()!.toLowerCase()
      : "";

    form.setValue("nombreArchivo", file.name);
    form.setValue("extension", ext);
    form.setValue("contentType", file.type || "application/octet-stream");

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1] ?? "";
      form.setValue("archivoBase64", base64);
      form.trigger("archivoBase64");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (data: UploadFormValues) => {
    await onSubmit({
      idTipoArchivo: data.idTipoArchivo,
      nombreArchivo: data.nombreArchivo,
      extension: data.extension || undefined,
      contentType: data.contentType || undefined,
      idCarpetaUsuario:
        !data.idCarpetaUsuario || data.idCarpetaUsuario === NO_FOLDER
          ? undefined
          : data.idCarpetaUsuario,
      archivoBase64: data.archivoBase64,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subir Archivo</DialogTitle>
          <DialogDescription>
            Selecciona un archivo y configura sus propiedades.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-5 py-2">
              {/* Archivo */}
              <FormField
                control={form.control}
                name="archivoBase64"
                render={() => (
                  <FormItem>
                    <FormLabel>Archivo</FormLabel>
                    <FormControl>
                      <button
                        type="button"
                        className="w-full border-2 border-dashed border-zinc-200 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="size-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">
                          Haz clic para seleccionar un archivo
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          aria-label="Seleccionar archivo"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nombre */}
              <FormField
                control={form.control}
                name="nombreArchivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Archivo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del archivo..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Archivo */}
              <FormField
                control={form.control}
                name="idTipoArchivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Archivo</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposArchivo.map((t) => (
                          <SelectItem
                            key={t.idTipoArchivo}
                            value={String(t.idTipoArchivo)}
                          >
                            {t.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Carpeta */}
              <FormField
                control={form.control}
                name="idCarpetaUsuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Carpeta{" "}
                      <span className="text-slate-400 font-normal">(opcional)</span>
                    </FormLabel>
                    <Select
                      value={field.value ?? NO_FOLDER}
                      onValueChange={(val) =>
                        field.onChange(val === NO_FOLDER ? undefined : val)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Raíz (sin carpeta)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NO_FOLDER}>
                          Raíz (sin carpeta)
                        </SelectItem>
                        {carpetas.map((c) => (
                          <SelectItem
                            key={c.idCarpetaUsuario}
                            value={c.idCarpetaUsuario}
                          >
                            {c.nombreCarpeta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Subiendo…" : "Subir Archivo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
