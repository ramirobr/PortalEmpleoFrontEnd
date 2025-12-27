"use client";
import { Pencil } from "@/components/shared/components/iconos/Pencil";
import { Plus } from "@/components/shared/components/iconos/Plus";
import { Trash } from "@/components/shared/components/iconos/Trash";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Educacion } from "@/types/profile";
import { useState } from "react";
import EditarEducacionItem, {
  EditarEducacionItemValues,
} from "./EditarEducacionItem";

const initial: EditarEducacionItemValues = {
  titulo: "",
  periodo: "",
  fechaInicio: "",
  fechaFin: "",
  institucion: "",
  estaCursando: false,
};

type EditarEducacionProps = {
  educacion: Educacion[];
};

export default function EditarEducacion({ educacion }: EditarEducacionProps) {
  const [educacionItems, setEducacionItems] =
    useState<EditarEducacionItemValues[]>(educacion);

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditarEducacionItemValues>(initial);

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
    <Card className="px-6">
      <div className="flex justify-between items-center">
        <TituloSubrayado className="mb-0">Educación</TituloSubrayado>
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
            <div className="flex w-full justify-between items-center gap-6">
              <h4 className="font-bold text-xl">{item.titulo}</h4>
              <div className="flex items-center gap-3">
                <button
                  id="editar"
                  className="cursor-pointer"
                  aria-label={`Editar item educación: ${item.titulo}`}
                  type="button"
                  onClick={() => handleEditClick(idx)}
                >
                  <Pencil width={25} height={25} className="text-primary" />
                </button>
                <button
                  id="borrar"
                  className="cursor-pointer"
                  aria-label={`Borrar item educación: ${item.titulo}`}
                  type="button"
                  onClick={() => handleDeleteClick(idx)}
                >
                  <Trash width={25} height={25} className="text-primary" />
                </button>
              </div>
            </div>
            <p className="font-semibold">{item.institucion}</p>
            <p>
              {item.fechaFin
                ? (() => {
                    const date = new Date(item.fechaFin);
                    if (isNaN(date.getTime())) return item.fechaFin;
                    // Use deterministic month names to avoid hydration mismatch
                    const monthNames = [
                      "Ene",
                      "Feb",
                      "Mar",
                      "Abr",
                      "May",
                      "Jun",
                      "Jul",
                      "Ago",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dic",
                    ];
                    const month = monthNames[date.getMonth()];
                    return `${month} ${date.getFullYear()}`;
                  })()
                : ""}
            </p>
            {idx !== educacionItems.length - 1 && (
              <hr className="border-none h-px bg-[#ebebed] mt-4 mb-3 mx-0" />
            )}
          </div>
        ))}

        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogContent className="p-8 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary font-primary mb-2.5">
                Añadir item de educación
              </DialogTitle>
            </DialogHeader>
            <EditarEducacionItem
              initialValues={initial}
              onSave={handleAddSave}
              onCancel={handleAddModalClose}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="p-8 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary font-primary mb-2.5">
                Editar Educación
              </DialogTitle>
            </DialogHeader>
            <EditarEducacionItem
              initialValues={editForm}
              onSave={handleEditSave}
              onCancel={handleModalClose}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="p-8 max-w-md flex flex-col items-center">
            <DialogHeader>
              <DialogTitle className="text-primary font-primary mb-2.5">
                ¿Está seguro de borrar este item?
              </DialogTitle>
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
    </Card>
  );
}
