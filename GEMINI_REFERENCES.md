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

All code contributions must strictly follow the "Oshyn FE Lead Standards".

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
- **Tailwind Strategy:**
  - **Zero Runtime:** No dynamic string interpolation for class names (e.g., `bg-${color}-500`). Map full class names instead.
  - **Merging:** Always use `cn()` (clsx + tailwind-merge) for conditional classes.
  - **Mobile First:** Define base styles, then `md:`, `lg:` overrides.

### ♿ Accessibility (Non-Negotiable)

- **Semantics:** Use `<button>` for actions, `<a>` for navigation.
- **Labels:** Icon-only buttons MUST have `aria-label`.
- **Validation:** Automated checks via Pa11y are standard procedure.

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
