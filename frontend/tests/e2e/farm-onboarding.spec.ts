import { test, expect } from "@playwright/test";

test.describe("Farmer Onboarding & Voice-Assisted Flow", () => {
  test("Completes 4-step progressive onboarding workflow", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.getByText(/Step 1: Farm Location/i)).toBeVisible();

    // Step 1: Click Continue
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2: Select crop (Wheat) and Continue
    await expect(page.getByText(/Step 2: Select Current/i)).toBeVisible();
    const wheatCard = page.getByText(/Wheat/i).first();
    await expect(wheatCard).toBeVisible();
    await wheatCard.click();
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3: Irrigation and Continue
    await expect(page.getByText(/Step 3: Irrigation/i)).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 4: Goal and Submit
    await expect(page.getByText(/Step 4: Primary Goal/i)).toBeVisible();
    const submitBtn = page.getByRole("button", { name: /Submit & Generate NASA Plan|Generate/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Redirects to farmer dashboard
    await expect(page).toHaveURL(/.*dashboard\/farmer/);
  });
});
