"use client";
import Pill from "@/components/shared/components/Pill";
import { PremiumButton } from "@/components/shared/components/PremiumButton";
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
} from "@/types/user";
import { GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";
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

    const res = await fetchApi("/Educacion/actualizar", {
      method: "PUT",
      token: session?.user.accessToken,
      body,
    });

    if (!res?.isSuccess) {
      toast.error("Error actualizando título/curso");
      return;
    }

    setEducacionItems((prev) =>
      prev.map((item) => (item.id === editForm.id ? values : item)),
    );
    handleModalClose();
    toast.success("Título/Curso actualizado");
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
      toast.error("Error agregando título/curso");
      return;
    }
    setEducacionItems([
      { ...res.data, id: res.data.idEducacion },
      ...educacionItems,
    ]);
    handleAddModalClose();
    toast.success("Título/Curso agregado");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    const res = await fetchApi("/Educacion/eliminar/" + deleteModal, {
      method: "DELETE",
      token: session?.user.accessToken,
    });
    if (!res?.isSuccess) {
      toast.error("Error eliminando item");
      return;
    }
    setEducacionItems((prev) => prev.filter((h) => h.id !== deleteModal));
    handleDeleteCancel();
    toast.success("Título/Curso eliminado");
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
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <GraduationCap width={25} height={25} className="text-primary" />
          Títulos y Cursos
        </h2>
        <button
          id="agregar-educacion"
          className="cursor-pointer flex items-center gap-2 text-primary font-bold align-center btn bg-primary/10"
          aria-label={`Agregar nuevo item de título o curso`}
          type="button"
          onClick={handleAddClick}
        >
          <Plus width={20} height={20} className="text-primary" />
          Agregar
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {educacionItems?.length ? (
          educacionItems.map((item) => {
            const startStr = item.fechaInicio
              ? new Date(item.fechaInicio).toLocaleDateString("es-ES", {
                  month: "short",
                  year: "numeric",
                })
              : "";
            const endStr = item.fechaFin
              ? new Date(item.fechaFin).toLocaleDateString("es-ES", {
                  month: "short",
                  year: "numeric",
                })
              : "";
            return (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-dashed border-border flex justify-between my-4"
              >
                <div>
                  <h4 className="font-semibold text-xl">{item.titulo}</h4>
                  <div className="flex flex-col gap-3">
                    <p className="font-medium text-lg">{item.institucion} </p>
                    {startStr && endStr && (
                      <span suppressHydrationWarning>
                        <Pill
                          variant="custom"
                          bgColor="text-sm font-medium text-slate-500 bg-zinc-50 px-3 py-1 rounded-full border border-gray-light uppercase"
                          noButton
                        >
                          {`${startStr} - ${endStr}`}
                        </Pill>
                      </span>
                    )}
                    {item.documentoAdjunto && (
                      <button
                        type="button"
                        onClick={() => {
                          const ext = item.documentoAdjunto!.startsWith("data:application/pdf") ? ".pdf" : ".jpg";
                          const a = document.createElement("a");
                          a.href = item.documentoAdjunto!;
                          a.download = `${item.titulo.replace(/\s+/g, "_")}${ext}`;
                          a.click();
                        }}
                        className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 underline cursor-pointer w-fit"
                      >
                        📄 Descargar documento
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 self-start">
                  <button
                    id="editar"
                    className="cursor-pointer"
                    aria-label={`Editar item: ${item.titulo}`}
                    type="button"
                    onClick={() => handleEditClick(item.id)}
                  >
                    <Pencil
                      width={20}
                      height={20}
                      className="text-slate-500 hover:text-primary transition-colors"
                    />
                  </button>
                  <button
                    id="borrar"
                    className="cursor-pointer"
                    aria-label={`Borrar item educación: ${item.titulo}`}
                    type="button"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    <Trash2
                      width={20}
                      height={20}
                      className="text-slate-500 hover:text-primary transition-colors"
                    />
                  </button>
                </div>
              </div>
            );
          })
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
              <PremiumButton variant="outline" onClick={handleDeleteCancel}>
                Cancelar
              </PremiumButton>
              <PremiumButton onClick={handleDeleteConfirm}>Aceptar</PremiumButton>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
