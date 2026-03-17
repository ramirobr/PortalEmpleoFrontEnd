"use client";
import { UserAuthData } from "@/types/user";
import { create } from "zustand";

export type AuthHydratorProps = {
  id?: string;
  pic?: string;
  idCurriculum: string;
  idEmpresa?: string;
  companyLogo?: string;
  profesion?: string;
} & Omit<Partial<UserAuthData>, "userId">;

type AuthState = {
  isAuthenticated: boolean;
  hydrate: (data: AuthHydratorProps) => void;
  setPic: (pic?: string) => void;
  setCompanyLogo: (companyLogo?: string) => void;
  setFullName: (fullName: string) => void;
  setProfesion: (profesion: string) => void;
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
> = {
  id: undefined,
  fullName: undefined,
  profesion: "",
  role: undefined,
  isAuthenticated: false,
  idCurriculum: "",
  pic: "",
  idEmpresa: undefined,
  companyLogo: undefined,
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
  clear: () => set(initalState),
}));
