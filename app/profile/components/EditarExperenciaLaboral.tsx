"use client";
import Badge from "@/components/shared/components/Badge";
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
import { ExperienciaLaboral } from "@/types/profile";
import { useState } from "react";
import EditarExperenciaLaboralItem, {
  EditarExperenciaLaboralItemValues,
} from "./EditarExperenciaLaboralItem";
import { CatalogsByType } from "@/types/search";

const initialExp = {
  empresa: "",
  puesto: "",
  fechaInicio: "",
  fechaFin: "",
  pais: "",
  estaTrabajando: false,
  ciudad: "",
};

type EditarExperenciaLaboralProps = {
  experiencia: ExperienciaLaboral[];
  pais: CatalogsByType[] | undefined;
};

export default function EditarExperenciaLaboral({
  experiencia,
  pais,
}: EditarExperenciaLaboralProps) {
  const [educacionItems, setEducacionItems] =
    useState<EditarExperenciaLaboralItemValues[]>(experiencia);

  // Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] =
    useState<EditarExperenciaLaboralItemValues>(initialExp);

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
  const handleEditSave = (values: EditarExperenciaLaboralItemValues) => {
    if (editIndex !== null) {
      const updated = [...educacionItems];
      updated[editIndex] = { ...values };
      setEducacionItems(updated);
      setModalOpen(false);
      setEditIndex(null);
    }
  };

  // Save new item from add modal form (add to front)
  const handleAddSave = (values: EditarExperenciaLaboralItemValues) => {
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
        <TituloSubrayado className="mb-0">Experiencia Laboral</TituloSubrayado>
        <button
          id="agregar"
          className="cursor-pointer flex items-center gap-2 text-primary font-semibold align-self-end"
          aria-label={`Agregar nuevo item experiencia laboral`}
          type="button"
          onClick={handleAddClick}
        >
          <Plus width={25} height={25} className="text-primary" />
          Añadir item
        </button>
      </div>
      <hr className="border-none h-px bg-[#ebebed] mt-4 mb-3 mx-0" />
      <div>
        {educacionItems.map((item, idx) => (
          <div key={idx} className="my-4">
            <div className="flex w-full justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                {item.estaTrabajando && (
                  <Badge
                    variant="custom"
                    bgColor="bg-green-100"
                    textColor="text-green-700"
                  >
                    Actual
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  id="editar"
                  className="cursor-pointer"
                  type="button"
                  onClick={() => handleEditClick(idx)}
                >
                  <Pencil width={25} height={25} className="text-primary" />
                </button>
                <button
                  id="borrar"
                  className="cursor-pointer"
                  type="button"
                  onClick={() => handleDeleteClick(idx)}
                >
                  <Trash width={25} height={25} className="text-primary" />
                </button>
              </div>
            </div>
            <p className="font-semibold">{item.empresa}</p>
            <p className="font-semibold">{item.puesto}</p>
            <p>
              {item.fechaInicio && item.fechaFin
                ? `${new Date(item.fechaInicio).toLocaleDateString(
                    "es-ES"
                  )} - ${new Date(item.fechaFin).toLocaleDateString("es-ES")}`
                : ""}
            </p>
            <p>{item.pais}</p>
            {idx !== educacionItems.length - 1 && (
              <hr className="border-none h-px bg-[#ebebed] mt-4 mb-3 mx-0" />
            )}
          </div>
        ))}
      </div>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-primary mb-2.5">
              Añadir Experiencia Laboral
            </DialogTitle>
          </DialogHeader>
          <EditarExperenciaLaboralItem
            initialValues={initialExp}
            onSave={handleAddSave}
            onCancel={handleAddModalClose}
            pais={pais}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-primary mb-2.5">
              Editar Experiencia Laboral
            </DialogTitle>
          </DialogHeader>
          <EditarExperenciaLaboralItem
            initialValues={editForm}
            onSave={handleEditSave}
            onCancel={handleModalClose}
            pais={pais}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="p-8 max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-primary font-primary mb-2.5">
              ¿Está seguro de que desea eliminar este item?
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
