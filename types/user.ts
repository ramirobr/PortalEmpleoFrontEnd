export type SignupData = {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
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

export type PostulantRegisterResponse = GenericResponse<null>
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

export type RefreshToken = GenericResponse<RefreshTokenData>

export type RefreshTokenData = {
  accessToken: string
  refreshToken: string
}

export type Logout = GenericResponse<null>
