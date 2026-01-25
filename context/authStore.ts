'use client';
import { UserAuthData } from '@/types/user';
import { create } from 'zustand';

export type AuthHydratorProps = {
  id?: string
  pic?: string
  idCurriculum: string
  idEmpresa?: string
  companyLogo?: string
} & Omit<Partial<UserAuthData>, 'userId'>;

type AuthState = {
  isAuthenticated: boolean;
  hydrate: (data: AuthHydratorProps) => void;
  setPic: (pic?: string) => void;
  setCompanyLogo: (companyLogo?: string) => void;
  clear: () => void;
} & AuthHydratorProps;

const initalState: Omit<AuthState, 'hydrate' | 'clear' | 'setPic' | 'setCompanyLogo'> = {
  id: undefined,
  fullName: undefined,
  role: undefined,
  isAuthenticated: false,
  idCurriculum: "",
  pic: "",
  idEmpresa: undefined,
  companyLogo: undefined,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initalState,
  hydrate: ({ id, fullName, role, idCurriculum, pic, idEmpresa, companyLogo }) =>
    set({
      isAuthenticated: true,
      idCurriculum,
      fullName,
      role,
      id,
      pic,
      idEmpresa,
      companyLogo,
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
  clear: () => set(initalState),
}));
