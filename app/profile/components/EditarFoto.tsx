"use client";
import Pencil from "@/components/shared/components/iconos/Pencil";
import Trash from "@/components/shared/components/iconos/Trash";
import TituloSubrayado from "@/components/shared/tituloSubrayado";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/context/authStore";
import { fetchApi } from "@/lib/apiClient";
import { fileToBase64, getInitials } from "@/lib/utils";
import { PlainStringDataMessage } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  imagen: z.union([z.string().min(1), z.instanceof(File)]).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditarFoto() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: session } = useSession();
  const fullName = useAuthStore((s) => s.fullName);
  const pic = useAuthStore((s) => s.pic);
  const setPic = useAuthStore((s) => s.setPic);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      imagen: undefined,
    },
  });

  useEffect(() => {
    if (pic) form.reset({ imagen: pic });
  }, [pic, form]);

  const watchedImage = form.watch("imagen");
  const imagePreview =
    typeof watchedImage === "string"
      ? watchedImage
      : watchedImage instanceof File
      ? URL.createObjectURL(watchedImage)
      : undefined;

  async function deteleImage() {
    const res = await fetchApi<PlainStringDataMessage>(
      "/User/delete-user-picture/" + session?.user.id,
      {
        method: "DELETE",
        token: session?.user.accessToken,
      }
    );
    if (!res?.isSuccess) {
      toast.error("Error eliminando imagen");
      return;
    }
    setPic(undefined);
    toast.success(res.data);
  }

  async function onSubmit(data: FormValues) {
    if (!data.imagen || typeof data.imagen === "string") {
      await deteleImage();
      return;
    }
    const base64Image = await fileToBase64(data.imagen);
    const body = {
      userId: session?.user.id,
      base64Image,
    };
    const res = await fetchApi<PlainStringDataMessage>(
      "/User/update-user-picture",
      {
        method: "PUT",
        token: session?.user.accessToken,
        body,
      }
    );
    if (!res?.isSuccess) {
      toast.error("Error actualizando imagen");
      return;
    }
    setPic(base64Image);
    toast.success(res?.data);
  }

  return (
    <Card className="px-6">
      <TituloSubrayado>Editar foto de perfil</TituloSubrayado>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
          <div className="relative w-24 h-24 mb-2">
            <Avatar className="size-full">
              <AvatarImage src={imagePreview} />
              <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="imagen"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormLabel className="sr-only">Imagen de perfil</FormLabel>
                    <FormControl>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => {
                          fileInputRef.current = el;
                          field.ref(el);
                        }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          file && field.onChange(file);
                        }}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute -bottom-4 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer flex items-center justify-center w-8 h-8"
                      aria-label="Cambiar foto de perfil"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Pencil width={20} height={20} className="text-primary" />
                    </button>
                    <button
                      type="button"
                      className="absolute -bottom-4 left-1 bg-white rounded-full p-1 shadow-md cursor-pointer flex items-center justify-center"
                      aria-label="Remover foto de perfil"
                      onClick={() => {
                        field.onChange(undefined);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <Trash width={20} height={20} className="text-primary" />
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-10 flex gap-4 items-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
              )}
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
