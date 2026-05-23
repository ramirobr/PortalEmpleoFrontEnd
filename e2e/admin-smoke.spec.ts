import { expect, test } from "@playwright/test";

const adminRoutes = [
  { path: "/admin", heading: "Dashboard" },
  { path: "/admin/usuarios", heading: "Gestionar Usuarios" },
  { path: "/admin/roles", heading: "Gestionar Roles" },
  { path: "/admin/empresas", heading: "Gestionar Empresas" },
  { path: "/admin/empleos", heading: "Gestionar Empleos" },
  { path: "/admin/candidatos", heading: "Gestionar Candidatos" },
  { path: "/admin/blogs", heading: "Gestionar Blogs" },
  { path: "/admin/testimonios", heading: "Gestionar Testimonios" },
  { path: "/admin/catalogos", heading: "Gestionar Catálogos" },
];

test("admin login and core pages load with real API", async ({ page }) => {
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
    if (response.status() >= 400) {
      errors.push(`${url.includes("localhost:5175/api") ? "api" : "http"} ${response.status()}: ${url}`);
    }
  });

  await page.goto("/auth/login");
  await page.locator('input[name="email"]').fill("admin@portalempleo.com");
  await page.locator('input[name="password"]').fill("Empleo123!");
  await page.getByRole("button", { name: "Iniciar Sesión" }).click();
  await page.waitForURL("**/admin", { timeout: 30000 });

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
    timeout: 30000,
  });
  await page.screenshot({
    path: "test-results/admin-dashboard.png",
    fullPage: true,
  });

  for (const route of adminRoutes) {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { name: route.heading })).toBeVisible({
      timeout: 30000,
    });
  }

  await page.goto("/admin/candidatos");
  await expect(page.getByRole("heading", { name: "Gestionar Candidatos" })).toBeVisible({
    timeout: 30000,
  });
  const viewCandidateButtons = page.getByRole("button", { name: /Ver perfil de / });
  await expect(viewCandidateButtons.first()).toBeVisible({ timeout: 30000 });
  await viewCandidateButtons.first().click();
  await expect(page).toHaveURL(/\/admin\/candidatos\/.+/);
  await expect(page.getByRole("heading", { name: "Perfil del candidato" })).toBeVisible({
    timeout: 30000,
  });
  await page.goto("/admin/candidatos");
  const editCandidateButtons = page.getByRole("button", { name: /Editar / });
  await expect(editCandidateButtons.first()).toBeVisible({ timeout: 30000 });
  await editCandidateButtons.first().click();
  await expect(page.getByRole("dialog")).toContainText("Editar");
  await expect(page.getByLabel("Nombre")).toBeVisible({ timeout: 30000 });
  await expect(page.getByLabel("Correo electrónico")).toBeVisible();
  await page.screenshot({
    path: "test-results/admin-candidatos-edit-dialog.png",
    fullPage: true,
  });
  await page.keyboard.press("Escape");

  await page.goto("/admin/blogs");
  await expect(page.getByRole("heading", { name: "Gestionar Blogs" })).toBeVisible({
    timeout: 30000,
  });
  const editBlogButtons = page.getByRole("button", { name: /Editar / });
  await expect(editBlogButtons.first()).toBeVisible({ timeout: 30000 });
  await editBlogButtons.first().click();
  await expect(page.getByRole("dialog")).toContainText("Editar artículo");
  await expect(page.locator("#blog-contenido")).toBeVisible();
  await expect(page.getByText("Vista previa")).toBeVisible();
  await page.keyboard.press("Escape");

  await page.goto("/admin/usuarios");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Nuevo Usuario" }).click();
  await expect(page.getByRole("heading", { name: "Tipo de cuenta" })).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: "test-results/admin-usuarios-wizard.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Crear postulante" }).click();
  await expect(page.getByRole("heading", { name: "Información personal" })).toBeVisible();
  await page.getByRole("button", { name: "Atrás" }).click();
  await page.getByRole("button", { name: "Crear empresa" }).click();
  await expect(page.getByRole("heading", { name: "Información de la empresa" })).toBeVisible();

  await page.keyboard.press("Escape");
  await page.waitForLoadState("networkidle");
  await page.goto("/admin/roles");
  await page.getByRole("button", { name: "Nuevo Rol" }).click();
  await expect(page.getByRole("dialog")).toContainText("Crear Rol");
  await page.screenshot({
    path: "test-results/admin-roles-dialog.png",
    fullPage: true,
  });

  expect(errors).toEqual([]);
});
