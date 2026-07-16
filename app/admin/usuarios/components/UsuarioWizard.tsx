"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
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
import { SearchAutocomplete } from "@/components/ui/search-autocomplete";
import { cn } from "@/lib/utils";
import { AdminUsuarioCreateRequest } from "@/types/admin";
import { CompanySignUpData } from "@/types/company";
import { CatalogsByType } from "@/types/search";
import { SignupData } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Eye,
  FileText,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  UserRoundPlus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
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

const adminSchema = z
  .object({
    nombres: z.string().min(1, "Nombre requerido"),
    apellidos: z.string().min(1, "Apellido requerido"),
    idTipoDocumento: z.number().min(1, "Selecciona un tipo de documento"),
    documento: z.string().min(1, "Ingresa el documento"),
    idGenero: z.number().optional(),
    telefono: z.string().optional(),
    email: z.string().email("Email inválido"),
    idRoles: z.array(z.string()).min(1, "Selecciona al menos un rol administrativo"),
    password: z
      .string()
      .min(8, "La contraseña debe tener mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&#).",
      ),
    repeatPassword: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Las contraseñas no coinciden",
  });

type PostulanteFormData = z.infer<typeof postulanteSchema>;
type EmpresaFormData = z.infer<typeof empresaSchema>;
type AdminFormData = z.infer<typeof adminSchema>;

export type UsuarioWizardSubmitData =
  | { tipoUsuario: "candidato"; data: SignupData }
  | { tipoUsuario: "empresa"; data: CompanySignUpData }
  | { tipoUsuario: "admin"; data: AdminUsuarioCreateRequest };

interface UsuarioWizardProps {
  onSubmit: (data: UsuarioWizardSubmitData) => void;
  onCancel: () => void;
  loading?: boolean;
  tipoDocumentoOptions: CatalogsByType[];
  generoOptions: CatalogsByType[];
  ciudadOptions: CatalogsByType[];
  condicionFiscalOptions: CatalogsByType[];
  industriaOptions: CatalogsByType[];
  cantidadEmpleadosOptions: CatalogsByType[];
  roles: { idRol: string; nombre: string }[];
}

type UserType = "postulante" | "empresa" | "admin" | null;
type StepStatus = "complete" | "current" | "upcoming";

const postulanteSteps = [
  "Tipo",
  "Identidad",
  "Contacto",
  "Acceso",
] as const;

const empresaSteps = [
  "Tipo",
  "Empresa",
  "Dirección",
  "Perfil",
  "Administrador",
] as const;

const adminSteps = [
  "Tipo",
  "Identidad",
  "Rol y acceso",
] as const;

const postulanteStepFields: Record<number, FieldPath<PostulanteFormData>[]> = {
  2: [
    "nombres",
    "apellidos",
    "idTipoDocumento",
    "documento",
    "idGenero",
    "fechaNacimiento",
  ],
  3: ["telefono", "telefonoMobil", "email"],
  4: [
    "password",
    "confirmPassword",
    "aceptaCondicionesUso",
    "aceptaPoliticaPrivacidad",
    "aceptaNotificaciones",
  ],
};

const empresaStepFields: Record<number, FieldPath<EmpresaFormData>[]> = {
  2: ["nombreEmpresa", "razonSocial", "idCondicionFiscal", "documento"],
  3: ["idCiudad", "codigoPostal", "calle", "numeroCasa", "telefono"],
  4: ["idIndustria", "idCantidadEmpleados", "sitioWeb"],
  5: [
    "nombres",
    "apellidos",
    "idGenero",
    "email",
    "password",
    "repeatPassword",
    "aceptaTerminoCondiciones",
    "quieroRecibirNewsLetter",
    "quieroParticiparEncuestas",
  ],
};

const adminStepFields: Record<number, FieldPath<AdminFormData>[]> = {
  2: ["nombres", "apellidos", "idTipoDocumento", "documento", "idGenero", "telefono"],
  3: ["email", "idRoles", "password", "repeatPassword"],
};

const renderSectionHeader = (
  icon: ReactNode,
  title: string,
  description: string,
) => (
  <div className="mb-6 flex items-start gap-3">
    <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  </div>
);

export default function UsuarioWizard({
  onSubmit,
  onCancel,
  loading = false,
  tipoDocumentoOptions,
  generoOptions,
  ciudadOptions,
  condicionFiscalOptions,
  industriaOptions,
  cantidadEmpleadosOptions,
  roles,
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

  const adminForm = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      idTipoDocumento: 0,
      documento: "",
      telefono: "",
      email: "",
      idRoles: [],
      password: "",
      repeatPassword: "",
    },
  });

  const steps =
    userType === "postulante"
      ? postulanteSteps
      : userType === "empresa"
        ? empresaSteps
        : userType === "admin"
          ? adminSteps
          : (["Tipo"] as const);
  const totalSteps = steps.length;
  const adminRoles = roles.filter(
    (role) =>
      role.nombre.toLowerCase() !== "postulante" &&
      role.nombre.toLowerCase() !== "administrador empresa" &&
      role.nombre.toLowerCase() !== "administrador de empresa",
  );

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setCurrentStep(2);
  };

  const handleNext = async () => {
    if (userType === "postulante") {
      const isValid = await postulanteForm.trigger(
        postulanteStepFields[currentStep] ?? [],
      );
      if (isValid) {
        setCurrentStep((step) => step + 1);
      }
    } else if (userType === "empresa") {
      const isValid = await empresaForm.trigger(
        empresaStepFields[currentStep] ?? [],
      );
      if (isValid) {
        setCurrentStep((step) => step + 1);
      }
    } else if (userType === "admin") {
      const isValid = await adminForm.trigger(
        adminStepFields[currentStep] ?? [],
      );
      if (isValid) {
        setCurrentStep((step) => step + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setUserType(null);
      setCurrentStep(1);
    } else if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (userType === "postulante") {
      const isValid = await postulanteForm.trigger();
      if (!isValid) return;
      const data = postulanteForm.getValues();
      onSubmit({
        tipoUsuario: "candidato",
        data: {
          nombres: data.nombres,
          apellidos: data.apellidos,
          idTipoDocumento: data.idTipoDocumento,
          documento: data.documento,
          idGenero: data.idGenero,
          telefono: data.telefono,
          telefonoMobil: data.telefonoMobil,
          fechaNacimiento: data.fechaNacimiento.toISOString(),
          email: data.email,
          password: data.password,
          aceptaCondicionesUso: data.aceptaCondicionesUso,
          aceptaPoliticaPrivacidad: data.aceptaPoliticaPrivacidad,
          aceptaNotificaciones: data.aceptaNotificaciones,
        },
      });
    } else if (userType === "empresa") {
      const isValid = await empresaForm.trigger();
      if (!isValid) return;
      const data = empresaForm.getValues();
      onSubmit({
        tipoUsuario: "empresa",
        data: {
          nombreEmpresa: data.nombreEmpresa,
          razonSocial: data.razonSocial,
          idCondicionFiscal: data.idCondicionFiscal,
          documento: data.documento,
          idCiudad: data.idCiudad,
          calle: data.calle,
          numeroCasa: data.numeroCasa,
          codigoPostal: data.codigoPostal,
          telefono: data.telefono,
          idIndustria: data.idIndustria,
          idCantidadEmpleados: data.idCantidadEmpleados,
          sitioWeb: data.sitioWeb ?? "",
          nombres: data.nombres,
          apellidos: data.apellidos,
          idGenero: data.idGenero,
          email: data.email,
          password: data.password,
          aceptaTerminoCondiciones: data.aceptaTerminoCondiciones,
          quieroRecibirNewsLetter: data.quieroRecibirNewsLetter,
          quieroParticiparEncuestas: data.quieroParticiparEncuestas,
        },
      });
    } else if (userType === "admin") {
      const isValid = await adminForm.trigger();
      if (!isValid) return;
      const data = adminForm.getValues();
      onSubmit({
        tipoUsuario: "admin",
        data: {
          nombres: data.nombres,
          apellidos: data.apellidos,
          idTipoDocumento: data.idTipoDocumento,
          documento: data.documento,
          idGenero: data.idGenero,
          telefono: data.telefono,
          email: data.email,
          password: data.password,
          idRol: data.idRoles[0] ?? "",
          idRoles: data.idRoles,
        },
      });
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center gap-2 overflow-x-auto px-6 py-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const status: StepStatus =
          stepNumber < currentStep
            ? "complete"
            : stepNumber === currentStep
              ? "current"
              : "upcoming";

        return (
          <div key={label} className="flex min-w-fit items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                status === "complete" &&
                  "border-primary/20 bg-primary/10 text-primary",
                status === "current" &&
                  "border-primary bg-white text-primary shadow-sm",
                status === "upcoming" &&
                  "border-zinc-200 bg-white text-slate-500",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs",
                  status === "complete" && "bg-primary text-white",
                  status === "current" && "bg-primary text-white",
                  status === "upcoming" && "bg-zinc-100 text-slate-500",
                )}
              >
                {status === "complete" ? <Check className="size-3.5" /> : stepNumber}
              </span>
              {label}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  "h-px w-6",
                  stepNumber < currentStep ? "bg-primary/50" : "bg-zinc-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      {renderSectionHeader(
        <UserRoundPlus className="size-5" />,
        "Tipo de cuenta",
        "Elige si crearás un perfil de postulante, una empresa o un usuario administrativo.",
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <button
          type="button"
          className="group flex min-h-[180px] flex-col items-start rounded-md border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          onClick={() => handleUserTypeSelect("postulante")}
        >
          <span className="mb-5 flex size-12 items-center justify-center rounded-md bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-100">
            <User className="size-6" />
          </span>
          <span className="text-lg font-semibold text-slate-950">Postulante</span>
          <span className="mt-2 text-sm leading-6 text-slate-500">
            Crea una cuenta de candidato para búsqueda de empleo, perfil profesional
            y postulaciones.
          </span>
          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary">
            Crear postulante
            <ArrowRight className="size-4" />
          </span>
        </button>

        <button
          type="button"
          className="group flex min-h-[180px] flex-col items-start rounded-md border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          onClick={() => handleUserTypeSelect("empresa")}
        >
          <span className="mb-5 flex size-12 items-center justify-center rounded-md bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-100">
            <Building2 className="size-6" />
          </span>
          <span className="text-lg font-semibold text-slate-950">Empresa</span>
          <span className="mt-2 text-sm leading-6 text-slate-500">
            Registra la empresa, sus datos fiscales y el usuario administrador
            responsable.
          </span>
          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary">
            Crear empresa
            <ArrowRight className="size-4" />
          </span>
        </button>

        <button
          type="button"
          className="group flex min-h-[180px] flex-col items-start rounded-md border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          onClick={() => handleUserTypeSelect("admin")}
        >
          <span className="mb-5 flex size-12 items-center justify-center rounded-md bg-violet-50 text-violet-700 transition-colors group-hover:bg-violet-100">
            <Shield className="size-6" />
          </span>
          <span className="text-lg font-semibold text-slate-950">Administrador</span>
          <span className="mt-2 text-sm leading-6 text-slate-500">
            Crea una cuenta para operar el panel administrativo con un rol y permisos definidos.
          </span>
          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary">
            Crear administrador
            <ArrowRight className="size-4" />
          </span>
        </button>
      </div>
    </div>
  );

  const renderPostulanteStep2 = () => (
    <div className="space-y-6">
      {renderSectionHeader(
        <FileText className="size-5" />,
        "Información personal",
        "Datos básicos de identidad del postulante.",
      )}

      <Form {...postulanteForm}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    {tipoDocumentoOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
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
                    {generoOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
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
                    className="h-10 w-full"
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
      {renderSectionHeader(
        <Phone className="size-5" />,
        "Información de contacto",
        "Canales donde el candidato recibirá notificaciones y seguimiento.",
      )}

      <Form {...postulanteForm}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              <FormItem className="lg:col-span-2">
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
      {renderSectionHeader(
        <LockKeyhole className="size-5" />,
        "Credenciales y preferencias",
        "Define la contraseña inicial y las autorizaciones de comunicación.",
      )}

      <Form {...postulanteForm}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                        <Eye className="size-4 text-slate-400" />
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
      {renderSectionHeader(
        <Building2 className="size-5" />,
        "Información de la empresa",
        "Datos comerciales y fiscales principales.",
      )}

      <Form {...empresaForm}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    {condicionFiscalOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
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
      {renderSectionHeader(
        <MapPin className="size-5" />,
        "Dirección y contacto",
        "Ubicación y teléfono principal de la empresa.",
      )}

      <Form {...empresaForm}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={empresaForm.control}
            name="idCiudad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad *</FormLabel>
                <FormControl>
                  <SearchAutocomplete<number>
                    options={ciudadOptions.map((item) => ({
                      id: item.idCatalogo,
                      label: item.nombre,
                    }))}
                    value={field.value || undefined}
                    onChange={(id) => field.onChange(id)}
                    placeholder="Selecciona ciudad"
                    searchPlaceholder="Buscar ciudad..."
                  />
                </FormControl>
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
              <FormItem className="lg:col-span-2">
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
      {renderSectionHeader(
        <BadgeCheck className="size-5" />,
        "Perfil de la empresa",
        "Clasificación de industria, tamaño y presencia web.",
      )}

      <Form {...empresaForm}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    {industriaOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
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
                    {cantidadEmpleadosOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
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
              <FormItem className="lg:col-span-2">
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
      {renderSectionHeader(
        <Mail className="size-5" />,
        "Usuario administrador",
        "Persona que administrará la cuenta de empresa.",
      )}

      <Form {...empresaForm}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    {generoOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
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
                      <Eye className="size-4 text-slate-400" />
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

  const renderAdminStep2 = () => (
    <div className="space-y-6">
      {renderSectionHeader(
        <Shield className="size-5" />,
        "Información del administrador",
        "Datos básicos para identificar al usuario dentro del panel administrativo.",
      )}

      <Form {...adminForm}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={adminForm.control}
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
            control={adminForm.control}
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
            control={adminForm.control}
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
                    {tipoDocumentoOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={adminForm.control}
            name="documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento *</FormLabel>
                <FormControl>
                  <Input placeholder="Número de documento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={adminForm.control}
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
                    {generoOptions.map((item) => (
                      <SelectItem key={item.idCatalogo} value={item.idCatalogo.toString()}>
                        {item.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={adminForm.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="0999999999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );

  const renderAdminStep3 = () => (
    <div className="space-y-6">
      {renderSectionHeader(
        <LockKeyhole className="size-5" />,
        "Rol y acceso",
        "Define el rol administrativo que controlará el menú y los permisos disponibles.",
      )}

      <Form {...adminForm}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={adminForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="admin@portalempleo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={adminForm.control}
            name="idRoles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roles administrativos *</FormLabel>
                <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border border-zinc-200 p-3">
                  {adminRoles.map((role) => {
                    const checked = field.value?.includes(role.idRol);

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
                                ? [...current, role.idRol]
                                : current.filter((id) => id !== role.idRol),
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
            control={adminForm.control}
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
                      <Eye className="size-4 text-slate-400" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={adminForm.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña *</FormLabel>
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
    } else if (userType === "admin") {
      switch (currentStep) {
        case 2: return renderAdminStep2();
        case 3: return renderAdminStep3();
        default: return null;
      }
    }
    return null;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="border-b border-zinc-100 bg-zinc-50/80">
        {renderStepIndicator()}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        {renderCurrentStep()}
      </div>

      <div className="flex items-center justify-between border-t border-zinc-100 bg-white px-6 py-4">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : handleBack}
            disabled={loading}
          >
            <ArrowLeft className="size-4 mr-2" />
            {currentStep === 1 ? "Cancelar" : "Atrás"}
          </Button>

          {currentStep === 1 ? (
            <p className="text-sm text-slate-500">
              Selecciona una opción para continuar.
            </p>
          ) : currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={loading}>
              Siguiente
              <ArrowRight className="size-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleFinalSubmit} disabled={loading}>
              {loading ? "Creando..." : "Crear usuario"}
            </Button>
          )}
      </div>
    </div>
  );
}
