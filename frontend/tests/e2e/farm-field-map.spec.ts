import { test, expect } from "@playwright/test";

test.describe("Farm Field Map & Boundary Selection Workflow", () => {
  test("Loads Create Farm page with interactive map and field boundary controls", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/farms/new");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Register New Farm/i);

    // Verify map canvas renders
    const map = page.locator(".leaflet-container");
    await expect(map).toBeVisible({ timeout: 10000 });

    // Verify legal disclaimer note is present
    await expect(
      page.getByText(/Draw your field boundary to estimate its area. This is an approximate map-based measurement, not an official land survey./i)
    ).toBeVisible();

    // Verify initial area display
    await expect(page.getByText(/Field Area/i)).toBeVisible();

    // Verify drawing controls exist
    await expect(page.getByRole("button", { name: /Set Location/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Draw Field Boundary/i })).toBeVisible();

    // Verify unit selector buttons exist
    await expect(page.getByRole("button", { name: "Acres" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Hectares" })).toBeVisible();

    // Verify manual area override input
    await expect(page.getByLabel(/Manual area override/i)).toBeVisible();

    // Verify no SSR errors or broken markers
    expect(consoleErrors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("Allows location marker placement and interactive field boundary drawing", async ({ page }) => {
    await page.goto("/farms/new");

    const map = page.locator(".leaflet-container");
    await expect(map).toBeVisible({ timeout: 10000 });

    // Place location marker by clicking on map
    await map.click({ position: { x: 200, y: 150 } });

    // Verify marker pin is placed
    await expect(page.locator(".custom-farm-pin, .map-pin").first()).toBeVisible();

    // Click Draw Field Boundary tool
    const drawBtn = page.getByRole("button", { name: /Draw Field Boundary/i });
    await drawBtn.click();

    // Draw a 3-point polygon shape by clicking vertices
    await map.click({ position: { x: 180, y: 130 } });
    await map.click({ position: { x: 260, y: 130 } });
    await map.click({ position: { x: 220, y: 220 } });

    // Complete shape button should become visible
    const completeBtn = page.getByRole("button", { name: /Complete Shape/i });
    await expect(completeBtn).toBeVisible();
    await completeBtn.click();

    // Verify area is calculated and labeled
    await expect(page.getByText(/Calculated from drawn field boundary/i)).toBeVisible();

    // Switch unit to Hectares
    const haBtn = page.getByRole("button", { name: "Hectares" });
    await haBtn.click();
    await expect(haBtn).toHaveClass(/bg-white/);

    // Switch unit back to Acres
    const acresBtn = page.getByRole("button", { name: "Acres" });
    await acresBtn.click();
    await expect(acresBtn).toHaveClass(/bg-white/);

    // Verify clear boundary works
    const clearBtn = page.getByRole("button", { name: /Clear Boundary/i });
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();

    // Verify area resets to prompt
    await expect(page.getByText(/Draw your field boundary to calculate its area/i)).toBeVisible();
  });

  test("Saves farm holding with boundary and renders preview on detail page", async ({ page }) => {
    await page.goto("/farms/new");

    const map = page.locator(".leaflet-container");
    await expect(map).toBeVisible({ timeout: 10000 });

    // Fill form details
    const uniqueName = `Charsadda Geo Boundary Farm ${Date.now()}`;
    await page.getByPlaceholder(/e\.g\. Mardan Sugar/i).fill(uniqueName);

    // Set location
    await map.click({ position: { x: 220, y: 180 } });

    // Draw boundary
    await page.getByRole("button", { name: /Draw Field Boundary/i }).click();
    await map.click({ position: { x: 190, y: 150 } });
    await map.click({ position: { x: 270, y: 150 } });
    await map.click({ position: { x: 250, y: 230 } });
    await page.getByRole("button", { name: /Complete Shape/i }).click();

    // Submit form
    await page.getByRole("button", { name: /Save Farm Profile/i }).click();

    // Wait for redirect to farm detail
    await expect(page).toHaveURL(/.*farms\/.+/, { timeout: 10000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(uniqueName);

    // Verify farm detail displays saved boundary indicator and disclaimer
    await expect(page.getByText(/Field boundary is approximate and based on the farmer-selected map area/i)).toBeVisible();

    // Verify Edit Farm link exists and navigate to edit
    const editLink = page.getByRole("link", { name: /Edit Farm/i });
    await expect(editLink).toBeVisible();
    await editLink.click();

    // Verify Edit page loaded with mapper
    await expect(page).toHaveURL(/.*farms\/.*\/edit/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Edit Farm Profile & Field Boundary/i);
    await expect(page.locator(".leaflet-container")).toBeVisible();
  });
});
