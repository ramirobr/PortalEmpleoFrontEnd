"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Search, BookOpen, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AdminCatalogo, CatalogoFormValues } from "@/types/admin";
import {
  getAdminCatalogos,
  createCatalogo,
  updateCatalogo,
  deleteCatalogo,
  getCatalogTypes,
} from "@/lib/admin/adminCatalogos";
import CatalogosTable from "./components/CatalogosTable";
import CatalogoFormDialog from "./components/CatalogoFormDialog";
import TablePagination from "@/components/shared/components/TablePagination";

export default function AdminCatalogosPage() {
  const { data: session } = useSession();
  const [catalogos, setCatalogos] = useState<AdminCatalogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCatalogo, setEditingCatalogo] = useState<AdminCatalogo | null>(
    null,
  );

  const fetchCatalogos = async () => {
    setLoading(true);
    const response = await getAdminCatalogos(session?.user?.accessToken);
    if (response?.isSuccess && response.data) {
      setCatalogos(response.data);
    } else if (response && !response.isSuccess) {
      toast.error("Error al cargar los catálogos");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCatalogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Unique types derived from loaded data
  const catalogTypes = useMemo(() => getCatalogTypes(catalogos), [catalogos]);

  // Client-side filtering
  const filteredCatalogos = useMemo(() => {
    return catalogos.filter((c) => {
      const matchesSearch =
        search === "" ||
        c.nombre.toLowerCase().includes(search.toLowerCase()) ||
        c.tipoCatalogo.toLowerCase().includes(search.toLowerCase()) ||
        (c.descripcion ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.codigo ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesTipo =
        tipoFilter === "todos" || c.tipoCatalogo === tipoFilter;

      const matchesEstado =
        estadoFilter === "todos" ||
        (estadoFilter === "activo" && c.activo) ||
        (estadoFilter === "inactivo" && !c.activo);

      return matchesSearch && matchesTipo && matchesEstado;
    });
  }, [catalogos, search, tipoFilter, estadoFilter]);

  const paginatedCatalogos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCatalogos.slice(start, start + pageSize);
  }, [filteredCatalogos, currentPage, pageSize]);

  const totalItems = filteredCatalogos.length;

  const handleCreate = () => {
    setEditingCatalogo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (idCatalogo: number) => {
    const found = catalogos.find((c) => c.idCatalogo === idCatalogo);
    if (found) {
      setEditingCatalogo(found);
      setIsFormOpen(true);
    }
  };

  const handleToggleStatus = async (idCatalogo: number) => {
    const target = catalogos.find((c) => c.idCatalogo === idCatalogo);
    if (!target) return;

    const updated: CatalogoFormValues = {
      nombre: target.nombre,
      descripcion: target.descripcion,
      tipoCatalogo: target.tipoCatalogo,
      codigo: target.codigo,
      valorEntero: target.valorEntero,
      valorCadena: target.valorCadena,
      orden: target.orden,
      activo: !target.activo,
      idCatalogoPadre: target.idCatalogoPadre,
    };

    const response = await updateCatalogo(
      idCatalogo,
      updated,
      session?.user?.accessToken,
    );

    if (response?.isSuccess) {
      setCatalogos((prev) =>
        prev.map((c) =>
          c.idCatalogo === idCatalogo ? { ...c, activo: !c.activo } : c,
        ),
      );
      toast.success(
        `Entrada ${!target.activo ? "activada" : "desactivada"} correctamente`,
      );
    } else {
      toast.error("No se pudo actualizar el estado");
    }
  };

  const handleDelete = async (idCatalogo: number) => {
    const response = await deleteCatalogo(
      idCatalogo,
      session?.user?.accessToken,
    );

    if (response?.isSuccess) {
      setCatalogos((prev) => prev.filter((c) => c.idCatalogo !== idCatalogo));
      toast.success("Entrada eliminada correctamente");
    } else {
      const msg =
        response?.messages?.[0] ?? "No se pudo eliminar la entrada";
      toast.error(msg);
    }
  };

  const handleFormSubmit = async (data: CatalogoFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingCatalogo) {
        const response = await updateCatalogo(
          editingCatalogo.idCatalogo,
          data,
          session?.user?.accessToken,
        );
        if (response?.isSuccess) {
          await fetchCatalogos();
          toast.success("Entrada actualizada correctamente");
          setIsFormOpen(false);
          setEditingCatalogo(null);
        } else {
          const msg =
            response?.messages?.[0] ?? "No se pudo actualizar la entrada";
          toast.error(msg);
        }
      } else {
        const response = await createCatalogo(
          data,
          session?.user?.accessToken,
        );
        if (response?.isSuccess) {
          await fetchCatalogos();
          toast.success("Entrada creada correctamente");
          setIsFormOpen(false);
        } else {
          const msg =
            response?.messages?.[0] ?? "No se pudo crear la entrada";
          toast.error(msg);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Gestionar Catálogos
        </h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Entrada
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, tipo o código..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Filtro por tipo */}
          <Select
            value={tipoFilter}
            onValueChange={(value) => {
              setTipoFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder="Tipo de catálogo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              {catalogTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro por estado */}
          <Select
            value={estadoFilter}
            onValueChange={(value) => {
              setEstadoFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <CatalogosTable
          catalogos={paginatedCatalogos}
          loading={loading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="entradas"
          onPageChange={setCurrentPage}
          className="rounded-b-xl border-t border-gray-100"
        />
      </Card>

      <CatalogoFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        catalogo={editingCatalogo}
        catalogTypes={catalogTypes}
        allCatalogos={catalogos}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
