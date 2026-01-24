"use client";
import { Pencil, Trash2, Plus, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/context/authStore";
import { fetchApi } from "@/lib/apiClient";
import {
  DatosPersonalesFieldsResponse,
  Idioma,
  IdiomaResponse,
  PlainStringDataMessage,
} from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const idiomaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  idNivel: z.number().min(1, "Selecciona un nivel"),
  certificado: z.boolean(),
  certificacion: z.string().optional(),
});

export type IdiomaValues = z.infer<typeof idiomaSchema>;

type EditarIdiomasProps = {
  idiomas: Idioma[];
  fields: DatosPersonalesFieldsResponse | null;
};

export default function EditarIdiomas({
  idiomas: initialIdiomas,
  fields,
}: EditarIdiomasProps) {
  const [idiomas, setIdiomas] = useState<Idioma[]>(initialIdiomas);
  const [editModal, setEditModal] = useState<Idioma | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const idCurriculum = useAuthStore((s) => s.idCurriculum);
  const { data: session } = useSession();

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const res = await fetchApi<PlainStringDataMessage>(
      "/Idiomas/eliminar/" + pendingDeleteId,
      {
        method: "DELETE",
        token: session?.user.accessToken,
      }
    );
    if (!res?.isSuccess) {
      toast.error("Error eliminando idioma");
      return;
    }
    setIdiomas((prev) => prev.filter((i) => i.id !== pendingDeleteId));
    setPendingDeleteId(null);
    toast.success(res.data);
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const handleAddSave = async (values: IdiomaValues) => {
    const body = {
      idCurriculum,
      nombre: values.nombre,
      idNivelIdioma: values.idNivel,
      certificado: values.certificado,
      certificacion: values.certificacion || "",
    };

    const res = await fetchApi<IdiomaResponse>("/Idiomas/agregar", {
      method: "POST",
      token: session?.user.accessToken,
      body,
    });

    if (!res?.isSuccess) {
      toast.error("Error agregando idioma");
      return;
    }

    const idioma: Idioma = {
      id: res.data.idIdioma,
      nombre: res.data.nombre,
      idNivel: res.data.idNivelIdioma,
      nivel: "",
      certificado: values.certificado,
      certificacion: values.certificacion || "",
    };
    setIdiomas([idioma, ...idiomas]);
    handleAddModalClose();
    toast.success("Idioma agregado");
  };

  const handleEditClick = (id: string) => {
    const idioma = idiomas.find((idioma) => idioma.id === id);
    if (!idioma) return;
    setEditModal(idioma);
  };

  const handleCancelEdit = () => {
    setEditModal(null);
  };

  const handleEditSave = async (values: IdiomaValues) => {
    if (!editModal) return;
    const body = {
      idIdioma: editModal.id,
      idCurriculum,
      nombre: values.nombre,
      idNivelIdioma: values.idNivel,
      certificado: values.certificado,
      certificacion: values.certificacion || "",
    };

    const res = await fetchApi<PlainStringDataMessage>("/Idiomas/actualizar", {
      method: "PUT",
      token: session?.user.accessToken,
      body,
    });

    if (!res?.isSuccess) {
      toast.error("Error editando idioma");
      return;
    }

    const idioma: Idioma = {
      id: body.idIdioma,
      nombre: body.nombre,
      idNivel: body.idNivelIdioma,
      nivel: "",
      certificado: values.certificado,
      certificacion: values.certificacion || "",
    };
    setIdiomas((prev) =>
      prev.map((item) => (item.id === idioma.id ? idioma : item))
    );
    handleCancelEdit();
    toast.success("Idioma editado");
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  return (
    <Card className="px-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Languages width={25} height={25} className="text-primary" />
          Idiomas
        </h2>
        <button
          id="agregar-idioma"
          className="cursor-pointer flex items-center gap-2 text-primary font-bold align-center btn bg-primary/10"
          aria-label="Agregar nuevo idioma"
          type="button"
          onClick={handleAddClick}
        >
          <Plus width={20} height={20} className="text-primary" />
          Agregar
        </button>
      </div>

      <div className="mb-8">
        {idiomas?.length ? (
          idiomas.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border border-dashed border-[#dce5e5] flex justify-between my-4 items-center"
            >
              <div>
                <h4 className="font-bold text-xl">{item.nombre}</h4>
                <div className="flex items-center gap-3">
                  <p>{item.nivel || "Sin nivel especificado"}</p>
                  {item.certificado && item.certificacion && (
                    <>
                      <p className="font-bold text-black">•</p>
                      <p>{item.certificacion}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  id="editar-idioma"
                  className="cursor-pointer"
                  aria-label={`Editar idioma: ${item.nombre}`}
                  type="button"
                  onClick={() => handleEditClick(item.id)}
                >
                  <Pencil width={20} height={20} className="text-gray-500" />
                </button>
                <button
                  id="borrar-idioma"
                  className="cursor-pointer"
                  aria-label={`Borrar idioma: ${item.nombre}`}
                  type="button"
                  onClick={() => requestDelete(item.id)}
                >
                  <Trash2 width={20} height={20} className="text-gray-500" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <h4 className="text-base font-semibold">No hay idiomas</h4>
        )}
      </div>

      {/* Modal for adding new item (Radix UI Dialog) */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-primary mb-2.5">
              Añadir Idioma
            </DialogTitle>
          </DialogHeader>
          <AddIdiomaForm
            onSave={handleAddSave}
            onCancel={handleAddModalClose}
            fields={fields}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editModal} onOpenChange={handleCancelEdit}>
        <DialogContent className="p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-primary mb-2.5">
              Editar Idioma
            </DialogTitle>
          </DialogHeader>
          <EditIdiomaForm
            initialValues={editModal}
            onSave={handleEditSave}
            onCancel={handleCancelEdit}
            fields={fields}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingDeleteId} onOpenChange={cancelDelete}>
        <DialogContent className="p-8 max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>
              ¿Está seguro de que desea eliminar este idioma?
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button type="button" variant="secondary" onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button onClick={confirmDelete}>Aceptar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Form component for adding new idioma
type AddIdiomaFormProps = {
  onSave: (values: IdiomaValues) => void;
  onCancel: () => void;
} & Omit<EditarIdiomasProps, "idiomas">;

const AddIdiomaForm: React.FC<AddIdiomaFormProps> = ({
  onSave,
  onCancel,
  fields,
}) => {
  const form = useForm<IdiomaValues>({
    resolver: zodResolver(idiomaSchema),
    defaultValues: {
      nombre: "",
      idNivel: undefined,
      certificado: false,
      certificacion: "",
    },
  });

  const tieneCertificado = form.watch("certificado");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-4"
        aria-label="Añadir idioma"
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="add-nombre-idioma">Nombre del idioma</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="add-nombre-idioma"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ej: Inglés, Francés, Portugués..."
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idNivel"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nivel *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.nivel_idioma?.map((nivel) => (
                      <SelectItem
                        key={nivel.idCatalogo}
                        value={nivel.idCatalogo.toString()}
                      >
                        {nivel.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="certificado"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Tiene certificado</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {tieneCertificado && (
          <FormField
            control={form.control}
            name="certificacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="add-certificacion">Título del certificado</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="add-certificacion"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Ej: TOEFL, IELTS, DELF..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
            )}
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Form component for editing idioma
type EditIdiomaFormProps = {
  initialValues: Idioma | null;
  onSave: (values: IdiomaValues) => void;
  onCancel: () => void;
  fields: DatosPersonalesFieldsResponse | null;
};

const EditIdiomaForm: React.FC<EditIdiomaFormProps> = ({
  initialValues,
  onSave,
  onCancel,
  fields,
}) => {
  const form = useForm<IdiomaValues>({
    resolver: zodResolver(idiomaSchema),
    defaultValues: {
      nombre: initialValues?.nombre || "",
      idNivel: initialValues?.idNivel || 0,
      certificado: initialValues?.certificado || false,
      certificacion: initialValues?.certificacion || "",
    },
  });

  const tieneCertificado = form.watch("certificado");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-4"
        aria-label="Editar idioma"
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="edit-nombre-idioma">Nombre del idioma</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="edit-nombre-idioma"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ej: Inglés, Francés, Portugués..."
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idNivel"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nivel *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.nivel_idioma?.map((nivel) => (
                      <SelectItem
                        key={nivel.idCatalogo}
                        value={nivel.idCatalogo.toString()}
                      >
                        {nivel.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="certificado"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Tiene certificado</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {tieneCertificado && (
          <FormField
            control={form.control}
            name="certificacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="edit-certificacion">Título del certificado</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="edit-certificacion"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Ej: TOEFL, IELTS, DELF..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
            )}
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};
