"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsuarioFormData } from "@/lib/admin/adminUsuarios";
import { validarCedulaEcuatoriana } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Eye,
  User,
  UserRoundPlus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema para postulante
const postulanteSchema = z
  .object({
    nombres: z.string().min(1, "Nombre requerido"),
    apellidos: z.string().min(1, "Apellido requerido"),
    idTipoDocumento: z.number().min(1, "Selecciona un tipo de documento"),
    documento: z.string().min(1, "Ingresa el documento"),
    idGenero: z.number().min(1, "Selecciona un género"),
    telefono: z.string().min(1, "Ingresa un teléfono válido"),
    telefonoMobil: z.string().min(7, "El celular debe tener al menos 7 dígitos"),
    fechaNacimiento: z.date("Selecciona una fecha"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&#)."
      ),
    confirmPassword: z.string().min(8, "Repite la contraseña"),
    aceptaCondicionesUso: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar las condiciones"),
    aceptaPoliticaPrivacidad: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar la política"),
    aceptaNotificaciones: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    const CEDULA = 3580;
    if (data.idTipoDocumento === CEDULA) {
      if (!validarCedulaEcuatoriana(data.documento)) {
        ctx.addIssue({
          path: ["documento"],
          message: "Cédula inválida.",
          code: "custom",
        });
      }
    }
  });

// Schema para empresa
const empresaSchema = z
  .object({
    nombreEmpresa: z.string().min(1, "Nombre de la empresa requerido"),
    razonSocial: z.string().min(1, "Razón social requerida"),
    idCondicionFiscal: z.number().min(1, "Selecciona una condición fiscal"),
    documento: z
      .string()
      .min(1, "Documento requerido")
      .regex(/^\d+$/, "Documento solo debe contener números"),
    idCiudad: z.number().min(1, "Selecciona una ciudad"),
    calle: z.string().min(1, "Calle requerida"),
    numeroCasa: z.string().min(1, "Número Casa requerido"),
    codigoPostal: z.string()
      .min(1, "Código postal requerido")
      .regex(/^\d+$/, "Código postal solo debe contener números"),
    telefono: z.string().min(1, "Ingresa un teléfono válido"),
    idIndustria: z.number().min(1, "Selecciona una industria"),
    idCantidadEmpleados: z.number().min(1, "Selecciona cantidad de empleados"),
    sitioWeb: z.string().url("Ingresa una URL válida").optional().or(z.literal("")),
    nombres: z.string().min(1, "Nombre requerido"),
    apellidos: z.string().min(1, "Apellido requerido"),
    idGenero: z.number().optional(),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&#)."
      ),
    repeatPassword: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
    aceptaTerminoCondiciones: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar los términos"),
    quieroRecibirNewsLetter: z.boolean(),
    quieroParticiparEncuestas: z.boolean(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Las contraseñas no coinciden",
  });

type PostulanteFormData = z.infer<typeof postulanteSchema>;
type EmpresaFormData = z.infer<typeof empresaSchema>;

interface UsuarioWizardProps {
  onSubmit: (data: UsuarioFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

type UserType = "postulante" | "empresa" | null;

export default function UsuarioWizard({
  onSubmit,
  onCancel,
  loading = false,
}: UsuarioWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form para postulante
  const postulanteForm = useForm<PostulanteFormData>({
    resolver: zodResolver(postulanteSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      idTipoDocumento: 0,
      documento: "",
      idGenero: 0,
      telefono: "",
      telefonoMobil: "",
      email: "",
      password: "",
      confirmPassword: "",
      aceptaCondicionesUso: false,
      aceptaPoliticaPrivacidad: false,
      aceptaNotificaciones: false,
    },
  });

  // Form para empresa
  const empresaForm = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      nombreEmpresa: "",
      razonSocial: "",
      idCondicionFiscal: 0,
      documento: "",
      idCiudad: 0,
      calle: "",
      numeroCasa: "",
      codigoPostal: "",
      telefono: "",
      idIndustria: 0,
      idCantidadEmpleados: 0,
      sitioWeb: "",
      nombres: "",
      apellidos: "",
      email: "",
      password: "",
      repeatPassword: "",
      aceptaTerminoCondiciones: false,
      quieroRecibirNewsLetter: false,
      quieroParticiparEncuestas: false,
    },
  });

  const totalSteps = userType === "postulante" ? 4 : userType === "empresa" ? 5 : 1;

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setCurrentStep(2);
  };

  const handleNext = async () => {
    if (userType === "postulante") {
      const isValid = await postulanteForm.trigger();
      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    } else if (userType === "empresa") {
      const isValid = await empresaForm.trigger();
      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (userType === "postulante") {
      const data = postulanteForm.getValues();
      const usuarioData: UsuarioFormData = {
        nombreCompleto: `${data.nombres} ${data.apellidos}`,
        email: data.email,
        rol: "postulante",
        tipoUsuario: "candidato",
        estado: "activo",
      };
      onSubmit(usuarioData);
    } else if (userType === "empresa") {
      const data = empresaForm.getValues();
      const usuarioData: UsuarioFormData = {
        nombreCompleto: `${data.nombres} ${data.apellidos} (${data.nombreEmpresa})`,
        email: data.email,
        rol: "administrador empresa",
        tipoUsuario: "empresa",
        estado: "activo",
      };
      onSubmit(usuarioData);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i + 1 <= currentStep
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {i + 1 <= currentStep ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-12 h-0.5 mx-2 ${
                i + 1 < currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">¿Qué tipo de usuario deseas crear?</h3>
        <p className="text-gray-600">Selecciona el tipo de cuenta que mejor se ajuste a tus necesidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            userType === "postulante" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleUserTypeSelect("postulante")}
        >
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h4 className="font-semibold mb-2">Postulante</h4>
            <p className="text-sm text-gray-600">
              Para personas que buscan empleo y oportunidades laborales
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            userType === "empresa" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleUserTypeSelect("empresa")}
        >
          <CardContent className="p-6 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h4 className="font-semibold mb-2">Empresa</h4>
            <p className="text-sm text-gray-600">
              Para empresas que buscan publicar ofertas de trabajo
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPostulanteStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Información Personal</h3>
      </div>

      <Form {...postulanteForm}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={postulanteForm.control}
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre(s) *</FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa tu nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={postulanteForm.control}
            name="apellidos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido(s) *</FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa tu apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={postulanteForm.control}
            name="idTipoDocumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de documento *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="3580">Cédula</SelectItem>
                    <SelectItem value="3581">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={postulanteForm.control}
            name="documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Número de documento"
                    maxLength={10}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={postulanteForm.control}
            name="idGenero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Género *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona género" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Masculino</SelectItem>
                    <SelectItem value="2">Femenino</SelectItem>
                    <SelectItem value="3">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={postulanteForm.control}
            name="fechaNacimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento *</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );

  const renderPostulanteStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Información de Contacto</h3>
      </div>

      <Form {...postulanteForm}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={postulanteForm.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="02375293123"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={postulanteForm.control}
            name="telefonoMobil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono Móvil</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0991234567"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={postulanteForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="usuario@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );

  const renderPostulanteStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Credenciales y Preferencias</h3>
      </div>

      <Form {...postulanteForm}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={postulanteForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={postulanteForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña *</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Repite la contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <FormField
              control={postulanteForm.control}
              name="aceptaCondicionesUso"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      Acepto los términos y condiciones de uso *
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={postulanteForm.control}
              name="aceptaPoliticaPrivacidad"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      Acepto la política de privacidad *
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={postulanteForm.control}
              name="aceptaNotificaciones"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      Quiero recibir notificaciones por email
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  );

  const renderEmpresaStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Información de la Empresa</h3>
      </div>

      <Form {...empresaForm}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={empresaForm.control}
            name="nombreEmpresa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la Empresa *</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre comercial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="razonSocial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón Social *</FormLabel>
                <FormControl>
                  <Input placeholder="Razón social legal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="idCondicionFiscal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condición Fiscal *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona condición" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Responsable Inscripto</SelectItem>
                    <SelectItem value="2">Monotributista</SelectItem>
                    <SelectItem value="3">Exento</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUC/CUIT *</FormLabel>
                <FormControl>
                  <Input placeholder="Número de documento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );

  const renderEmpresaStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Dirección y Contacto</h3>
      </div>

      <Form {...empresaForm}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={empresaForm.control}
            name="idCiudad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona ciudad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Quito</SelectItem>
                    <SelectItem value="2">Guayaquil</SelectItem>
                    <SelectItem value="3">Cuenca</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="codigoPostal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal *</FormLabel>
                <FormControl>
                  <Input placeholder="170101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="calle"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Calle *</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección completa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="numeroCasa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="02375293123"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );

  const renderEmpresaStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Información Adicional</h3>
      </div>

      <Form {...empresaForm}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={empresaForm.control}
            name="idIndustria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industria *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona industria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Tecnología</SelectItem>
                    <SelectItem value="2">Finanzas</SelectItem>
                    <SelectItem value="3">Salud</SelectItem>
                    <SelectItem value="4">Educación</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="idCantidadEmpleados"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad de Empleados *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona rango" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1-10</SelectItem>
                    <SelectItem value="2">11-50</SelectItem>
                    <SelectItem value="3">51-200</SelectItem>
                    <SelectItem value="4">201+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="sitioWeb"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Sitio Web (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.empresa.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );

  const renderEmpresaStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Información del Administrador</h3>
      </div>

      <Form {...empresaForm}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={empresaForm.control}
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre(s) *</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del administrador" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="apellidos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido(s) *</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido del administrador" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="idGenero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Género (opcional)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona género" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Masculino</SelectItem>
                    <SelectItem value="2">Femenino</SelectItem>
                    <SelectItem value="3">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="admin@empresa.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña *</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repite la contraseña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3 mt-6">
          <FormField
            control={empresaForm.control}
            name="aceptaTerminoCondiciones"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">
                    Acepto los términos y condiciones *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="quieroRecibirNewsLetter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">
                    Quiero recibir el newsletter
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={empresaForm.control}
            name="quieroParticiparEncuestas"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">
                    Quiero participar en encuestas
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );

  const renderCurrentStep = () => {
    if (currentStep === 1) return renderStep1();
    if (userType === "postulante") {
      switch (currentStep) {
        case 2: return renderPostulanteStep2();
        case 3: return renderPostulanteStep3();
        case 4: return renderPostulanteStep4();
        default: return null;
      }
    } else if (userType === "empresa") {
      switch (currentStep) {
        case 2: return renderEmpresaStep2();
        case 3: return renderEmpresaStep3();
        case 4: return renderEmpresaStep4();
        case 5: return renderEmpresaStep5();
        default: return null;
      }
    }
    return null;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <UserRoundPlus className="w-6 h-6 text-primary" />
          Crear Nuevo Usuario
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {renderStepIndicator()}
        {renderCurrentStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : handleBack}
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? "Cancelar" : "Atrás"}
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={loading}>
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleFinalSubmit} disabled={loading}>
              {loading ? "Creando..." : "Crear Usuario"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}