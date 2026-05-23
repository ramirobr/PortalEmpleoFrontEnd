"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminUsuario } from "@/types/admin";
import { usuarioFormSchema, UsuarioFormData } from "@/lib/admin/adminUsuarios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CatalogsByType } from "@/types/search";
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
  roles: { idRol: string; nombre: string }[];
  estadoOptions: CatalogsByType[];
  onSubmit: (data: UsuarioFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function UsuarioForm({
  usuario,
  roles,
  estadoOptions,
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
          roles: (usuario.roles?.length ? usuario.roles : [usuario.rol])
            .map((role) => role.idRol || role.nombre)
            .filter(Boolean),
          tipoUsuario: usuario.tipoUsuario,
          estado: usuario.estado.nombre.toLowerCase(),
        }
      : {
          nombreCompleto: "",
          email: "",
          roles: [],
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
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roles</FormLabel>
              <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border border-zinc-200 p-3">
                {roles.map((role) => {
                  const value = role.idRol || role.nombre;
                  const checked = field.value?.includes(value);

                  return (
                    <label
                      key={role.idRol}
                      className="flex cursor-pointer items-center gap-3 rounded px-2 py-1.5 text-sm hover:bg-zinc-50"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          const current = field.value ?? [];
                          field.onChange(
                            isChecked
                              ? [...current, value]
                              : current.filter((item) => item !== value),
                          );
                        }}
                      />
                      <span>{role.nombre}</span>
                    </label>
                  );
                })}
              </div>
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
                  {estadoOptions.map((estado) => (
                    <SelectItem key={estado.idCatalogo} value={estado.nombre.toLowerCase()}>
                      {estado.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-sm text-slate-600 bg-zinc-50 p-3 rounded">
          <p><strong>Tipo de usuario:</strong> {usuario.tipoUsuario === "admin" ? "Administrador" : usuario.tipoUsuario === "empresa" ? "Empresa" : "Postulante"}</p>
          <p><strong>Roles:</strong> {(usuario.roles?.length ? usuario.roles : [usuario.rol]).map((role) => role.nombre).join(", ")}</p>
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
            {loading ? "Guardando…" : "Actualizar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
