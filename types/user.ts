import { CatalogEndpoints } from "@/lib/catalog/fetch";
import { CatalogsByType, CatalogItem } from "./search";
import { CatalogFieldsFromTypes } from "./generic";

export type SignupData = {
  nombres: string;
  apellidos: string;
  idTipoDocumento: number;
  documento: string;
  telefono: string;
  telefonoMobil: string;
  fechaNacimiento: string;
  email: string;
  password: string;
  aceptaCondicionesUso: boolean;
  aceptaPoliticaPrivacidad: boolean;
  aceptaNotificaciones: boolean;
};

export type GenericResponse<T> = {
  code: number
  messages: string[]
  isSuccess: boolean
  data: T
}

export type PostulantRegisterResponse = GenericResponse<string>
export type CompanyRegisterResponse = GenericResponse<string>
export type LoginResponse = GenericResponse<LoginData>

export type LoginData = {
  userId: string
  fullName: string
  role: string
  email: string
  token: string
  tokenExpireIn: Date
  refreshToken: string
}

export type UserAuthData = Omit<LoginData, "accessToken" | "token" | "tokenExpireIn">
export type RefreshToken = GenericResponse<RefreshTokenData>

export type RefreshTokenData = {
  accessToken: string
  refreshToken: string
}

export type Logout = GenericResponse<null>

export const DATOS_PERSONALES_TYPES = ["PAIS", "TIPO_DOCUMENTO"] as const;
export type DatosPersonalesFieldsResponse =
  CatalogFieldsFromTypes<typeof DATOS_PERSONALES_TYPES, CatalogsByType[]>;
