// Copilot context file for PortalEmpleo
// This file provides context and guidance for GitHub Copilot and other AI coding assistants.

/**
 * Project: PortalEmpleo
 * Main technologies: Next.js 16+, React, TypeScript, Tailwind CSS, Swiper
 * API mocking: MSW
 * Carousel: Swiper (pagination, navigation, responsive)
 * Data: jobs and testimonials from /api/jobs and /api/testimonials
 * Styling: Global Swiper CSS imports in app/styles/globals.css
 * Accessibility: Focus ring on testimonial cards
 * Responsive: Swiper navigation arrows only on large screens, pagination dots on small/medium
 * Error handling: Defensive array checks for API responses
 * Known issues: Do not import Swiper CSS in components, only in global CSS
 * Author: Fernando Torres
 */

// Usage:
// - Use this file to inform Copilot about project conventions, API endpoints, and UI patterns.
// - Update this file as new features, patterns, or issues arise.

export const copilotContext = {
  project: "PortalEmpleo",
  technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Swiper"],
  apiEndpoints: ["/api/jobs", "/api/testimonials"],
  carousel: {
    library: "Swiper",
    features: ["pagination", "navigation", "responsive breakpoints"],
    css: "Import Swiper CSS only in app/styles/globals.css",
    accessibility: "Add focus ring to interactive cards",
    responsive: {
      navigation: "Show arrows only on large screens",
      pagination: "Show dots only on small/medium screens",
    },
  },
  errorHandling: {
    testimonials:
      "Always check if API response is array or object with testimonials array",
  },
  author: "Fernando Torres",
};
