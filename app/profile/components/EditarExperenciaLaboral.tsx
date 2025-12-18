"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import EditarExperenciaLaboralItem, {
  EditarExperenciaLaboralItemValues,
} from "./EditarExperenciaLaboralItem";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Trash } from "@/components/shared/components/iconos/Trash";
import { Pencil } from "@/components/shared/components/iconos/Pencil";
import { Plus } from "@/components/shared/components/iconos/Plus";
import { fetchExperienciaLaboral } from "@/lib/catalog/fetchExperienciaLaboral";
import Loader from "@/components/shared/components/Loader";
import Badge from "@/components/shared/components/Badge";

const EditarExperenciaLaboral: React.FC = () => {
  // Work experience items from API
  const [educacionItems, setEducacionItems] = useState<
    EditarExperenciaLaboralItemValues[]
  >([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetchExperienciaLaboral()
      .then(setEducacionItems)
      .finally(() => setLoading(false));
  }, []);

  // Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditarExperenciaLaboralItemValues>({
    Empresa: "",
    Titulo: "",
    Puesto: "",
    Institucion: "",
    Nivel: "",
    FechaInicio: "",
    FechaFin: "",
    Pais: "",
    Actual: false,
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

  if (loading) {
    return <Loader className="py-8" />;
  }

  return (
    <section className="bg-white rounded-lg shadow p-8 mt-10">
      <TituloSubrayado>Experiencia Laboral</TituloSubrayado>
      <div className="flex justify-end items-center">
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
      <div className="mb-8">
        {educacionItems.map((item, idx) => (
          <div key={idx} className="my-4">
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-xl">{item.Titulo}</h4>
                {item.Actual && (
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
            <p className="font-semibold">{item.Empresa}</p>
            <p className="font-semibold">{item.Puesto}</p>
            <p>
              {item.FechaInicio && item.FechaFin
                ? `${new Date(item.FechaInicio).toLocaleDateString(
                    "es-ES"
                  )} - ${new Date(item.FechaFin).toLocaleDateString("es-ES")}`
                : ""}
            </p>
            <p>{item.Pais}</p>
            {idx !== educacionItems.length - 1 && (
              <hr className="border-none h-px bg-[#ebebed] mt-4 mb-3 mx-0" />
            )}
          </div>
        ))}
      </div>

      {/* Modal for adding new item (Radix UI Dialog) */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-primary mb-2.5">
              Añadir Experiencia Laboral
            </DialogTitle>
          </DialogHeader>
          <EditarExperenciaLaboralItem
            initialValues={{
              Empresa: "",
              Titulo: "",
              Puesto: "",
              Institucion: "",
              Nivel: "",
              FechaInicio: "",
              FechaFin: "",
              Pais: "",
              Actual: false,
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
            <DialogTitle className="text-primary font-primary mb-2.5">
              Editar Experiencia Laboral
            </DialogTitle>
          </DialogHeader>
          <EditarExperenciaLaboralItem
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
    </section>
  );
};

export default EditarExperenciaLaboral;
