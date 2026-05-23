import { expect, test } from "@playwright/test";

test.setTimeout(90000);

type LoginRole = "candidate" | "company";

const credentials: Record<LoginRole, { email: string; password: string; redirect: string }> = {
  candidate: {
    email: "rbatallas@oshyn.com",
    password: "R@miro22",
    redirect: "/perfil",
  },
  company: {
    email: "empresademo@outlook.com",
    password: "Empleo123!",
    redirect: "/empresa-perfil",
  },
};

async function login(page: import("@playwright/test").Page, role: LoginRole) {
  const user = credentials[role];

  await page.goto("/auth/login");
  await page.locator('input[name="email"]').fill(user.email);
  await page.locator('input[name="password"]').fill(user.password);
  await page.getByRole("button", { name: "Iniciar Sesión" }).click();
  await page.waitForURL(`**${user.redirect}`, { timeout: 30000 });
}

function collectRuntimeErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];

  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") {
      if (message.text().includes("fetchApi Error") && message.text().includes("Failed to fetch")) {
        return;
      }
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on("response", (response) => {
    const url = response.url();
    const isApi = url.includes("localhost:5175/api");
    const isLocalPage = url.includes("localhost:3000");

    if ((isApi && response.status() >= 400) || (isLocalPage && response.status() >= 500)) {
      errors.push(`${isApi ? "api" : "http"} ${response.status()}: ${url}`);
    }
  });

  return errors;
}

test("candidate login and core pages load", async ({ page }) => {
  const errors = collectRuntimeErrors(page);

  await login(page, "candidate");
  await expect(page.getByText("Bienvenido a tu Perfil")).toBeVisible({ timeout: 30000 });
  await page.waitForLoadState("networkidle");

  const candidateRoutes = [
    { path: "/perfil/editar", text: "Información personal" },
    { path: "/perfil/archivos", text: "Mis Archivos" },
    { path: "/perfil/favoritos", text: "Empleos Favoritos" },
    { path: "/perfil/testimonios", text: "Mis Testimonios" },
  ];

  for (const route of candidateRoutes) {
    await page.goto(route.path);
    await expect(page.getByText(route.text).first()).toBeVisible({ timeout: 30000 });
  }

  expect(errors).toEqual([]);
});

test("company login and core pages load", async ({ page }) => {
  const errors = collectRuntimeErrors(page);

  await login(page, "company");
  await expect(page.getByText("Dashboard Empresa")).toBeVisible({ timeout: 30000 });

  const companyRoutes = [
    { path: "/empresa-perfil/perfil", text: "Información General", settledText: "Usuario Administrador" },
    { path: "/empresa-perfil/empleos", text: "Mis Ofertas de Empleo", settledText: "Ofertas encontradas" },
    { path: "/empresa-perfil/postulaciones", text: "Postulaciones", settledText: "Postulantes Destacados" },
    { path: "/empresa-perfil/buscar-candidatos", text: "Buscar Candidatos", settledText: "candidatos encontrados" },
  ];

  for (const route of companyRoutes) {
    await page.goto(route.path);
    await expect(page.getByText(route.text).first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByText(route.settledText).first()).toBeVisible({ timeout: 30000 });
  }

  expect(errors).toEqual([]);
});
