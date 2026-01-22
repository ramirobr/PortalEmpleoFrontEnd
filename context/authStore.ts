'use client';
import { UserAuthData } from '@/types/user';
import { create } from 'zustand';

export type AuthHydratorProps = {
  id?: string
  pic?: string
  idCurriculum: string
} & Omit<Partial<UserAuthData>, 'userId'>;

type AuthState = {
  isAuthenticated: boolean;
  hydrate: (data: AuthHydratorProps) => void;
  setPic: (pic?: string) => void;
  clear: () => void;
} & AuthHydratorProps;

const initalState: Omit<AuthState, 'hydrate' | 'clear' | 'setPic'> = {
  id: undefined,
  fullName: undefined,
  role: undefined,
  isAuthenticated: false,
  idCurriculum: "",
  pic: ""
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initalState,
  hydrate: ({ id, fullName, role, idCurriculum, pic }) =>
    set({
      isAuthenticated: true,
      idCurriculum,
      fullName,
      role,
      id,
      pic,
    }),
  setPic: (pic) =>
    set((state) => ({
      ...state,
      pic,
    })),
  clear: () => set(initalState),
}));
