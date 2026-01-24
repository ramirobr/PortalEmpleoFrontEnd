"use client";

import { CompanyProfileData } from "@/types/company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CatalogsByType } from "@/types/search";
import {
  Building2,
  Globe,
  Users,
  Briefcase,
  CheckCircle,
  MapPin,
  Phone,
  FileText,
  Mail,
  User,
  UserCheck,
  Calendar,
  Pencil,
  Camera,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/apiClient";
import { getCompanyLogo } from "@/lib/company/profile";

interface CompanyProfileViewProps {
  profile: CompanyProfileData;
  estadoOptions?: CatalogsByType[];
  condicionFiscalOptions?: CatalogsByType[];
  industriaOptions?: CatalogsByType[];
  cantidadEmpleadosOptions?: CatalogsByType[];
  ciudadOptions?: CatalogsByType[];
  generoOptions?: CatalogsByType[];
}

// Función auxiliar para convertir archivo a base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function CompanyProfileView({
  profile,
  estadoOptions = [],
  condicionFiscalOptions = [],
  industriaOptions = [],
  cantidadEmpleadosOptions = [],
  ciudadOptions = [],
  generoOptions = [],
}: CompanyProfileViewProps) {
  const { data: session } = useSession();
  const [companyData, setCompanyData] = useState(profile);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [isLoadingLogo, setIsLoadingLogo] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch logo on mount
  useEffect(() => {
    const fetchLogo = async () => {
      if (!companyData.idEmpresa || !session?.user.accessToken) {
        setIsLoadingLogo(false);
        return;
      }
      try {
        const logoData = await getCompanyLogo(companyData.idEmpresa, session.user.accessToken);
        if (logoData) {
          setLogoPreview(logoData);
        }
      } catch (error) {
        console.error("Error fetching company logo:", error);
      } finally {
        setIsLoadingLogo(false);
      }
    };
    fetchLogo();
  }, [companyData.idEmpresa, session?.user.accessToken]);

  // Form states for general info
  const [generalForm, setGeneralForm] = useState({
    nombre: companyData.nombre,
    razonSocial: companyData.razonSocial,
    idCondicionFiscal: companyData.condicionFiscal?.id || 0,
    numeroDocumento: companyData.numeroDocumento || "",
    idIndustria: companyData.industria?.id || 0,
    idCantidadEmpleados: companyData.cantidadEmpleados?.id || 0,
    sitioWeb: companyData.sitioWeb || "",
    idEstadoEmpresa: companyData.estado?.id || 0,
  });

  // Form states for contact info
  const [contactForm, setContactForm] = useState({
    correoContacto: companyData.correoContacto || "",
    telefonoContacto: companyData.telefonoContacto || "",
    direccion: companyData.direccion || "",
    idCiudad: companyData.ciudad?.id || 0,
  });

  // Form states for admin info
  const [adminForm, setAdminForm] = useState({
    nombre: companyData.usuarioAdministrador?.nombre || "",
    apellido: companyData.usuarioAdministrador?.apellido || "",
    correoElectronico: companyData.usuarioAdministrador?.correoElectronico || "",
    telefono: companyData.usuarioAdministrador?.telefono || "",
    telefonoMovil: companyData.usuarioAdministrador?.telefonoMovil || "",
    idGenero: companyData.usuarioAdministrador?.genero?.id || 0,
  });

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      const response = await fetchApi(`/Company/update-general-info`, {
        method: "PUT",
        body: {
          idEmpresa: companyData.idEmpresa,
          nombre: generalForm.nombre,
          razonSocial: generalForm.razonSocial,
          idCondicionFiscal: generalForm.idCondicionFiscal,
          numeroDocumento: generalForm.numeroDocumento,
          idIndustria: generalForm.idIndustria,
          idCantidadEmpleados: generalForm.idCantidadEmpleados,
          sitioWeb: generalForm.sitioWeb,
          idEstadoEmpresa: generalForm.idEstadoEmpresa,
        },
        token: session?.user.accessToken,
      });
      if (response) {
        const selectedEstado = estadoOptions.find((e) => e.idCatalogo === generalForm.idEstadoEmpresa);
        const selectedCondicionFiscal = condicionFiscalOptions.find((e) => e.idCatalogo === generalForm.idCondicionFiscal);
        const selectedIndustria = industriaOptions.find((e) => e.idCatalogo === generalForm.idIndustria);
        const selectedCantidadEmpleados = cantidadEmpleadosOptions.find((e) => e.idCatalogo === generalForm.idCantidadEmpleados);
        
        setCompanyData({
          ...companyData,
          nombre: generalForm.nombre,
          razonSocial: generalForm.razonSocial,
          numeroDocumento: generalForm.numeroDocumento,
          sitioWeb: generalForm.sitioWeb,
          estado: selectedEstado
            ? { id: selectedEstado.idCatalogo, nombre: selectedEstado.nombre }
            : companyData.estado,
          condicionFiscal: selectedCondicionFiscal
            ? { id: selectedCondicionFiscal.idCatalogo, nombre: selectedCondicionFiscal.nombre }
            : companyData.condicionFiscal,
          industria: selectedIndustria
            ? { id: selectedIndustria.idCatalogo, nombre: selectedIndustria.nombre }
            : companyData.industria,
          cantidadEmpleados: selectedCantidadEmpleados
            ? { id: selectedCantidadEmpleados.idCatalogo, nombre: selectedCantidadEmpleados.nombre }
            : companyData.cantidadEmpleados,
        });
        setIsEditingGeneral(false);
        toast.success("Información actualizada correctamente");
      }
    } catch {
      toast.error("Error al actualizar la información");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContact = async () => {
    setIsSaving(true);
    try {
      const response = await fetchApi(`/Company/update-contact-info`, {
        method: "PUT",
        body: {
          idEmpresa: companyData.idEmpresa,
          correoContacto: contactForm.correoContacto,
          telefonoContacto: contactForm.telefonoContacto,
          direccion: contactForm.direccion,
          idCiudad: contactForm.idCiudad,
        },
        token: session?.user.accessToken,
      });
      if (response) {
        const selectedCiudad = ciudadOptions.find((c) => c.idCatalogo === contactForm.idCiudad);
        setCompanyData({
          ...companyData,
          correoContacto: contactForm.correoContacto,
          telefonoContacto: contactForm.telefonoContacto,
          direccion: contactForm.direccion,
          ciudad: selectedCiudad
            ? { id: selectedCiudad.idCatalogo, nombre: selectedCiudad.nombre }
            : companyData.ciudad,
        });
        setIsEditingContact(false);
        toast.success("Contacto actualizado correctamente");
      }
    } catch {
      toast.error("Error al actualizar el contacto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAdmin = async () => {
    setIsSaving(true);
    try {
      const response = await fetchApi(`/Company/update-admin-user`, {
        method: "PUT",
        body: {
          idUsuario: companyData.usuarioAdministrador?.idUsuario,
          nombre: adminForm.nombre,
          apellido: adminForm.apellido,
          correoElectronico: adminForm.correoElectronico,
          telefono: adminForm.telefono,
          telefonoMovil: adminForm.telefonoMovil,
          idGenero: adminForm.idGenero,
        },
        token: session?.user.accessToken,
      });
      if (response) {
        const selectedGenero = generoOptions.find((g) => g.idCatalogo === adminForm.idGenero);
        setCompanyData({
          ...companyData,
          usuarioAdministrador: companyData.usuarioAdministrador
            ? {
                ...companyData.usuarioAdministrador,
                nombre: adminForm.nombre,
                apellido: adminForm.apellido,
                nombreCompleto: `${adminForm.nombre} ${adminForm.apellido}`,
                correoElectronico: adminForm.correoElectronico,
                telefono: adminForm.telefono,
                telefonoMovil: adminForm.telefonoMovil,
                genero: selectedGenero
                  ? { id: selectedGenero.idCatalogo, nombre: selectedGenero.nombre }
                  : companyData.usuarioAdministrador.genero,
              }
            : undefined,
        });
        setIsEditingAdmin(false);
        toast.success("Administrador actualizado correctamente");
      }
    } catch {
      toast.error("Error al actualizar el administrador");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Solo se permiten archivos de imagen");
        return;
      }
      setSelectedLogoFile(file);
      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);
    }
  };

  const handleSaveLogo = async () => {
    if (!selectedLogoFile) return;
    
    setIsSaving(true);
    try {
      const base64Full = await fileToBase64(selectedLogoFile);
      // Remover el prefijo "data:image/...;base64," si existe
      const base64Image = base64Full.includes(",") 
        ? base64Full.split(",")[1] 
        : base64Full;
      
      const response = await fetchApi(`/Company/update-logo`, {
        method: "PUT",
        body: { 
          idEmpresa: companyData.idEmpresa,
          base64Image: base64Image
        },
        token: session?.user.accessToken,
      });
      if (response) {
        // Refetch the logo to get the saved version from server
        const logoData = await getCompanyLogo(companyData.idEmpresa, session?.user.accessToken);
        setLogoPreview(logoData || null);
        setIsEditingLogo(false);
        setSelectedLogoFile(null);
        toast.success("Logo actualizado correctamente");
      }
    } catch {
      toast.error("Error al actualizar el logo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLogo = async () => {
    setIsSaving(true);
    try {
      const response = await fetchApi(`/Company/delete-logo/${companyData.idEmpresa}`, {
        method: "DELETE",
        token: session?.user.accessToken,
      });
      if (response) {
        setCompanyData({ ...companyData, logoUrl: undefined });
        setLogoPreview(null);
        setSelectedLogoFile(null);
        setIsEditingLogo(false);
        toast.success("Logo eliminado correctamente");
      }
    } catch {
      toast.error("Error al eliminar el logo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelLogoEdit = async () => {
    setIsEditingLogo(false);
    setSelectedLogoFile(null);
    // Refetch the logo from API
    if (companyData.idEmpresa && session?.user.accessToken) {
      try {
        const logoData = await getCompanyLogo(companyData.idEmpresa, session.user.accessToken);
        setLogoPreview(logoData || null);
      } catch {
        setLogoPreview(null);
      }
    } else {
      setLogoPreview(null);
    }
  };

  const locationParts = [
    companyData.ciudad?.nombre,
    companyData.provincia?.nombre,
    companyData.pais?.nombre,
  ].filter(Boolean);

  const admin = companyData.usuarioAdministrador;

  return (
    <div className="space-y-4">
      {/* Header con logo y nombre */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Logo editable */}
            <Dialog open={isEditingLogo} onOpenChange={setIsEditingLogo}>
              <DialogTrigger asChild>
                <button
                  className="relative group cursor-pointer"
                  title="Cambiar logo"
                >
                  {isLoadingLogo ? (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : logoPreview ? (
                    <img
                      src={logoPreview}
                      alt={`Logo de ${companyData.nombre}`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cambiar Logo de Empresa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex flex-col items-center gap-4">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Vista previa del logo"
                        className="w-32 h-32 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-lg bg-primary/10 flex items-center justify-center border">
                        <Building2 className="w-16 h-16 text-primary" />
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Seleccionar imagen
                      </Button>
                      {(logoPreview || companyData.logoUrl) && (
                        <Button
                          size="icon"
                          onClick={handleDeleteLogo}
                          disabled={isSaving}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancelLogoEdit}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveLogo}
                      disabled={isSaving || !selectedLogoFile}
                    >
                      {isSaving ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{companyData.nombre}</h1>
                {companyData.estado && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      companyData.estado.nombre === "Activo"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {companyData.estado.nombre}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{companyData.razonSocial}</p>
              {companyData.fechaRegistro && (
                <p className="text-xs text-gray-400 mt-1">
                  Registrada el{" "}
                  {new Date(companyData.fechaRegistro).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de secciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información General */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Información General</CardTitle>
              <Dialog open={isEditingGeneral} onOpenChange={setIsEditingGeneral}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Editar Información General</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre de la empresa</Label>
                      <Input
                        id="nombre"
                        value={generalForm.nombre}
                        onChange={(e) => setGeneralForm({ ...generalForm, nombre: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="razonSocial">Razón social</Label>
                      <Input
                        id="razonSocial"
                        value={generalForm.razonSocial}
                        onChange={(e) => setGeneralForm({ ...generalForm, razonSocial: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroDocumento">Número de documento</Label>
                      <Input
                        id="numeroDocumento"
                        value={generalForm.numeroDocumento}
                        onChange={(e) => setGeneralForm({ ...generalForm, numeroDocumento: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condicionFiscal">Condición fiscal</Label>
                      <Select
                        value={generalForm.idCondicionFiscal.toString()}
                        onValueChange={(value) => setGeneralForm({ ...generalForm, idCondicionFiscal: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una condición fiscal" />
                        </SelectTrigger>
                        <SelectContent>
                          {condicionFiscalOptions.map((opt) => (
                            <SelectItem key={opt.idCatalogo} value={opt.idCatalogo.toString()}>
                              {opt.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industria">Industria</Label>
                      <Select
                        value={generalForm.idIndustria.toString()}
                        onValueChange={(value) => setGeneralForm({ ...generalForm, idIndustria: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una industria" />
                        </SelectTrigger>
                        <SelectContent>
                          {industriaOptions.map((opt) => (
                            <SelectItem key={opt.idCatalogo} value={opt.idCatalogo.toString()}>
                              {opt.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cantidadEmpleados">Cantidad de empleados</Label>
                      <Select
                        value={generalForm.idCantidadEmpleados.toString()}
                        onValueChange={(value) => setGeneralForm({ ...generalForm, idCantidadEmpleados: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          {cantidadEmpleadosOptions.map((opt) => (
                            <SelectItem key={opt.idCatalogo} value={opt.idCatalogo.toString()}>
                              {opt.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sitioWeb">Sitio web</Label>
                      <Input
                        id="sitioWeb"
                        value={generalForm.sitioWeb}
                        onChange={(e) => setGeneralForm({ ...generalForm, sitioWeb: e.target.value })}
                        placeholder="https://"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado de la empresa</Label>
                      <Select
                        value={generalForm.idEstadoEmpresa.toString()}
                        onValueChange={(value) => setGeneralForm({ ...generalForm, idEstadoEmpresa: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estadoOptions.map((estado) => (
                            <SelectItem key={estado.idCatalogo} value={estado.idCatalogo.toString()}>
                              {estado.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditingGeneral(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveGeneral} disabled={isSaving}>
                        {isSaving ? "Guardando..." : "Guardar"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-500">Industria:</span>
              <span className="text-sm font-medium">{companyData.industria?.nombre ?? "No especificada"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-500">Tamaño:</span>
              <span className="text-sm font-medium">{companyData.cantidadEmpleados?.nombre ?? "No especificado"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-500">Condición Fiscal:</span>
              <span className="text-sm font-medium">{companyData.condicionFiscal?.nombre ?? "No especificada"}</span>
            </div>
            {companyData.sitioWeb && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-500">Web:</span>
                <a
                  href={companyData.sitioWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline truncate"
                >
                  {companyData.sitioWeb.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Contacto</CardTitle>
              <Dialog open={isEditingContact} onOpenChange={setIsEditingContact}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Información de Contacto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="correoContacto">Correo de contacto</Label>
                      <Input
                        id="correoContacto"
                        type="email"
                        value={contactForm.correoContacto}
                        onChange={(e) => setContactForm({ ...contactForm, correoContacto: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefonoContacto">Teléfono</Label>
                      <Input
                        id="telefonoContacto"
                        value={contactForm.telefonoContacto}
                        onChange={(e) => setContactForm({ ...contactForm, telefonoContacto: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        value={contactForm.direccion}
                        onChange={(e) => setContactForm({ ...contactForm, direccion: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Select
                        value={contactForm.idCiudad.toString()}
                        onValueChange={(value) => setContactForm({ ...contactForm, idCiudad: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una ciudad" />
                        </SelectTrigger>
                        <SelectContent>
                          {ciudadOptions.map((ciudad) => (
                            <SelectItem key={ciudad.idCatalogo} value={ciudad.idCatalogo.toString()}>
                              {ciudad.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditingContact(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveContact} disabled={isSaving}>
                        {isSaving ? "Guardando..." : "Guardar"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5" />
              <div className="text-sm">
                <span className="font-medium">{companyData.direccion || "No especificada"}</span>
                {locationParts.length > 0 && (
                  <p className="text-gray-500 text-xs">{locationParts.join(", ")}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{companyData.telefonoContacto || "No especificado"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{companyData.correoContacto || "No especificado"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Administrador */}
        {admin && (
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Usuario Administrador</CardTitle>
                <Dialog open={isEditingAdmin} onOpenChange={setIsEditingAdmin}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Editar Usuario Administrador</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="adminNombre">Nombre</Label>
                          <Input
                            id="adminNombre"
                            value={adminForm.nombre}
                            onChange={(e) => setAdminForm({ ...adminForm, nombre: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminApellido">Apellido</Label>
                          <Input
                            id="adminApellido"
                            value={adminForm.apellido}
                            onChange={(e) => setAdminForm({ ...adminForm, apellido: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminCorreo">Correo electrónico</Label>
                        <Input
                          id="adminCorreo"
                          type="email"
                          value={adminForm.correoElectronico}
                          onChange={(e) => setAdminForm({ ...adminForm, correoElectronico: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="adminTelefono">Teléfono</Label>
                          <Input
                            id="adminTelefono"
                            value={adminForm.telefono}
                            onChange={(e) => setAdminForm({ ...adminForm, telefono: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminTelefonoMovil">Teléfono móvil</Label>
                          <Input
                            id="adminTelefonoMovil"
                            value={adminForm.telefonoMovil}
                            onChange={(e) => setAdminForm({ ...adminForm, telefonoMovil: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminGenero">Género</Label>
                        <Select
                          value={adminForm.idGenero.toString()}
                          onValueChange={(value) => setAdminForm({ ...adminForm, idGenero: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un género" />
                          </SelectTrigger>
                          <SelectContent>
                            {generoOptions.map((genero) => (
                              <SelectItem key={genero.idCatalogo} value={genero.idCatalogo.toString()}>
                                {genero.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditingAdmin(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveAdmin} disabled={isSaving}>
                          {isSaving ? "Guardando..." : "Guardar"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Nombre</p>
                    <p className="font-medium">{admin.nombreCompleto}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Correo</p>
                    <p className="font-medium truncate">{admin.correoElectronico}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Teléfono</p>
                    <p className="font-medium">{admin.telefono || "No especificado"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <div className="text-sm">
                    <p className="text-gray-500 text-xs">Estado</p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        admin.estadoCuenta?.nombre === "Activa"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {admin.estadoCuenta?.nombre ?? "No especificado"}
                    </span>
                  </div>
                </div>
              </div>
              {admin.fechaRegistro && (
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Registrado el{" "}
                    {new Date(admin.fechaRegistro).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Descripción */}
      {companyData.descripcion && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Acerca de la empresa</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">{companyData.descripcion}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
