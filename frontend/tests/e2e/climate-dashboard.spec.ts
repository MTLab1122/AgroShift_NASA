import { test, expect } from "@playwright/test";

test.describe("NASA POWER Climate Engine UI", () => {
  test("Loads climate metrics, source badges, and visualizations", async ({ page }) => {
    await page.goto("/dashboard/climate");
    
    // Check main title and NASA POWER provenance
    await expect(page.getByText(/NASA POWER/i).first()).toBeVisible();
    await expect(page.getByText(/Temperature|Precipitation/i).first()).toBeVisible();

    // Verify parameter metrics appear
    await expect(page.getByText(/Mean Air Temp|T2M/i).first()).toBeVisible();

    // Verify demo banner or provenance is active
    const demoOrProvenance = page.getByText(/Demo Data|NASA POWER/i);
    await expect(demoOrProvenance.first()).toBeVisible();
  });
});
