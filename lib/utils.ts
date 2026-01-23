import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const addSpaces = (t: string) =>
  t.replace(/(?<=[a-zA-Z])(?=\d)/g, ' ').replace(/(?<=[a-zA-Z0-9])(?=[A-Z])/g, ' ');

export function validarCedulaEcuatoriana(value: string) {
  if (!/^[0-9]{10}$/.test(value)) return false;
  // Validación básica de cédula ecuatoriana
  const province = parseInt(value.substring(0, 2), 10);
  if (province < 1 || province > 24) return false;
  const thirdDigit = parseInt(value[2], 10);
  if (thirdDigit > 6) return false;
  let total = 0;
  for (let i = 0; i < 9; i++) {
    let num = parseInt(value[i], 10);
    if (i % 2 === 0) {
      num *= 2;
      if (num > 9) num -= 9;
    }
    total += num;
  }
  let checkDigit = total % 10 ? 10 - (total % 10) : 0;
  return checkDigit === parseInt(value[9], 10);
}

export const getInitials = (name?: string) => (name ?? "")
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase()
  .slice(0, 2);

export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const mapCatalogsToResponse = <T extends Record<string, unknown>>(
  types: readonly string[],
  results: unknown[]
): T =>
  Object.fromEntries(
    types.map((type, i) => [type.toLowerCase(), results[i]])
  ) as T;

export const parseWeirdDate = (value: string) => {
  const [d, m, y] = value.split("/");
  return new Date(Number(y), Number(m) - 1, Number(d));
};
