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
import { toast } from "sonner";

const schema = z.object({
  nombreArchivo: z.string().min(1, "El nombre es requerido").max(300),
  idTipoArchivo: z.coerce.number().int().min(1, "Selecciona un tipo"),
  idCarpetaUsuario: z.string().optional(),
  archivoBase64: z.string().min(1, "Selecciona un archivo"),
  extension: z.string().optional(),
  contentType: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const NO_FOLDER = "__root__";

function requiresPdf(tipo: TipoArchivo | undefined): boolean {
  if (!tipo) return false;
  return (
    tipo.descripcion?.includes("PDF") ||
    tipo.descripcion?.includes("pdf") ||
    tipo.nombre?.toLowerCase().includes("certificado") ||
    tipo.nombre?.toLowerCase().includes("antecedentes") ||
    tipo.nombre?.toLowerCase().includes("diploma")
  ) ?? false;
}

interface ArchivoUploadDialogProps {
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

export default function ArchivoUploadDialog({
  open,
  onOpenChange,
  carpetas,
  tiposArchivo,
  defaultCarpetaId,
  onSubmit,
  isSubmitting,
}: ArchivoUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      nombreArchivo: "",
      idTipoArchivo: 0,
      idCarpetaUsuario: defaultCarpetaId ?? undefined,
      archivoBase64: "",
      extension: "",
      contentType: "",
    },
  });

  const watchedIdTipoArchivo = form.watch("idTipoArchivo");
  const selectedFileName = form.watch("nombreArchivo");
  const selectedTipo = tiposArchivo.find((t) => t.idTipoArchivo === watchedIdTipoArchivo);
  const isPdfOnly = requiresPdf(selectedTipo);

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

    if (isPdfOnly && file.type !== "application/pdf") {
      toast.error("Este tipo de documento solo acepta archivos PDF.");
      e.target.value = "";
      return;
    }

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

  const handleSubmit = async (data: FormValues) => {
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
            Selecciona el archivo que deseas guardar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-5 py-2">
              <FormField
                control={form.control}
                name="idTipoArchivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Archivo</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(val) => {
                        field.onChange(Number(val));
                        form.setValue("archivoBase64", "");
                        form.setValue("nombreArchivo", "");
                        form.setValue("extension", "");
                        form.setValue("contentType", "");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposArchivo.map((t) => (
                          <SelectItem key={t.idTipoArchivo} value={String(t.idTipoArchivo)}>
                            {t.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        {selectedFileName ? (
                          <p className="text-sm font-medium text-slate-700">
                            {selectedFileName}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-500">
                            Haz clic para seleccionar{isPdfOnly ? " un archivo PDF" : " un archivo"}
                          </p>
                        )}
                        {isPdfOnly && (
                          <p className="text-xs text-amber-600 mt-1">
                            Solo se aceptan archivos en formato PDF
                          </p>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          aria-label="Seleccionar archivo"
                          className="hidden"
                          accept={isPdfOnly ? ".pdf,application/pdf" : undefined}
                          onChange={handleFileChange}
                        />
                      </button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              {carpetas.length > 0 && (
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
                            <SelectValue placeholder="Sin carpeta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={NO_FOLDER}>
                            Sin carpeta (raíz)
                          </SelectItem>
                          {carpetas.map((c) => (
                            <SelectItem key={c.idCarpetaUsuario} value={c.idCarpetaUsuario}>
                              {c.nombreCarpeta}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
