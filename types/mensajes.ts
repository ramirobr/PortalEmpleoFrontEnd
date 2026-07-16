export interface Conversacion {
  idConversacion: string;
  idUsuario: string;
  idEmpresa: string;
  idVacante?: string;
  fechaCreacion: string;
  fechaUltimoMensaje: string;
  nombreUsuario?: string;
  nombreEmpresa?: string;
  tituloVacante?: string;
  ultimoMensaje?: string;
  mensajesNoLeidos: number;
}

export interface Mensaje {
  idMensaje: string;
  idConversacion: string;
  esDeEmpresa: boolean;
  contenido: string;
  fechaEnvio: string;
  esLeido: boolean;
}

export type GetOrCreateConversacionPayload = {
  idUsuario: string;
  idEmpresa: string;
  idVacante?: string;
};

export type EnviarMensajePayload = {
  idConversacion: string;
  esDeEmpresa: boolean;
  contenido: string;
};
