"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminUsuario } from "@/types/admin";
import { usuarioFormSchema, UsuarioFormData } from "@/lib/admin/adminUsuarios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface UsuarioFormProps {
  usuario?: AdminUsuario;
  onSubmit: (data: UsuarioFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function UsuarioForm({
  usuario,
  onSubmit,
  onCancel,
  loading = false,
}: UsuarioFormProps) {
  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioFormSchema),
    defaultValues: usuario
      ? {
          nombreCompleto: usuario.nombreCompleto,
          email: usuario.email,
          rol: usuario.rol.nombre.toLowerCase().replace(" ", ""),
          tipoUsuario: usuario.tipoUsuario,
          estado: usuario.estado.nombre.toLowerCase() as "activo" | "inactivo" | "suspendido" | "pendiente",
        }
      : {
          nombreCompleto: "",
          email: "",
          rol: "postulante",
          tipoUsuario: "candidato",
          estado: "activo",
        },
  });

  const handleSubmit = (data: UsuarioFormData) => {
    onSubmit(data);
  };

  if (!usuario) return null; // Solo para edición

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombreCompleto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="usuario@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="suspendido">Suspendido</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <p><strong>Tipo de usuario:</strong> {usuario.tipoUsuario === "admin" ? "Administrador" : usuario.tipoUsuario === "empresa" ? "Empresa" : "Postulante"}</p>
          <p><strong>Rol:</strong> {usuario.rol.nombre}</p>
          <p><strong>Fecha de registro:</strong> {usuario.fechaRegistro}</p>
          <p><strong>Último acceso:</strong> {usuario.ultimoAcceso || "Nunca"}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Actualizar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}