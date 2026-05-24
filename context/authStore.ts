"use client";
import { UserAuthData, Notificacion } from "@/types/user";
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
  removeNotification: (id: string) => void;
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
  | "removeNotification"
> = {
  id: undefined,
  fullName: undefined,
  profesion: "",
  role: undefined,
  isAuthenticated: false,
  unreadNotifications: 0,
  notifications: [],
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
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadNotifications: notifications.filter((n) => !n.esLeida).length,
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
