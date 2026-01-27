import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchApi } from "@/lib/apiClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface JobApplyFormProps {
  idUsuario: string;
  idVacante: string;
  token?: string;
  onSuccess?: () => void;
}

interface AplicacionResponse {
  isSuccess: boolean;
  messages?: string[];
}

const applyFormSchema = z.object({
  message: z.string(),
});

type ApplyFormData = z.infer<typeof applyFormSchema>;

export default function JobApplyForm({
  idUsuario,
  idVacante,
  token,
  onSuccess,
}: JobApplyFormProps) {
  const form = useForm<ApplyFormData>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: { message: "" },
  });

  async function onSubmit(data: ApplyFormData) {
    try {
      const response = await fetchApi<AplicacionResponse>(
        "/Aplicacion/add-aplicacion",
        {
          method: "POST",
          body: {
            idUsuario,
            idVacante,
            mensajeCandidato: data.message,
          },
          token,
        },
      );

      if (response?.isSuccess) {
        toast.success("Aplicado con éxito");
        form.reset();
        onSuccess?.();
      } else {
        toast.error(response?.messages?.[0] || "Error al enviar la aplicación");
      }
    } catch (error) {
      toast.error("Error al enviar la aplicación");
      console.error(error);
    }
  }

  return (
    <Card className="px-6 py-5 gap-4">
      <h2 className="section-title mb-0">Formulario de aplicación</h2>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="message"
                  className="text-sm font-medium text-gray-500"
                >
                  Mensaje
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id="message"
                    aria-label="Mensaje"
                    placeholder="¿Por qué te interesa este puesto?"
                    rows={5}
                    className="w-full border rounded px-4 py-2 resize-none h-36"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="btn btn-primary w-auto px-6"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
              )}
              {form.formState.isSubmitting ? "Enviando..." : "Enviar aplicación"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
