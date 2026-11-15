import { test, expect } from "@playwright/test";

test.describe("Multi-NASA Earth Observation Traffic-Light Checkup", () => {
  test("Loads SMAP, IMERG, NDVI, and POWER traffic lights on farmer dashboard", async ({ page }) => {
    await page.goto("/dashboard/farmer");

    // Title / Header
    await expect(page.getByText(/NASA Satellite Checkup|Traffic-Light Status/i).first()).toBeVisible();

    // Verify presence of SMAP, IMERG, NDVI, POWER badges
    await expect(page.getByText(/SMAP/i).first()).toBeVisible();
    await expect(page.getByText(/IMERG/i).first()).toBeVisible();
    await expect(page.getByText(/NDVI/i).first()).toBeVisible();
    await expect(page.getByText(/POWER/i).first()).toBeVisible();

    // Verify local ground check alert appears
    await expect(page.getByText(/Local Check/i).first()).toBeVisible();
  });
});
