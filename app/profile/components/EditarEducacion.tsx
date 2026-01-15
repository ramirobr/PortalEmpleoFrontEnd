"use client";
import { Pencil } from "@/components/shared/components/iconos/Pencil";
import { Plus } from "@/components/shared/components/iconos/Plus";
import { Trash } from "@/components/shared/components/iconos/Trash";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/context/authStore";
import { fetchApi } from "@/lib/apiClient";
import {
  DatosPersonalesFieldsResponse,
  Educacion,
  EducacionResponse,
  PlainStringDataMessage,
} from "@/types/user";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import EditarEducacionItem from "./EditarEducacionItem";

type EditarEducacionProps = {
  educacion: Educacion[];
  fields: DatosPersonalesFieldsResponse | null;
};

export default function EditarEducacion({
  educacion,
  fields,
}: EditarEducacionProps) {
  const [educacionItems, setEducacionItems] = useState<Educacion[]>(educacion);
  const [editForm, setEditForm] = useState<Educacion | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const idCurriculum = useAuthStore((s) => s.idCurriculum);
  const { data: session } = useSession();

  const handleEditClick = (id: string) => {
    const educacion = educacionItems.find((educacion) => educacion.id === id);
    if (!educacion) return;
    setEditForm(educacion);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal(id);
  };

  const handleEditSave = async (values: Educacion) => {
    if (!editForm) return;
    const body = {
      ...values,
      idEducacion: editForm.id,
      idCurriculum,
      orden: 0,
    };

    const res = await fetchApi<PlainStringDataMessage>(
      "/Educacion/actualizar",
      {
        method: "PUT",
        token: session?.user.accessToken,
        body,
      }
    );
    setEducacionItems((prev) =>
      prev.map((item) => (item.id === editForm.id ? values : item))
    );
    handleModalClose();
    toast.success("Item actualizado");
  };

  const handleAddSave = async (values: Educacion) => {
    const body = {
      ...values,
      id: educacionItems.length.toString(),
      idCurriculum,
      orden: 0,
    };

    const res = await fetchApi<EducacionResponse>("/Educacion/agregar", {
      method: "POST",
      token: session?.user.accessToken,
      body,
    });
    if (!res?.isSuccess) {
      toast.error("Error agregando educación");
      return;
    }
    setEducacionItems([
      { ...res.data, id: res.data.idEducacion },
      ...educacionItems,
    ]);
    handleAddModalClose();
    toast.success("Educación agregada");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    const res = await fetchApi<PlainStringDataMessage>(
      "/Educacion/eliminar/" + deleteModal,
      {
        method: "DELETE",
        token: session?.user.accessToken,
      }
    );
    if (!res?.isSuccess) {
      toast.error("Error eliminando item");
      return;
    }
    setEducacionItems((prev) => prev.filter((h) => h.id !== deleteModal));
    handleDeleteCancel();
    toast.success(res.data);
  };

  const handleDeleteCancel = () => {
    setDeleteModal(null);
  };

  const handleModalClose = () => {
    setEditForm(null);
  };

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
        {educacionItems?.length ? (
          educacionItems.map((item, idx) => (
            <div key={idx} className="my-4 ">
              <div className="flex w-full justify-between items-center gap-6">
                <h4 className="font-bold text-xl">{item.titulo}</h4>
                <div className="flex items-center gap-3">
                  <button
                    id="editar"
                    className="cursor-pointer"
                    aria-label={`Editar item educación: ${item.titulo}`}
                    type="button"
                    onClick={() => handleEditClick(item.id)}
                  >
                    <Pencil width={25} height={25} className="text-primary" />
                  </button>
                  <button
                    id="borrar"
                    className="cursor-pointer"
                    aria-label={`Borrar item educación: ${item.titulo}`}
                    type="button"
                    onClick={() => handleDeleteClick(item.id)}
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
                      if (isNaN(date.getTime()))
                        return item.fechaFin.toString();
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
          ))
        ) : (
          <h4 className="text-base font-semibold">No hay registros</h4>
        )}

        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogContent className="p-8 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary font-primary mb-2.5">
                Añadir item de educación
              </DialogTitle>
            </DialogHeader>
            <EditarEducacionItem
              initialValues={null}
              fields={fields}
              onSave={handleAddSave}
              onCancel={handleAddModalClose}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editForm} onOpenChange={handleModalClose}>
          <DialogContent className="p-8 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary font-primary mb-2.5">
                Editar Educación
              </DialogTitle>
            </DialogHeader>
            <EditarEducacionItem
              initialValues={editForm}
              fields={fields}
              onSave={handleEditSave}
              onCancel={handleModalClose}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleteModal} onOpenChange={handleDeleteCancel}>
          <DialogContent className="p-8 max-w-md flex flex-col items-center">
            <DialogHeader>
              <DialogTitle className="text-primary font-primary mb-2.5">
                ¿Está seguro de borrar este item?
              </DialogTitle>
            </DialogHeader>
            <div className="flex gap-4 mt-6">
              <Button variant="secondary" onClick={handleDeleteCancel}>
                Cancelar
              </Button>
              <Button onClick={handleDeleteConfirm}>Aceptar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
