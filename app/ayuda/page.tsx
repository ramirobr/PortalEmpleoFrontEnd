"use client";

import MainLayout from "@/components/shared/layout/MainLayout";
import Footer from "@/components/shared/components/Footer";
import { useState } from "react";
import { Mail, MessageSquare, Phone, HelpCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TEMAS = [
  "Problema con mi cuenta",
  "Problema al publicar una oferta",
  "Problema con postulaciones",
  "Facturación y pagos",
  "Solicitud de eliminación de datos",
  "Reporte de contenido inapropiado",
  "Sugerencia de mejora",
  "Otro",
];

export default function HelpPage() {
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setEnviado(true);
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-50">
        <div className="bg-gradient-to-br from-primary to-primary-deep py-14 text-white">
          <div className="container text-center">
            <h1 className="text-4xl font-semibold mb-3">Solicitud de Ayuda</h1>
            <p className="text-white/80 text-base max-w-xl mx-auto">
              ¿Tienes algún problema o consulta? Completa el formulario y te responderemos a
              la brevedad.
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* Contact info cards */}
            <div className="space-y-4">
              <ContactCard
                icon={<Mail className="size-5 text-primary" />}
                title="Correo electrónico"
                detail="soporte@portalempleo.ec"
                sub="Respuesta en 24–48 h hábiles"
              />
              <ContactCard
                icon={<Phone className="size-5 text-primary" />}
                title="Teléfono"
                detail="+593 2 123 4567"
                sub="Lunes a viernes, 9:00–18:00"
              />
              <ContactCard
                icon={<MessageSquare className="size-5 text-primary" />}
                title="Chat en vivo"
                detail="Disponible en el portal"
                sub="Próximamente"
              />
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="size-5 text-primary" />
                  <span className="font-semibold text-slate-800">Preguntas frecuentes</span>
                </div>
                <p className="text-sm text-slate-600">
                  Antes de escribirnos, revisa si tu consulta ya tiene respuesta en nuestra
                  sección de preguntas frecuentes.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
              {enviado ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <CheckCircle className="size-16 text-green-500 mb-4" />
                  <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                    ¡Solicitud enviada!
                  </h2>
                  <p className="text-slate-500 max-w-sm">
                    Hemos recibido tu solicitud. Nuestro equipo te contactará en las próximas 24
                    a 48 horas hábiles.
                  </p>
                  <Button
                    className="mt-6"
                    variant="outline"
                    onClick={() => setEnviado(false)}
                  >
                    Enviar otra solicitud
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    Formulario de contacto
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="nombre">Nombre completo</Label>
                        <Input id="nombre" placeholder="Tu nombre" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@correo.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="tema">Tema de tu consulta</Label>
                      <Select required>
                        <SelectTrigger id="tema">
                          <SelectValue placeholder="Selecciona un tema" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEMAS.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="asunto">Asunto</Label>
                      <Input
                        id="asunto"
                        placeholder="Describe brevemente tu problema"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="mensaje">Mensaje</Label>
                      <Textarea
                        id="mensaje"
                        placeholder="Explica con detalle tu consulta o problema..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Enviando…" : "Enviar solicitud"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
}

function ContactCard({
  icon,
  title,
  detail,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  sub: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-1">
        {icon}
        <span className="font-semibold text-slate-800 text-sm">{title}</span>
      </div>
      <p className="text-slate-900 font-medium text-sm ml-8">{detail}</p>
      <p className="text-slate-400 text-xs ml-8">{sub}</p>
    </div>
  );
}
