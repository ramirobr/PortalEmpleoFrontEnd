"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import EditarEducacionItem, {
  EditarEducacionItemValues,
} from "./EditarEducacionItem";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash } from "@/components/shared/components/iconos/Trash";
import { Pencil } from "@/components/shared/components/iconos/Pencil";
import { Plus } from "@/components/shared/components/iconos/Plus";

const schema = z.object({
  celular: z
    .string()
    .min(10, "El celular debe tener al menos 10 dígitos.")
    .max(14, "El celular no debe exceder 14 caracteres.")
    .default("+593 087379078"),
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos.")
    .max(14, "El teléfono no debe exceder 14 caracteres.")
    .default("+593 2375293"),
  email: z
    .string()
    .email("El email no es válido.")
    .min(1, "El email es obligatorio.")
    .default("janaya@gmail.com"),
  direccion: z.string().min(1, "La dirección es obligatoria.").default(""),
});
const defaultValues = {
  celular: "+593 087379078",
  telefono: "+593 2375293",
  email: "janaya@gmail.com",
  direccion: "",
};

const EditarEducacion: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Hardcoded education items
  const [educacionItems, setEducacionItems] = useState([
    {
      Titulo: "Ing. de Sistemas",
      Institucion: "Universidad Tecnica Particular de Loja",
      Nivel: "Universitario - En Curso",
      Fecha: "Oct 2001",
      Pais: "Ecuador",
    },
    {
      Titulo: "Lic. en Administración",
      Institucion: "Universidad Central del Ecuador",
      Nivel: "Universitario - Finalizado",
      Fecha: "Jul 1998",
      Pais: "Ecuador",
    },
    {
      Titulo: "Tecnólogo en Informática",
      Institucion: "Instituto Superior Tecnológico",
      Nivel: "Tecnológico - Finalizado",
      Fecha: "Dic 2005",
      Pais: "Ecuador",
    },
    {
      Titulo: "Bachiller Técnico",
      Institucion: "Colegio Técnico Nacional",
      Nivel: "Secundario - Finalizado",
      Fecha: "Mar 1995",
      Pais: "Ecuador",
    },
    {
      Titulo: "Diplomado en Gestión de Proyectos",
      Institucion: "Escuela Politécnica Nacional",
      Nivel: "Diplomado - Finalizado",
      Fecha: "Sep 2010",
      Pais: "Ecuador",
    },
  ]);

  // Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditarEducacionItemValues>({
    Titulo: "",
    Institucion: "",
    Nivel: "",
    Fecha: "",
    Pais: "",
  });

  // Add modal state
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Open edit modal and set form data
  const handleEditClick = (idx: number) => {
    setEditIndex(idx);
    setEditForm({ ...educacionItems[idx] });
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

  // Radix Dialog handles scroll lock automatically

  // Save changes from edit modal form
  const handleEditSave = (values: EditarEducacionItemValues) => {
    if (editIndex !== null) {
      const updated = [...educacionItems];
      updated[editIndex] = { ...values };
      setEducacionItems(updated);
      setModalOpen(false);
      setEditIndex(null);
    }
  };

  // Save new item from add modal form (add to front)
  const handleAddSave = (values: EditarEducacionItemValues) => {
    setEducacionItems([{ ...values }, ...educacionItems]);
    setAddModalOpen(false);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      const updated = [...educacionItems];
      updated.splice(deleteIndex, 1);
      setEducacionItems(updated);
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
    <section className="bg-white rounded-lg shadow p-8 mt-10">
      <TituloSubrayado>Educación</TituloSubrayado>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold mb-4">Formación académica</h3>
        <button
          id="agregar"
          className="cursor-pointer flex items-center gap-2 text-primary font-semibold"
          aria-label={`Agregar nuevo item educación`}
          type="button"
          onClick={handleAddClick}
        >
          <Plus width={25} height={25} className="text-primary" />
          Añadir item
        </button>
      </div>
      <hr className="border-none h-px bg-[#ebebed] mt-4 mb-3 mx-0" />
      <div className="mb-8">
        {educacionItems.map((item, idx) => (
          <div key={idx} className="my-4 ">
            <div className="flex w-full justify-between items-center">
              <h4 className="font-bold text-xl">{item.Titulo}</h4>
              <div className="flex items-center gap-3">
                <button
                  id="editar"
                  className="cursor-pointer"
                  aria-label={`Editar item educación: ${item.Titulo}`}
                  type="button"
                  onClick={() => handleEditClick(idx)}
                >
                  <Pencil width={25} height={25} className="text-primary" />
                </button>
                <button
                  id="borrar"
                  className="cursor-pointer"
                  aria-label={`Borrar item educación: ${item.Titulo}`}
                  type="button"
                  onClick={() => handleDeleteClick(idx)}
                >
                  <Trash width={25} height={25} className="text-primary" />
                </button>
              </div>
            </div>
            <p className="font-semibold">{item.Institucion}</p>
            <p className="font-semibold">{item.Nivel}</p>
            <p>
              {item.Fecha
                ? (() => {
                    const date = new Date(item.Fecha);
                    if (isNaN(date.getTime())) return item.Fecha;
                    // Get month short, capitalize first letter, and year
                    const month = date.toLocaleString("es-ES", {
                      month: "short",
                    });
                    const monthCap =
                      month.charAt(0).toUpperCase() + month.slice(1);
                    return `${monthCap} ${date.getFullYear()}`;
                  })()
                : ""}
            </p>
            <p>{item.Pais}</p>
            {idx !== educacionItems.length - 1 && (
              <hr className="border-none h-px bg-[#ebebed] mt-4 mb-3 mx-0" />
            )}
          </div>
        ))}

        {/* Modal for adding (Radix UI Dialog) */}
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogContent className="p-8 max-w-md">
            <DialogHeader>
              <DialogTitle>Añadir item de educación</DialogTitle>
            </DialogHeader>
            <EditarEducacionItem
              initialValues={{
                Titulo: "",
                Institucion: "",
                Nivel: "",
                Fecha: "",
                Pais: "",
              }}
              onSave={handleAddSave}
              onCancel={handleAddModalClose}
            />
          </DialogContent>
        </Dialog>

        {/* Modal for editing (Radix UI Dialog) */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="p-8 max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Educación</DialogTitle>
            </DialogHeader>
            <EditarEducacionItem
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
              <DialogTitle>¿Está seguro de borrar este item?</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                className="cursor-pointer px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
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
      </div>
    </section>
  );
};

export default EditarEducacion;
