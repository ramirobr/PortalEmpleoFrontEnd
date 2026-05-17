"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Pencil, Trash2, Video, X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  imagen: z.union([z.string().min(1), z.instanceof(File)]).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditarFoto() {
  const [isEditing, setIsEditing] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  const stopWebcam = useCallback(() => {
    webcamStream?.getTracks().forEach((t) => t.stop());
    setWebcamStream(null);
    setShowWebcam(false);
  }, [webcamStream]);

  useEffect(() => {
    return () => {
      webcamStream?.getTracks().forEach((t) => t.stop());
    };
  }, [webcamStream]);

  useEffect(() => {
    if (showWebcam && videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [showWebcam, webcamStream]);

  const openWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);
      setShowWebcam(true);
    } catch {
      toast.error("No se pudo acceder a la cámara.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.85);
    form.setValue("imagen", base64);
    stopWebcam();
  };

  async function deteleImage() {
    const res = await fetchApi(
      "/User/delete-user-picture/" + session?.user.id,
      {
        method: "DELETE",
        token: session?.user.accessToken,
      },
    );
    if (!res?.isSuccess) {
      toast.error("Error eliminando imagen");
      return;
    }
    setPic(undefined);
    toast.success(res.data || "Imagen eliminada");
    setIsEditing(false);
  }

  async function onSubmit(data: FormValues) {
    if (!data.imagen || typeof data.imagen === "string") {
      if (!data.imagen) {
        await deteleImage();
      }
      return;
    }
    const base64Image = await fileToBase64(data.imagen);
    const body = {
      userId: session?.user.id,
      base64Image,
    };
    const res = await fetchApi("/User/update-user-picture", {
      method: "PUT",
      token: session?.user.accessToken,
      body,
    });
    if (!res?.isSuccess) {
      toast.error("Error actualizando imagen");
      return;
    }
    setPic(base64Image);
    toast.success(res?.data || "Imagen actualizada");
    setIsEditing(false);
  }

  async function onSubmitWithBase64(data: FormValues) {
    const imagen = data.imagen;
    if (typeof imagen === "string" && imagen.startsWith("data:")) {
      const body = { userId: session?.user.id, base64Image: imagen };
      const res = await fetchApi("/User/update-user-picture", {
        method: "PUT",
        token: session?.user.accessToken,
        body,
      });
      if (!res?.isSuccess) {
        toast.error("Error actualizando imagen");
        return;
      }
      setPic(imagen);
      toast.success(res?.data || "Imagen actualizada");
      setIsEditing(false);
      return;
    }
    await onSubmit(data);
  }

  return (
    <Card className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Camera width={25} height={25} className="text-primary" />
          Editar foto de perfil
        </h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
            aria-label="Editar foto de perfil"
          >
            <Pencil width={20} height={20} className="text-primary" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              stopWebcam();
              form.reset();
            }}
            className="cursor-pointer"
            aria-label="Cancelar edición"
          >
            <Trash2 width={20} height={20} className="text-primary" />
          </button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitWithBase64)}
          className="flex flex-col items-center"
        >
          <div className="relative size-24 mb-2">
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
                        id="avatar-upload"
                        title="Cambiar foto de perfil"
                        placeholder="Subir imagen"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => {
                          fileInputRef.current = el;
                          field.ref(el);
                        }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) field.onChange(file);
                        }}
                      />
                    </FormControl>
                    {isEditing && (
                      <button
                        type="button"
                        className="absolute -bottom-4 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer flex items-center justify-center size-8"
                        aria-label="Cambiar foto de perfil"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Pencil
                          width={20}
                          height={20}
                          className="text-primary"
                        />
                      </button>
                    )}
                    {isEditing && (
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
                        <Trash2
                          width={20}
                          height={20}
                          className="text-primary"
                        />
                      </button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditing && !showWebcam && (
            <div className="mt-10 flex gap-3 items-center flex-wrap justify-center">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <span className="animate-spin size-4 border-2 border-t-transparent rounded-full mr-2" />
                )}
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-outline flex items-center gap-2"
                onClick={openWebcam}
              >
                <Video className="size-4" />
                Tomar foto
              </button>
            </div>
          )}

          {/* Webcam capture section */}
          {showWebcam && (
            <div className="mt-6 w-full flex flex-col items-center gap-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-xs rounded-lg border border-zinc-200 bg-zinc-950"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn btn-primary flex items-center gap-2"
                  onClick={capturePhoto}
                >
                  <Camera className="size-4" />
                  Capturar
                </button>
                <button
                  type="button"
                  className="btn btn-outline flex items-center gap-2"
                  onClick={stopWebcam}
                >
                  <X className="size-4" />
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
