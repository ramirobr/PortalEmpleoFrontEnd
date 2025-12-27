'use client';
import { UserAuthData } from '@/types/user';
import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  hydrate: (data: Partial<UserAuthData>) => void;
  clear: () => void;
} & Partial<UserAuthData>;

const initalState = {
  userId: undefined,
  fullName: undefined,
  role: undefined,
  isAuthenticated: false
}
export const useAuthStore = create<AuthState>((set) => ({
  ...initalState,
  hydrate: ({ userId, fullName, role }) =>
    set({
      userId,
      fullName,
      role,
      isAuthenticated: true,
    }),
  clear: () => set(initalState),
}));
