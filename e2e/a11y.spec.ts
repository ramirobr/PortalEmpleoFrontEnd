import { nvdaTest as test } from "@guidepup/playwright";
import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Testing", () => {
  // Screen reader interactions can be slower, so increase default timeout
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

    // You can add more pages here to scan them automatically
    // test('Search page should not have issues', async ({ page }) => { ... })
  });

  test.describe("Screen Reader Navigation (NVDA)", () => {
    test("Home page Tab navigation reads meaningful text", async ({
      page,
      nvda,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      // NVDA starts reading when page loads. Let's wait a bit for initial announcements,
      // then clear log to focus on Tab navigation.
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await nvda.clearSpokenPhraseLog();

      const announcedTexts: string[] = [];

      // Press Tab 5 times and record what the screen reader says
      for (let i = 0; i < 5; i++) {
        await nvda.press("Tab");
        // Give NVDA time to speak
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const lastSpoken = await nvda.lastSpokenPhrase();
        announcedTexts.push(lastSpoken);

        console.log(`[Tab ${i + 1} NVDA announcement]:`, lastSpoken);
      }

      // Verify NVDA actually announced things
      expect(announcedTexts.length).toBe(5);

      // We expect some announcements not to be empty
      const meaningfulAnnouncements = announcedTexts.filter(
        (text) => text.trim().length > 0,
      );
      expect(meaningfulAnnouncements.length).toBeGreaterThan(0);

      // Check if there's any fallback element that has no accessible name
      // A bad accessibility pattern would read 'unlabelled button' or similar empty focus.
      for (const text of announcedTexts) {
        expect(text.toLowerCase()).not.toContain("unlabelled");
      }
    });
  });
});
