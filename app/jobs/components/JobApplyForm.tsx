import { Card } from "@/components/ui/card";
import React, { useState } from "react";

interface JobApplyFormProps {
  onSuccess?: () => void;
}

export default function JobApplyForm({ onSuccess }: JobApplyFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cv: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!form.email.trim()) newErrors.email = "El correo es obligatorio.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Correo inválido.";
    if (form.cv && !/^https?:\/\/.+/.test(form.cv))
      newErrors.cv = "El enlace debe ser una URL válida.";
    return newErrors;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
      return;
    }
    setSuccess(true);
    setForm({ name: "", email: "", cv: "", message: "" });
    setErrors({});
    if (onSuccess) onSuccess();
  }

  return (
    <Card className="px-6">
      <h2 className="section-title">Formulario de aplicación</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-500  mb-1"
          >
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
              errors.name ? "border-red-500" : ""
            }`}
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span className="text-xs text-red-600">{errors.name}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-500  mb-1"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
              errors.email ? "border-red-500" : ""
            }`}
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="text-xs text-red-600">{errors.email}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="cv"
            className="block text-sm font-medium text-gray-500  mb-1"
          >
            Enlace a tu CV o portafolio
          </label>
          <input
            type="url"
            id="cv"
            name="cv"
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
              errors.cv ? "border-red-500" : ""
            }`}
            value={form.cv}
            onChange={handleChange}
          />
          {errors.cv && (
            <span className="text-xs text-red-600">{errors.cv}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-500  mb-1"
          >
            Mensaje adicional
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            placeholder="¿Por qué te interesa este puesto?"
            value={form.message}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Enviar aplicación
        </button>
        {success && (
          <div className="mt-4 text-green-700 font-semibold">
            ¡Tu aplicación ha sido enviada exitosamente!
          </div>
        )}
      </form>
    </Card>
  );
}
