import { test, expect } from "@playwright/test";

test.describe("Global Navigation & Route Audit", () => {
  test("Landing page loads with hero, title and branding", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AgroShift/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/NASA|Farm Decisions/i);
    await expect(page.getByRole("link", { name: /Start Farm Checkup|Start Farmer Onboarding/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "View Live Demo" })).toBeVisible();
  });

  test("Primary navigation bar links route to existing pages", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("banner");
    
    // Farmer View
    await nav.getByRole("link", { name: "Farmer View", exact: true }).click();
    await expect(page).toHaveURL(/.*dashboard\/farmer/);
    await expect(page.getByText(/NASA Satellite Checkup|Traffic-Light Status/i).first()).toBeVisible();

    // 3-Strategy Compare
    await nav.getByRole("link", { name: "3-Strategy Compare", exact: true }).click();
    await expect(page).toHaveURL(/.*recommendations\/compare/);

    // Onboarding
    await nav.getByRole("link", { name: "Onboarding", exact: true }).click();
    await expect(page).toHaveURL(/.*onboarding/);

    // Dashboard
    await nav.getByRole("link", { name: "Dashboard", exact: true }).click();
    await expect(page).toHaveURL(/.*dashboard/);

    // NASA Climate
    await nav.getByRole("link", { name: "NASA Climate", exact: true }).click();
    await expect(page).toHaveURL(/.*dashboard\/climate/);

    // Farms
    await nav.getByRole("link", { name: "Farms", exact: true }).click();
    await expect(page).toHaveURL(/.*farms/);

    // Crops
    await nav.getByRole("link", { name: "Crops", exact: true }).click();
    await expect(page).toHaveURL(/.*crops/);

    // Reports
    await nav.getByRole("link", { name: "Reports", exact: true }).click();
    await expect(page).toHaveURL(/.*dashboard\/reports/);
  });
});
