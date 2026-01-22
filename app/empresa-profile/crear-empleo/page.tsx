"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DatePicker } from "@/components/ui/date-picker";
import { fetchApi } from "@/lib/apiClient";
import { CatalogsByType } from "@/types/search";
import { crearEmpleoFilters } from "@/lib/company/formFields";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { GenericResponse } from "@/types/user";

export default function CrearEmpleoPage() {
  const { data: session } = useSession();
  const [salaryRange, setSalaryRange] = useState([800, 2500]);
  const [closingDate, setClosingDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [cities, setCities] = useState<CatalogsByType[]>([]);
  const [cityValue, setCityValue] = useState<string>("");
  const [modalities, setModalities] = useState<CatalogsByType[]>([]);
  const [modalityValue, setModalityValue] = useState<string>("");
  const [experiences, setExperiences] = useState<CatalogsByType[]>([]);
  const [experienceValue, setExperienceValue] = useState<string>("");
  const [educationLevels, setEducationLevels] = useState<CatalogsByType[]>([]);
  const [educationValue, setEducationValue] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [requirements, setRequirements] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCatalogs = async () => {
      const catalogs = await crearEmpleoFilters();
      if (!active || !catalogs) return;
      
      setCities(catalogs.ciudad ?? []);
      setModalities(catalogs.modalidad_trabajo ?? []);
      setExperiences(catalogs.experiencia ?? []);
      setEducationLevels(catalogs.nivel_estudio ?? []);
    };

    void loadCatalogs();
    return () => {
      active = false;
    };
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRequirements("");
    setCityValue("");
    setModalityValue("");
    setExperienceValue("");
    setEducationValue("");
    setClosingDate(undefined);
    setStartDate(new Date());
    setSalaryRange([800, 2500]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session?.user?.idEmpresa) {
      toast.error("No se pudo obtener la información de la empresa. Por favor, inicia sesión nuevamente.");
      return;
    }

    if (!title || !description || !requirements) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    if (!cityValue || !modalityValue || !experienceValue || !educationValue) {
      toast.error("Selecciona todas las opciones requeridas.");
      return;
    }

    if (!startDate || !closingDate) {
      toast.error("Las fechas de inicio y cierre son obligatorias.");
      return;
    }

    if (closingDate.getTime() <= startDate.getTime()) {
      toast.error("La fecha de cierre debe ser mayor que la fecha de inicio.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      idEmpresa: session.user.idEmpresa,
      tituloPuesto: title,
      descripcion: description,
      requisitos: requirements,
      salarioBase: salaryRange[0],
      salarioMaximo: salaryRange[1],
      fechaInicio: startDate.toISOString(),
      fechaCierre: closingDate.toISOString(),
      idModalidadTrabajo: Number(modalityValue),
      idCiudad: Number(cityValue),
      idNivelEstudio: Number(educationValue),
      idExperiencia: Number(experienceValue),
    };

    const response = await fetchApi<GenericResponse<any>>("/Jobs/addVacante", {
      method: "POST",
      body: payload,
      token: session.user.accessToken,
    });

    if (response?.isSuccess) {
      toast.success("¡Empleo publicado exitosamente!");
      resetForm();
    } else {
      toast.error(response?.messages?.join("\n") || "Hubo un problema al publicar el empleo. Intenta nuevamente.");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mt-6">
        Publicar Nuevo Empleo
      </h1>
      <p className="text-gray-500 mb-8">
        Completa la información para encontrar al candidato ideal.
      </p>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Título del Empleo
              </label>
              <Input
                placeholder="Ej. Desarrollador Senior React"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Ciudad
              </label>
              <Select value={cityValue} onValueChange={setCityValue}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Seleccionar Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.idCatalogo} value={String(city.idCatalogo)}>
                      {city.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Modality */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Modalidad
              </label>
              <Select value={modalityValue} onValueChange={setModalityValue}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Seleccionar Modalidad" />
                </SelectTrigger>
                <SelectContent>
                  {modalities.map((modality) => (
                    <SelectItem
                      key={modality.idCatalogo}
                      value={String(modality.idCatalogo)}
                    >
                      {modality.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Experiencia
              </label>
              <Select value={experienceValue} onValueChange={setExperienceValue}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Seleccionar experiencia" />
                </SelectTrigger>
                <SelectContent>
                  {experiences.map((exp) => (
                    <SelectItem key={exp.idCatalogo} value={String(exp.idCatalogo)}>
                      {exp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nivel de Estudio
              </label>
              <Select value={educationValue} onValueChange={setEducationValue}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level.idCatalogo} value={String(level.idCatalogo)}>
                      {level.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Fecha de Inicio
              </label>
              <DatePicker
                value={startDate}
                onChange={(d) => d && setStartDate(d)}
              />
            </div>

            {/* Closing Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Fecha de Cierre
              </label>
              <DatePicker
                value={closingDate}
                onChange={setClosingDate}
              />
            </div>

            {/* Salary */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Rango Salarial (Mensual): ${salaryRange[0]} - ${salaryRange[1]}
              </label>
              <Slider
                min={400}
                max={5000}
                step={50}
                value={salaryRange}
                onValueChange={setSalaryRange}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$400</span>
                <span>$5000+</span>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Descripción del Puesto
              </label>
              <Textarea
                placeholder="Describe de forma clara las responsabilidades del puesto."
                className="min-h-[200px] bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Requisitos
              </label>
              <Textarea
                placeholder="Describe de forma clara los requisitos del puesto."
                className="min-h-[200px] bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button 
              variant="outline" 
              type="button" 
              className="cursor-pointer"
              onClick={resetForm}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white min-w-[150px] cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publicando..." : "Publicar Empleo"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
