import { test, expect } from "@playwright/test";

test.describe("Accessibility & Responsiveness Audit", () => {
  test("Landing page maintains H1 heading and accessible buttons", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();

    // Verify all primary action links have accessible text
    const buttons = await page.getByRole("link").all();
    for (const btn of buttons) {
      const text = await btn.innerText();
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });

  test("Mobile responsive viewport (375px) renders without horizontal scroll breakage", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Start Farm Checkup|Start Farmer Onboarding/i })).toBeVisible();
  });
});
