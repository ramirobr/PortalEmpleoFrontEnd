"use client";
import Badge from "@/components/shared/components/Badge";
import { Plus } from "@/components/shared/components/iconos/Plus";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
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
import { useAuthStore } from "@/context/authStore";
import { fetchApi } from "@/lib/apiClient";
import {
  DatosPersonalesFieldsResponse,
  Habilidades,
  HabilidadesResponse,
  PlainStringDataMessage,
} from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const habilidadSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  aniosExperiencia: z
    .number()
    .min(0, "Debe ser mayor a 0")
    .max(60, "Maximo alcanzado"),
  idCategoria: z.number().min(1, "Selecciona una categoria"),
  idNivel: z.number().min(1, "Selecciona un nivel"),
});

export type HabilidadValues = z.infer<typeof habilidadSchema>;

type EditarHabilidadesProps = {
  habilidades: Habilidades[];
  fields: DatosPersonalesFieldsResponse | null;
};

export default function EditarHabilidades({
  habilidades: initialHabilidades,
  fields,
}: EditarHabilidadesProps) {
  const [habilidades, setHabilidades] =
    useState<Habilidades[]>(initialHabilidades);
  const [editModal, setEditModal] = useState<Habilidades | null>(null);
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
      "/Habilidades/eliminar/" + pendingDeleteId,
      {
        method: "DELETE",
        token: session?.user.accessToken,
      }
    );
    if (!res?.isSuccess) {
      toast.error("Error eliminando habilidad");
      return;
    }
    setHabilidades((prev) => prev.filter((h) => h.id !== pendingDeleteId));
    setPendingDeleteId(null);
    toast.success(res.data);
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const handleAddSave = async (values: HabilidadValues) => {
    const body = {
      idCategoriaHabilidad: values.idCategoria,
      idNivelExperiencia: values.idNivel,
      aniosExperiencia: values.aniosExperiencia, //FIXME Not being saved
      nombre: values.nombre,
      idCurriculum,
      orden: 0,
    };

    const res = await fetchApi<HabilidadesResponse>("/Habilidades/agregar", {
      method: "POST",
      token: session?.user.accessToken,
      body,
    });

    if (!res?.isSuccess) {
      toast.error("Error agregando habilidad");
      return;
    }

    const habilidad: Habilidades = {
      id: res.data.idHabilidad,
      nombre: res.data.nombre,
      idNivel: res.data.idNivelExperiencia,
      nivel: "",
      idCategoria: res.data.idCategoriaHabilidad,
      categoria: "",
    };
    setHabilidades([habilidad, ...habilidades]);
    handleAddModalClose();
    toast.success("Habilidad agregada");
  };

  const handleEditClick = (id: string) => {
    const habilidad = habilidades.find((habilidad) => habilidad.id === id);
    if (!habilidad) return;
    setEditModal(habilidad);
  };

  const handleCancelEdit = () => {
    setEditModal(null);
  };

  const handleEditSave = async (values: HabilidadValues) => {
    if (!editModal) return;
    const body = {
      idHabilidad: editModal.id,
      idCategoriaHabilidad: values.idCategoria,
      idNivelExperiencia: values.idNivel,
      aniosExperiencia: values.aniosExperiencia, //FIXME Not being saved
      nombre: values.nombre,
      idCurriculum,
      orden: 0,
    };

    const res = await fetchApi<PlainStringDataMessage>(
      "/Habilidades/actualizar",
      {
        method: "PUT",
        token: session?.user.accessToken,
        body,
      }
    );

    if (!res?.isSuccess) {
      toast.error("Error agregando habilidad");
      return;
    }

    const habilidad: Habilidades = {
      id: body.idHabilidad,
      nombre: body.nombre,
      idNivel: body.idNivelExperiencia,
      nivel: "",
      idCategoria: body.idCategoriaHabilidad,
      categoria: "",
    };
    setHabilidades((prev) =>
      prev.map((item) => (item.id === habilidad.id ? habilidad : item))
    );
    handleCancelEdit();
    toast.success("Habilidad editada");
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  return (
    <Card className="px-6">
      <div className="flex justify-between items-center">
        <TituloSubrayado className="mb-0">Habilidades</TituloSubrayado>
        <button
          id="agregar"
          className="cursor-pointer flex items-center gap-2 text-primary font-semibold"
          aria-label="Agregar nueva habilidad"
          type="button"
          onClick={handleAddClick}
        >
          <Plus width={25} height={25} className="text-primary" />
          Añadir item
        </button>
      </div>
      <hr className="border-none h-px bg-[#ebebed] mt-4 mb-3 mx-0" />
      <div className="mb-8 flex flex-wrap gap-3">
        {habilidades?.length ? (
          habilidades.map((item) => (
            <Badge
              key={item.id}
              variant="custom"
              fontSize="text-sm md:text-md"
              bgColor="bg-green-100"
              textColor="text-green-700"
              removable
              onEdit={() => handleEditClick(item.id)}
              onRemove={() => requestDelete(item.id)}
            >
              {item.nombre}
            </Badge>
          ))
        ) : (
          <h4 className="text-base font-semibold">No hay habilidades</h4>
        )}
      </div>

      {/* Modal for adding new item (Radix UI Dialog) */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-primary mb-2.5">
              Añadir Habilidad
            </DialogTitle>
          </DialogHeader>
          <AddHabilidadForm
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
              Editar Habilidad
            </DialogTitle>
          </DialogHeader>
          <EditHabilidadForm
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
              ¿Está seguro de que desea eliminar esta habilidad?
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

// Form component for adding new habilidad
type AddHabilidadFormProps = {
  onSave: (values: HabilidadValues) => void;
  onCancel: () => void;
} & Omit<EditarHabilidadesProps, "habilidades">;

const AddHabilidadForm: React.FC<AddHabilidadFormProps> = ({
  onSave,
  onCancel,
  fields,
}) => {
  const form = useForm<HabilidadValues>({
    resolver: zodResolver(habilidadSchema),
    defaultValues: {
      nombre: "",
      idCategoria: undefined,
      idNivel: undefined,
      aniosExperiencia: 0,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-4"
        aria-label="Añadir habilidad"
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="add-nombre">Nombre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="add-nombre"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aniosExperiencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="add-nombre">Años de experiencia</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v === "" ? undefined : Number(v));
                  }}
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
              <FormLabel>Tipo de experiencia *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.experiencia?.map((exp) => (
                      <SelectItem
                        key={exp.idCatalogo}
                        value={exp.idCatalogo.toString()}
                      >
                        {exp.nombre}
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
          name="idCategoria"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Categoría *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.categoria_habilidad?.map((cat) => (
                      <SelectItem
                        key={cat.idCatalogo}
                        value={cat.idCatalogo.toString()}
                      >
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

// Form component for editing habilidad
type EditHabilidadFormProps = {
  initialValues: Habilidades | null;
  onSave: (values: HabilidadValues) => void;
  onCancel: () => void;
  fields: DatosPersonalesFieldsResponse | null;
};

const EditHabilidadForm: React.FC<EditHabilidadFormProps> = ({
  initialValues,
  onSave,
  onCancel,
  fields,
}) => {
  const form = useForm<HabilidadValues>({
    resolver: zodResolver(habilidadSchema),
    defaultValues: {
      nombre: initialValues?.nombre || "",
      idCategoria: initialValues?.idCategoria || 0,
      idNivel: initialValues?.idNivel || 0,
      aniosExperiencia: 0,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-4"
        aria-label="Editar habilidad"
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="add-nombre">Nombre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="add-nombre"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aniosExperiencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="add-nombre">Años de experiencia</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v === "" ? undefined : Number(v));
                  }}
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
              <FormLabel>Tipo de experiencia *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.experiencia?.map((exp) => (
                      <SelectItem
                        key={exp.idCatalogo}
                        value={exp.idCatalogo.toString()}
                      >
                        {exp.nombre}
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
          name="idCategoria"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Categoría *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.categoria_habilidad?.map((cat) => (
                      <SelectItem
                        key={cat.idCatalogo}
                        value={cat.idCatalogo.toString()}
                      >
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
