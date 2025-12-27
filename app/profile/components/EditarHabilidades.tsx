"use client";
import Badge from "@/components/shared/components/Badge";
import { Plus } from "@/components/shared/components/iconos/Plus";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
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
import { Habilidades } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const habilidadSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
});

type Habilidad = Pick<Habilidades, "nombre">;
type EditarHabilidadesProps = {
  habilidades: Habilidades[];
};

export default function EditarHabilidades({
  habilidades: initialHabilidades,
}: EditarHabilidadesProps) {
  const [habilidades, setHabilidades] =
    useState<Habilidades[]>(initialHabilidades);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Habilidad>({
    nombre: "",
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Open add modal
  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (idx: number) => {
    setDeleteIndex(idx);
    setDeleteModalOpen(true);
  };

  // Save changes from edit modal form
  const handleEditSave = (values: Habilidad) => {
    if (editIndex !== null) {
      const updated = [...habilidades];
      //TODO: Integration
      // updated[editIndex] = { ...values };
      setHabilidades(updated);
      setModalOpen(false);
      setEditIndex(null);
    }
  };

  // Save new item from add modal form (add to front)
  const handleAddSave = (values: Habilidad) => {
    //TODO: Integration
    // setHabilidades([{ ...values }, ...habilidades]);
    setAddModalOpen(false);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      const updated = [...habilidades];
      updated.splice(deleteIndex, 1);
      setHabilidades(updated);
      setDeleteModalOpen(false);
      setDeleteIndex(null);
    }
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  // Close edit modal
  const handleModalClose = () => {
    setModalOpen(false);
    setEditIndex(null);
  };

  // Close add modal
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

      <div className="mb-8 flex flex-wrap gap-3">
        {habilidades.map((item, idx) => (
          <Badge
            key={idx}
            variant="custom"
            fontSize="text-sm md:text-md"
            bgColor="bg-green-100"
            textColor="text-green-700"
            removable
            onRemove={() => handleDeleteClick(idx)}
          >
            {item.nombre}
          </Badge>
        ))}
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
          />
        </DialogContent>
      </Dialog>

      {/* Modal for editing (Radix UI Dialog) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-primary mb-2.5">
              Editar Habilidad
            </DialogTitle>
          </DialogHeader>
          <EditHabilidadForm
            initialValues={editForm}
            onSave={handleEditSave}
            onCancel={handleModalClose}
          />
        </DialogContent>
      </Dialog>

      {/* Modal for delete confirmation (Radix UI Dialog) */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="p-8 max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>
              ¿Está seguro de que desea eliminar esta habilidad?
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDeleteCancel}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDeleteConfirm}
            >
              Aceptar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Form component for adding new habilidad
interface AddHabilidadFormProps {
  onSave: (values: Habilidad) => void;
  onCancel: () => void;
}

const AddHabilidadForm: React.FC<AddHabilidadFormProps> = ({
  onSave,
  onCancel,
}) => {
  const form = useForm<Habilidad>({
    resolver: zodResolver(habilidadSchema),
    defaultValues: {
      nombre: "",
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
                <input
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
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
          >
            Guardar
          </button>
        </div>
      </form>
    </Form>
  );
};

// Form component for editing habilidad
interface EditHabilidadFormProps {
  initialValues: Habilidad;
  onSave: (values: Habilidad) => void;
  onCancel: () => void;
}

const EditHabilidadForm: React.FC<EditHabilidadFormProps> = ({
  initialValues,
  onSave,
  onCancel,
}) => {
  const form = useForm<Habilidad>({
    resolver: zodResolver(habilidadSchema),
    defaultValues: initialValues,
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
              <FormLabel htmlFor="edit-nombre">Nombre</FormLabel>
              <FormControl>
                <input
                  {...field}
                  id="edit-nombre"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
          >
            Guardar
          </button>
        </div>
      </form>
    </Form>
  );
};
