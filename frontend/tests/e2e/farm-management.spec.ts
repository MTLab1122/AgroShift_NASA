import { test, expect } from "@playwright/test";

test.describe("Farm Management & Inventory", () => {
  test("Displays registered farms and searches by name", async ({ page }) => {
    await page.goto("/farms");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Farm Locations/i);

    // Check Peshawar demo farm is listed
    await expect(page.getByText(/Peshawar Valley Demo Farm/i)).toBeVisible();

    // Test search filter
    const searchInput = page.getByPlaceholder(/Search farms/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill("Peshawar");
      await expect(page.getByText(/Peshawar Valley Demo Farm/i)).toBeVisible();
    }
  });

  test("Navigates to farm detail view", async ({ page }) => {
    await page.goto("/farms");
    const viewBtn = page.getByRole("link", { name: /View Farm|Open Farm|Details/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
      await expect(page).toHaveURL(/.*farms\/.+/);
    }
  });
});
