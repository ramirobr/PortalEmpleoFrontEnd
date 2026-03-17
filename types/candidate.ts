// Types for Candidate Profile (Company View)

export interface CandidateDatosPersonales {
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  nacionalidad: string;
  genero: string;
  estadoCivil: string;
  movilidad: boolean;
  licencia: boolean;
  tipoLicencia: string[];
}

export interface CandidateDatosContacto {
  email: string;
  telefono: string;
  celular: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  pais: string;
}

export interface CandidateEducacion {
  id: string;
  titulo: string;
  institucion: string;
  nivel: string;
  fechaInicio: string;
  fechaFin: string | null;
  estaCursando: boolean;
  descripcion: string;
}

export interface CandidateExperiencia {
  id: string;
  puesto: string;
  empresa: string;
  sector: string;
  fechaInicio: string;
  fechaFin: string | null;
  estaTrabajando: boolean;
  descripcion: string;
  pais: string;
  ciudad: string;
  tipoEmpleo: string;
}

export interface CandidateHabilidad {
  id: string;
  nombre: string;
  nivel: string;
  categoria: string;
  aniosExperiencia: number;
}

export interface CandidateIdioma {
  id: string;
  nombre: string;
  nivel: string;
}

export interface CandidateCertificacion {
  id: string;
  nombre: string;
  institucion: string;
  fechaObtencion: string;
  fechaExpiracion: string | null;
  credentialId: string;
}

export interface CandidateAplicacion {
  idVacante: string;
  tituloVacante: string;
  fechaAplicacion: string;
  estado: string;
  cartaPresentacion: string;
  curriculumUrl: string;
}

export interface CandidateProfile {
  id: string;
  datosPersonales: CandidateDatosPersonales;
  datosContacto: CandidateDatosContacto;
  resumenProfesional: string;
  disponibilidad: string;
  expectativaSalarial: string;
  educacion: CandidateEducacion[];
  experienciaLaboral: CandidateExperiencia[];
  habilidades: CandidateHabilidad[];
  idiomas: CandidateIdioma[];
  certificaciones: CandidateCertificacion[];
  aplicacion: CandidateAplicacion;
}
