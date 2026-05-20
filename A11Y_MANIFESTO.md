# 🚀 Frontend Accessibility (A11y) Automation Manifesto

As a Senior Frontend Architect, ensuring accessibility is non-negotiable. Accessibility isn't just about semantic HTML; it's about providing an equitable experience for everyone, including keyboard-only users and those relying on screen readers.

This manifesto defines the standard operating procedure for implementing, automating, and documenting A11y on **every single project**.

---

## 1. The A11y Automation Strategy

Every frontend project MUST implement a two-pronged accessibility automation approach:

### A. Static & DOM Analysis (The Fast Check)

We use **Axe-core via Playwright** to catch objective WCAG 2.1 AA violations (contrast ratios, missing alt attributes, ARIA label misconfigurations).

- **Rule:** Run against the **production build**, never the dev server, to ensure true metrics.
- **Implementation:** Tests are integrated directly into `e2e/a11y.spec.ts` via `@axe-core/playwright`.

### B. Screen Reader & Keyboard Simulation (The Human Check)

We use **Playwright** + **Guidepup** to simulate real-world screen reader behavior (NVDA/VoiceOver) and sequential keyboard navigation (`Tab`).

- **Rule:** Verify that critical user journeys (Login, Register, Apply) have meaningful context and aren't announced as "unlabelled" or empty.
- **Implementation:**
  ```bash
  npm i -D @playwright/test @guidepup/playwright @guidepup/setup
  npx @guidepup/setup
  ```

---

## 2. Global Implementation Steps for New Projects

To implement this on a new repository, follow these precise steps:

1. **Install Dependencies:**
   ```bash
   npm i -D @playwright/test @guidepup/playwright @guidepup/setup @axe-core/playwright
   ```
2. **Setup OS Screen Reader Integration:**
   ```bash
   npx @guidepup/setup
   ```
3. **Configure Playwright (`playwright.config.ts`):**
   _Crucial: You must use 1 worker and disable headless mode for Guidepup to interact with the OS screen reader._
   ```typescript
   import { defineConfig } from "@playwright/test";
   export default defineConfig({
     workers: 1,
     use: { headless: false },
   });
   ```
4. **Create the E2E Script (`e2e/a11y.spec.ts`):**

   ```typescript
   import { nvdaTest as test } from "@guidepup/playwright";
   import { expect } from "@playwright/test";
   import AxeBuilder from "@axe-core/playwright";

   test.describe("Accessibility Testing", () => {
     test.setTimeout(180000);

     test.describe("Static Analysis (Axe-core)", () => {
       test("Home page should not have any automatically detectable accessibility issues", async ({
         page,
       }) => {
         await page.goto("/");
         await page.waitForLoadState("domcontentloaded");

         const accessibilityScanResults = await new AxeBuilder({ page })
           .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
           .analyze();

         expect(accessibilityScanResults.violations).toEqual([]);
       });
     });

     test.describe("Screen Reader Navigation (NVDA)", () => {
       test("Keyboard navigation reads meaningful text", async ({
         page,
         nvda,
       }) => {
         await page.goto("/");
         await nvda.clearSpokenPhraseLog();
         await nvda.press("Tab");
         const spoken = await nvda.lastSpokenPhrase();
         expect(spoken.toLowerCase()).not.toContain("unlabelled");
       });
     });
   });
   ```

5. **Add Package Scripts (`package.json`):**
   ```json
   "scripts": {
     "test:a11y": "playwright test e2e/a11y.spec.ts"
   }
   ```

---

## 3. Documentation Standard

When documenting A11y efforts on a project, always generate a **Walkthrough Artifact** (`walkthrough.md`) that explicitly lists:

1. **What was accomplished:** The infrastructure setup.
2. **What was tested:** The exact user journeys simulated via keyboard.
3. **Validation Results:** The actual verbatim text announced by the screen reader during the test to prove meaningful context.

---

## 4. Current Project Report: Portal Empleo

### ✅ Screen Reader & Keyboard Navigation

The Guidepup + NVDA automation proved successful. Navigating the Home Page via `Tab` properly announced context:

- `Navigation landmark, toggle button, Abrir menú`
- `Crear cuenta, link`
- `Ingresar, link`

### ❌ Static Analysis (Axe-core WCAG 2.1 AA Audit)

The prior static analysis caught **39 WCAG 2.1 AA violations** on the production build (`Localhost:3000`), all strictly related to **Guideline 1.4.3 (Contrast Minimum)**.

**Critical Findings:**

1. **Primary Buttons Background:** The `.btn-primary` elements have a contrast ratio of `2.88:1` (WCAG requires `4.5:1`).
   - _Fix:_ Adjust the primary brand color to a slightly darker shade like `#00857c`.
2. **Testimonial Text:** The text styling `.text-gray-dark` over the current background has a ratio of `4.11:1` (fails the `4.5:1` threshold).
   - _Fix:_ Darken the text color to `#697885`.
3. **Primary Text Links:** The `.text-primary` class used on names (e.g., "Daniela Cristina") has a ratio of `2.88:1`.
   - _Fix:_ Same as primary buttons, use `#00857c`.

**Action Items For This Codebase:**

- Modify the CSS color palette in `tailwind.config.ts` or `index.css` to hit the minimum WCAG 2.1 AA contrast thresholds for the `primary` color variables.
