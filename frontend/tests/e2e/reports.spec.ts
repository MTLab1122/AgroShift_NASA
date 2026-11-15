import { test, expect } from "@playwright/test";

test.describe("Executive PDF & CSV Reports Export", () => {
  test("Loads reports page with PDF and CSV export action buttons", async ({ page }) => {
    await page.goto("/dashboard/reports");

    // Title
    await expect(page.getByText(/Export & Reporting Hub|Export Reports/i).first()).toBeVisible();

    // Verify PDF and CSV trigger buttons exist
    await expect(page.getByRole("button", { name: /Export PDF Report|Export PDF/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Export Climate CSV|Export Climate/i })).toBeVisible();
  });
});
