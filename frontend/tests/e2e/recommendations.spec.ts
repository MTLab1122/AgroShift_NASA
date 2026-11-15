import { test, expect } from "@playwright/test";

test.describe("Three-Strategy Recommendation Engine & Comparison", () => {
  test("Loads 3-Strategy Comparison side-by-side with satellite evidence", async ({ page }) => {
    await page.goto("/recommendations/compare");

    // Title
    await expect(page.getByText(/Three-Strategy Rotation Comparison|Three-Strategy/i).first()).toBeVisible();

    // Verify all 3 strategy benchmarks exist
    await expect(page.getByText(/Baseline|Conventional/i).first()).toBeVisible();
    await expect(page.getByText(/Water-Saver Pulse Fix|Water Saver/i).first()).toBeVisible();
    await expect(page.getByText(/Soil-Shield Forage|Soil Shield/i).first()).toBeVisible();

    // Verify local check reminder is rendered
    await expect(page.getByText(/Local Check/i).first()).toBeVisible();
  });
});
