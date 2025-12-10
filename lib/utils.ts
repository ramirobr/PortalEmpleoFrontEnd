import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const addSpaces = (t: string) =>
  t.replace(/(?<=[a-zA-Z])(?=\d)/g, ' ').replace(/(?<=[a-zA-Z0-9])(?=[A-Z])/g, ' ');

