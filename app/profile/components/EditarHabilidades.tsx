"use client";
import React, { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Trash } from "@/components/shared/components/iconos/Trash";
import { Pencil } from "@/components/shared/components/iconos/Pencil";
import { Plus } from "@/components/shared/components/iconos/Plus";
import Loader from "@/components/shared/components/Loader";
import Badge from "@/components/shared/components/Badge";
import { fetchHabilidades, Habilidad } from "@/lib/catalog/fetchHabilidades";

const habilidadSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  nivel: z.string().min(1, "El nivel es obligatorio."),
});

const EditarHabilidades: React.FC = () => {
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetchHabilidades()
      .then(setHabilidades)
      .finally(() => setLoading(false));
  }, []);

  // Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Habilidad>({
    nombre: "",
    nivel: "",
  });

  // Add modal state
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Open edit modal and set form data
  const handleEditClick = (idx: number) => {
    setEditIndex(idx);
    setEditForm({ ...habilidades[idx] });
    setModalOpen(true);
  };

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
      updated[editIndex] = { ...values };
      setHabilidades(updated);
      setModalOpen(false);
      setEditIndex(null);
    }
  };

  // Save new item from add modal form (add to front)
  const handleAddSave = (values: Habilidad) => {
    setHabilidades([{ ...values }, ...habilidades]);
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

  if (loading) {
    return <Loader className="py-8" />;
  }

  return (
    <section className="bg-white rounded-lg shadow p-8 mt-10">
      <TituloSubrayado>Habilidades</TituloSubrayado>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold mb-4">Competencias y habilidades</h3>
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
    </section>
  );
};

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
      nivel: "",
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

export default EditarHabilidades;
