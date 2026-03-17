"use server";

import { fetchApi } from "@/lib/apiClient";

// ==================== TIPOS ====================

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  code: number;
  messages: string[];
  isSuccess: boolean;
  data: {
    message: string;
    resetToken: string;
  };
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  code: number;
  messages: string[];
  isSuccess: boolean;
  data?: unknown;
}

// ==================== FUNCIONES ====================

/**
 * Envía una solicitud para restablecer la contraseña
 * @param email - Email del usuario que olvidó su contraseña
 * @returns Respuesta del servidor con el token de reset
 */
export async function forgotPassword(
  email: string
): Promise<ForgotPasswordResponse | null> {
  const response = await fetchApi<ForgotPasswordResponse>(
    "/Authorization/forgot-password",
    {
      method: "POST",
      body: { email },
    }
  );

  return response;
}

/**
 * Restablece la contraseña con el token recibido
 * @param data - Datos para restablecer la contraseña
 * @returns Respuesta del servidor
 */
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse | null> {
  const response = await fetchApi<ResetPasswordResponse>(
    "/Authorization/reset-password",
    {
      method: "POST",
      body: data,
    }
  );

  return response;
}
