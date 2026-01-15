"use client";

import React, { useState } from "react";
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

export default function CrearEmpleoPage() {
  const [salaryRange, setSalaryRange] = useState([800, 2500]);

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mt-6">
        Publicar Nuevo Empleo
      </h1>
      <p className="text-gray-500 mb-8">
        Completa la información para encontrar al candidato ideal.
      </p>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Título del Empleo
              </label>
              <Input
                placeholder="Ej. Desarrollador Senior React"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Ciudad
              </label>
              <Select>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Seleccionar Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quito">Quito</SelectItem>
                  <SelectItem value="guayaquil">Guayaquil</SelectItem>
                  <SelectItem value="cuenca">Cuenca</SelectItem>
                  <SelectItem value="ambato">Ambato</SelectItem>
                  <SelectItem value="manta">Manta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Modality */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Modalidad
              </label>
              <Select>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Seleccionar Modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="remoto">Remoto</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
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
                placeholder="Describe las responsabilidades, requisitos técnicos, habilidades blandas y beneficios..."
                className="min-h-[200px] bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button variant="outline" type="button" className="cursor-pointer">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white min-w-[150px] cursor-pointer"
            >
              Publicar Empleo
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
