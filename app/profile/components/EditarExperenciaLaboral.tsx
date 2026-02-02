"use client";
import Pill from "@/components/shared/components/Pill";
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
} from "@/types/user";
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
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

    const res = await fetchApi("/ExperienciaLaboral/actualizar", {
      method: "PUT",
      token: session?.user.accessToken,
      body,
    });

    if (!res?.isSuccess) {
      toast.error("Error editando experiencia");
      return;
    }

    setExperiencias((prev) =>
      prev.map((item) =>
        item.id === editModal.id ? { ...values, id: editModal.id } : item,
      ),
    );
    handleCancelEdit();
    toast.success(res?.data);
  };

  const handleAddSave = async (values: ExperienciaLaboral) => {
    const { estaTrabajando, fechaFin, ...data } = values;
    const body = {
      ...data,
      fechaFin: estaTrabajando ? null : fechaFin,
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
      },
    );

    if (!res?.isSuccess) {
      toast.error("Error agregando experiencia");
      return;
    }

    const exp: ExperienciaLaboral = {
      ...data,
      fechaFin: estaTrabajando ? "" : fechaFin,
      id: res.data.idExperiencia,
      estaTrabajando,
    };

    setExperiencias([exp, ...Experiencias]);
    handleAddModalClose();
    toast.success("Experiencia laboral agregada.");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    const res = await fetchApi("/ExperienciaLaboral/borrar/" + deleteModal, {
      method: "DELETE",
      token: session?.user.accessToken,
    });
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
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Briefcase width={25} height={25} className="text-primary" />
          Experiencia Laboral
        </h2>

        <button
          id="agregar-experiencia"
          className="cursor-pointer flex items-center gap-2 text-primary font-bold align-center btn bg-primary/10"
          aria-label={`Agregar nuevo item experiencia laboral`}
          type="button"
          onClick={handleAddClick}
        >
          <Plus width={20} height={20} className="text-primary" />
          Agregar
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Experiencias?.length ? (
          Experiencias.map((item, index) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border border-dashed border-[#dce5e5] flex justify-between my-4"
            >
              <div>
                {item.estaTrabajando && (
                  <Pill
                    variant="custom"
                    bgColor="bg-black mb-3"
                    textColor="text-white"
                  >
                    Actual
                  </Pill>
                )}
                <h4 className="font-bold text-xl">{item.empresa}</h4>
                <div className="flex flex-col  gap-3">
                  <p className="font-medium text-lg">{item.puesto}</p>
                  {item.fechaInicio && item.fechaFin && (
                    <Pill
                      variant="custom"
                      bgColor="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-light uppercase"
                      noButton
                    >
                      {`${new Date(item.fechaInicio).toLocaleDateString(
                        "es-ES",
                        { month: "short", year: "numeric" },
                      )} - ${new Date(item.fechaFin).toLocaleDateString("es-ES", { month: "short", year: "numeric" })}`}
                    </Pill>
                  )}
                </div>
                <p>{item.pais}</p>
              </div>

              <div className="flex items-center gap-6 self-start">
                <button
                  id="editar"
                  className="cursor-pointer"
                  type="button"
                  onClick={() => handleEditClick(item.id)}
                >
                  <Pencil
                    width={20}
                    height={20}
                    className="text-gray-500 hover:text-primary transition-colors"
                  />
                </button>
                <button
                  id="borrar"
                  className="cursor-pointer"
                  type="button"
                  onClick={() => handleDeleteClick(item.id)}
                >
                  <Trash2
                    width={20}
                    height={20}
                    className="text-gray-500 hover:text-primary transition-colors"
                  />
                </button>
              </div>
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
            <button type="button" onClick={handleDeleteCancel}>
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
