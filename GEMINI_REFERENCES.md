# Gemini Agent References & Standards

## 1. Project Overview

**Project Name:** PortalEmpleo  
**Description:** A Next.js-based frontend for a job portal application.  
**Location:** `src/FrontEnd`  
**Core Framework:** Next.js (App Router)

## 2. Technology Stack

This project uses a modern, performance-focused stack. Agents must adhere to these specific versions and libraries.

- **Framework:** Next.js 16+ (React 19)
- **Language:** TypeScript (Strict Mode)
- **Styling:**
  - Tailwind CSS 4 (Configuration via CSS variables/native)
  - PostCSS
  - `clsx` + `tailwind-merge` for class composition
- **UI Components:**
  - Radix UI Primitives (Accordion, Dialog, Popover, Select, etc.)
  - Lucide React (Icons)
  - Sonner (Toast notifications)
  - Swiper (Carousels)
- **State & Logic:**
  - Zustand (Global State)
  - React Hook Form (Form Management)
  - Zod 4 (Schema Validation)
  - NextAuth (Authentication - Beta)
- **Utilities:**
  - `date-fns` (Date manipulation)
  - `libphonenumber-js` (Phone formatting)

## 3. Oshyn FE Lead Standards

### 🛑 STRICT DESIGN & UI FREEZE (CRITICAL)
**DO NOT ACCIDENTALLY OR PROACTIVELY MODIFY THE LOOK AND FEEL OF THIS APPLICATION.**
You are strictly forbidden from altering the design system, colors, spacing, CSS animations, or layout structures unless the user **EXPLICITLY** and **DIRECTLY** commands you to "change the design", "update the UI", or similar phrasing.
- If the user asks for a functional fix (e.g., "fix the bug", "wire up the API", "add validation"), you must **PRESERVE** the existing HTML/Tailwind classes exactly as they are.
- NEVER invent new Tailwind utility combinations to "improve" the look unless asked.
- Assume the current UI is exactly what the designer intended.

All code contributions must strictly follow the "Oshyn FE Lead Standards".

### 🔍 COMPONENT SEARCH & REUSE POLICY (MANDATORY)
**Before creating any new UI component or implementing a complex UI pattern, you MUST follow this hierarchy:**
1. **Search Workspace**: Perform a thorough search across the entire codebase (especially in `@/components/shared/components`) to check for an existing component that fulfills the requirement. **REUSE** and extend existing components whenever possible.
2. **Search UI Libraries**: If no workspace component exists, check the installed libraries: **Radix UI** primitives for logic/structure and **Lucide React** for icons.
3. **Create Reusable Component**: Only if the component exists in neither the workspace nor the libraries, you may create a new one. It MUST:
   - Be placed in `@/components/shared/components/`.
   - Strictly follow the tokens in `design-tokens.json`.
   - Be designed for **HIGH REUSABILITY** with clear props.
   - Use `cn()` for class composition.

### 🧠 Core Philosophy

- **Performance First:** Prioritize LCP and CLS. No layout thrashing.
- **Accessibility:** WCAG 2.1 AA is mandatory. Zero errors policy.
- **Code Quality:** Strict TypeScript. DRY principles.

### 🏛️ Code Quality & Architecture

- **Strict TypeScript:** `noImplicitAny: true`. Use Interfaces for objects.
- **Validation:** Use Zod for all external data.
- **Component Strategy:**
  - **Islands Architecture:** Default to Server Components (RSC).
  - Use `"use client"` _only_ when interactivity is required.
  - Avoid prop drilling; use composition or Zustand.

### 🎨 CSS & Layouts ("No Div Soup")

- **Macro-Layouts:** Use **CSS Grid**.
- **Micro-Layouts:** Flexbox is allowed.
- **NO INLINE STYLES**: You are strictly forbidden from using the `style={{ ... }}` prop in React components. All styling MUST be done through Tailwind CSS utility classes.
- **Exception**: Inline styles are ONLY allowed if it is technically impossible to achieve the result with Tailwind (e.g., dynamic calculated values from an API or complex third-party library requirements) AND the user has explicitly authorized it for that specific case.
- **Tailwind Strategy:**
  - **Zero Runtime:** No dynamic string interpolation for class names (e.g., `bg-${color}-500`). Map full class names instead.
  - **Merging:** Always use `cn()` (clsx + tailwind-merge) for conditional classes.
  - **Mobile First:** Define base styles, then `md:`, `lg:` overrides.

### ♿ Accessibility (Non-Negotiable)

- **Semantics:** Use `<button>` for actions, `<a>` for navigation.
- **Labels:** Icon-only buttons MUST have `aria-label`.
- **Validation:** Automated checks via Pa11y are standard procedure.

### 📐 Spec-Driven Development (SDD) Workflow
- This codebase operates on strict SDD principles.
- **Design Tokens:** `design-tokens.json` in the root is the ultimate source of truth for colors, fonts, shadows, and spacing. This file compiles into `globals.css` prior to `dev` and `build` commands. You must never invent hex codes or arbitrary spacing values.
- **Component Specs:** Always consult `docs/sdd/ui-components.spec.md` before building UI features.

### 💎 UI Component Standards (SINGLE SOURCE OF TRUTH)

**MANDATORY RULE:** The `PremiumButton` component is the **ONLY** source of truth for primary and secondary actions across the entire application.
- **NEVER** write standard HTML `<button>` tags with custom classes for primary actions.
- **NEVER** use generic `<Link>` tags stylized as buttons.
- **ALWAYS** import and use the standard component: `import { PremiumButton } from "@/components/shared/components/PremiumButton";`
- To navigate, use the `href` prop on `PremiumButton` instead of wrapping it in a `<Link>`.

## 4. Operational Workflows

### Development

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

### Directory Structure

- `app/` - Main application code (App Router)
- `components/` - Reusable UI components
- `lib/` - Utility functions and shared logic
- `public/` - Static assets
- `types/` - TypeScript type definitions
- `context/` - React Context providers (when strictly necessary, prefer Zustand)

## 5. Agent Protocols

When modifying this codebase:

1. **Read-First:** Always check `package.json` and this file before introducing new dependencies.
2. **Aesthetics:** Implement premium, polished designs with smooth micro-interactions.
3. **SEO:** Ensure every page has proper Title Tags, Meta Descriptions, and Semantic HTML.
4. **Verification:** Verify changes against the standards (A11y, Performance) before asking for user review.
