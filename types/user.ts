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

export type PostulantRegisterResponse = {
  code: number
  messages: string[]
  isSuccess: boolean
  data: any
}

export type LoginResponse = {
  code: number
  messages: any[]
  isSuccess: boolean
  data: LoginData
}

export type LoginData = {
  fullName: string
  role: string
  email: string
  token: string
  refreshToken: string
}

export type RefreshToken = {
  code: number
  messages: any[]
  isSuccess: boolean
  data: RefreshTokenData
}

export type RefreshTokenData = {
  accessToken: string
  refreshToken: string
}

export type Logout = {
  code: number
  messages: string[]
  isSuccess: boolean
  data: null
}
