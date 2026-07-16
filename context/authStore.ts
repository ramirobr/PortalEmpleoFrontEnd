"use client";
import { UserAuthData, Notificacion } from "@/types/user";
import type { Mensaje } from "@/types/mensajes";
import { create } from "zustand";

export type AuthHydratorProps = {
  id?: string;
  pic?: string;
  idCurriculum: string;
  idEmpresa?: string;
  companyLogo?: string;
  profesion?: string;
  idTipoJornadaLaboral?: number;
} & Omit<Partial<UserAuthData>, "userId">;

type AuthState = {
  isAuthenticated: boolean;
  unreadNotifications: number;
  notifications: Notificacion[];
  hydrate: (data: AuthHydratorProps) => void;
  setPic: (pic?: string) => void;
  setCompanyLogo: (companyLogo?: string) => void;
  setFullName: (fullName: string) => void;
  setProfesion: (profesion: string) => void;
  setUnreadNotifications: (count: number) => void;
  setNotifications: (notifications: Notificacion[]) => void;
  addNotification: (notification: Notificacion) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  unreadMessages: number;
  setUnreadMessages: (count: number) => void;
  addUnreadMessage: () => void;
  lastIncomingMessage: Mensaje | null;
  setLastIncomingMessage: (msg: Mensaje | null) => void;
  floatingConvs: Array<{ convId: string; nombre: string }>;
  openFloatingChat: (convId: string, nombre: string) => void;
  closeFloatingChat: (convId: string) => void;
  clear: () => void;
} & AuthHydratorProps & { profesion?: string };

const initalState: Omit<
  AuthState,
  | "hydrate"
  | "clear"
  | "setPic"
  | "setCompanyLogo"
  | "setFullName"
  | "setProfesion"
  | "setUnreadNotifications"
  | "setNotifications"
  | "addNotification"
  | "markNotificationRead"
  | "markAllNotificationsRead"
  | "removeNotification"
  | "setUnreadMessages"
  | "addUnreadMessage"
  | "setLastIncomingMessage"
  | "openFloatingChat"
  | "closeFloatingChat"
> = {
  id: undefined,
  fullName: undefined,
  profesion: "",
  role: undefined,
  isAuthenticated: false,
  unreadNotifications: 0,
  notifications: [],
  unreadMessages: 0,
  floatingConvs: [],
  lastIncomingMessage: null,
  idCurriculum: "",
  pic: "",
  idEmpresa: undefined,
  companyLogo: undefined,
  idTipoJornadaLaboral: undefined,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initalState,
  hydrate: ({
    id,
    fullName,
    role,
    idCurriculum,
    pic,
    idEmpresa,
    companyLogo,
    profesion,
    idTipoJornadaLaboral,
  }) =>
    set({
      isAuthenticated: true,
      idCurriculum,
      fullName,
      role,
      id,
      pic,
      idEmpresa,
      companyLogo,
      profesion,
      idTipoJornadaLaboral,
    }),
  setPic: (pic) =>
    set((state) => ({
      ...state,
      pic,
    })),
  setCompanyLogo: (companyLogo) =>
    set((state) => ({
      ...state,
      companyLogo,
    })),
  setFullName: (fullName) =>
    set((state) => ({
      ...state,
      fullName,
    })),
  setProfesion: (profesion) =>
    set((state) => ({
      ...state,
      profesion,
    })),
  setUnreadNotifications: (count) => set({ unreadNotifications: count }),
  setNotifications: (incoming) =>
    set((state) => {
      // Las notificaciones "incoming" vienen del servidor y solo incluyen no leídas.
      // Preservamos las que el usuario ya marcó como leídas localmente para que
      // no desaparezcan de la lista al re-renderizar el dashboard.
      const incomingIds = new Set(incoming.map((n) => n.idNotificacion));
      const preservedRead = state.notifications.filter(
        (n) => n.esLeida && !incomingIds.has(n.idNotificacion),
      );
      const merged = [...incoming, ...preservedRead];
      return {
        notifications: merged,
        unreadNotifications: merged.filter((n) => !n.esLeida).length,
      };
    }),
  addNotification: (notification) =>
    set((state) => {
      if (state.notifications.some((n) => n.idNotificacion === notification.idNotificacion)) {
        return state;
      }

      const updated = [notification, ...state.notifications];
      return {
        notifications: updated,
        unreadNotifications: updated.filter((n) => !n.esLeida).length,
      };
    }),
  markNotificationRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.idNotificacion === id ? { ...n, esLeida: true } : n,
      );
      return {
        notifications: updated,
        unreadNotifications: updated.filter((n) => !n.esLeida).length,
      };
    }),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, esLeida: true })),
      unreadNotifications: 0,
    })),
  setUnreadMessages: (count) => set({ unreadMessages: count }),
  addUnreadMessage: () => set((state) => ({ unreadMessages: state.unreadMessages + 1 })),
  setLastIncomingMessage: (msg) => set({ lastIncomingMessage: msg }),
  openFloatingChat: (convId, nombre) =>
    set((state) => {
      // Si ya está abierta, no duplicar
      if (state.floatingConvs.some((c) => c.convId === convId)) return state;
      // Máximo 3 ventanas simultáneas — eliminar la más antigua si se supera
      const current = state.floatingConvs.length >= 3
        ? state.floatingConvs.slice(1)
        : state.floatingConvs;
      return { floatingConvs: [...current, { convId, nombre }] };
    }),
  closeFloatingChat: (convId) =>
    set((state) => ({
      floatingConvs: state.floatingConvs.filter((c) => c.convId !== convId),
    })),
  removeNotification: (id) =>
    set((state) => {
      const updated = state.notifications.filter((n) => n.idNotificacion !== id);
      return {
        notifications: updated,
        unreadNotifications: updated.filter((n) => !n.esLeida).length,
      };
    }),
  clear: () => set(initalState),
}));
