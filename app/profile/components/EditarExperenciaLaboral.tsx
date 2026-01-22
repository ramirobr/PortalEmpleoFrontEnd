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
import { useAuthStore } from "@/context/authStore";
import { fetchApi } from "@/lib/apiClient";
import {
  DatosPersonalesFieldsResponse,
  ExperienciaLaboral,
  ExperienciaLaboralResponse,
  PlainStringDataMessage,
} from "@/types/user";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import EditarExperenciaLaboralItem from "./EditarExperenciaLaboralItem";

type EditarExperenciaLaboralProps = {
  experiencia: ExperienciaLaboral[];
  fields: DatosPersonalesFieldsResponse | null;
};

export default function EditarExperenciaLaboral({
  experiencia,
  fields,
}: EditarExperenciaLaboralProps) {
  const [Experiencias, setExperiencias] =
    useState<ExperienciaLaboral[]>(experiencia);
  const [editModal, setEditModal] = useState<ExperienciaLaboral | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const idCurriculum = useAuthStore((s) => s.idCurriculum);
  const { data: session } = useSession();

  const handleEditClick = (id: string) => {
    const exp = Experiencias.find((exp) => exp.id === id);
    if (!exp) return;
    setEditModal(exp);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal(id);
  };

  const handleEditSave = async (values: ExperienciaLaboral) => {
    if (!editModal) return;
    const body = {
      ...values,
      idExperiencia: editModal.id,
      idCurriculum,
      orden: 0,
    };

    const res = await fetchApi<PlainStringDataMessage>(
      "/ExperienciaLaboral/actualizar",
      {
        method: "PUT",
        token: session?.user.accessToken,
        body,
      }
    );

    if (!res?.isSuccess) {
      toast.error("Error editando experiencia");
      return;
    }

    setExperiencias((prev) =>
      prev.map((item) =>
        item.id === editModal.id ? { ...values, id: editModal.id } : item
      )
    );
    handleCancelEdit();
    toast.success(res?.data);
  };

  const handleAddSave = async (values: ExperienciaLaboral) => {
    const { estaTrabajando, ...data } = values;
    const body = {
      ...data,
      trabajoActual: estaTrabajando,
      idCurriculum,
      orden: 0,
    };

    const res = await fetchApi<ExperienciaLaboralResponse>(
      "/ExperienciaLaboral/agregar",
      {
        method: "POST",
        token: session?.user.accessToken,
        body,
      }
    );

    if (!res?.isSuccess) {
      toast.error("Error agregando experiencia");
      return;
    }

    const exp: ExperienciaLaboral = {
      ...data,
      id: res.data.idExperiencia,
      estaTrabajando,
    };

    setExperiencias([exp, ...Experiencias]);
    handleAddModalClose();
    toast.success("Experiencia laboral agregada.");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    const res = await fetchApi<PlainStringDataMessage>(
      "/ExperienciaLaboral/borrar/" + deleteModal,
      {
        method: "DELETE",
        token: session?.user.accessToken,
      }
    );
    if (!res?.isSuccess) {
      toast.error("Error eliminando experiencia");
      return;
    }
    setExperiencias((prev) => prev.filter((h) => h.id !== deleteModal));
    handleDeleteCancel();
    toast.success(res.data);
  };

  const handleDeleteCancel = () => {
    setDeleteModal(null);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleCancelEdit = () => {
    setEditModal(null);
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
        {Experiencias?.length ? (
          Experiencias.map((item, index) => (
            <div key={item.id} className="my-4">
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
                    onClick={() => handleEditClick(item.id)}
                  >
                    <Pencil width={25} height={25} className="text-primary" />
                  </button>
                  <button
                    id="borrar"
                    className="cursor-pointer"
                    type="button"
                    onClick={() => handleDeleteClick(item.id)}
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
              {index !== Experiencias.length - 1 && (
                <hr className="border-none h-px bg-[#ebebed] mt-4 mb-3 mx-0" />
              )}
            </div>
          ))
        ) : (
          <h4 className="text-base font-semibold">No hay experiencias</h4>
        )}
      </div>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-primary mb-2.5">
              Añadir Experiencia Laboral
            </DialogTitle>
          </DialogHeader>
          <EditarExperenciaLaboralItem
            initialValues={null}
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
              Editar Experiencia Laboral
            </DialogTitle>
          </DialogHeader>
          <EditarExperenciaLaboralItem
            initialValues={editModal}
            onSave={handleEditSave}
            onCancel={handleCancelEdit}
            fields={fields}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteModal} onOpenChange={handleDeleteCancel}>
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
