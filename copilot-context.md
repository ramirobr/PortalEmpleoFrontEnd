# Copilot Project Context

This file provides context for GitHub Copilot and other AI coding assistants to better understand the structure and purpose of this project.

## Project Name

PortalEmpleo

## Description

A Next.js-based frontend for a job portal application. The project is located in `src/FrontEnd` and uses TypeScript, Next.js, and PostCSS.

## Main Technologies

- Next.js
- TypeScript
- PostCSS
- ESLint

## Key Files & Folders

- `app/` - Main application code (pages, layouts, global styles)
- `public/` - Static assets
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration

## Usage

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Notes

- All frontend code is in the `app/` directory.
- Static files are served from `public/`.
- TypeScript is used throughout the project.

---

This file is intended to help Copilot and other AI tools provide better suggestions and code completions for this project.

## UI Standards & Components (CRITICAL)

### 🛑 STRICT DESIGN & UI FREEZE
**DO NOT ACCIDENTALLY OR PROACTIVELY MODIFY THE LOOK AND FEEL OF THIS APPLICATION.**
You are strictly forbidden from altering the design system, colors, spacing, CSS animations, or layout structures unless the user **EXPLICITLY** and **DIRECTLY** commands you to "change the design", "update the UI", or similar phrasing.
- If the user asks for a functional fix (e.g., "fix the bug", "wire up the API", "add validation"), you must **PRESERVE** the existing HTML/Tailwind classes exactly as they are.
- NEVER invent new Tailwind utility combinations to "improve" the look unless asked.
- Assume the current UI is exactly what the designer intended.

### The PremiumButton Standard
**Before generating or writing any code involving buttons, you MUST use the `PremiumButton` component.**
Do not use standard HTML `<button>` tags or other generic UI components for primary or secondary actions.

- **Import:** `import { PremiumButton } from "@/components/shared/components/PremiumButton";`
- **Link usage:** Pass the `href` prop to automatically render a Next.js Link.
- **Props:** Supports `variant` ("primary", "secondary", "outline", "white"), `size` ("sm", "md", "lg"), `icon`, `iconPosition`, and `isLoading`.

Always consult the `.cursorrules` file for the strict single source of truth guidelines.
