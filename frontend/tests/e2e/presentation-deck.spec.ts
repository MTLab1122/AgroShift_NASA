import { test, expect } from "@playwright/test";
import path from "path";

test.describe("AgroShift 7-Slide Presentation Deck", () => {
  test("Loads presentation deck, navigates 7 slides, and displays speaker notes", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    const deckPath = path.resolve(__dirname, "../../../docs/presentation/AgroShift_7_Slide_Deck.html");
    const deckUrl = `file:///${deckPath.replace(/\\/g, "/")}`;

    await page.goto(deckUrl);

    // Slide 1 Verification
    await expect(page.locator("#slide-1")).toHaveClass(/active/);
    await expect(page.locator("#slide-1").getByRole("heading", { level: 1 })).toContainText(/AgroShift/i);
    await expect(page.locator("#slide-1").getByText(/Abasyn University Peshawar/i)).toBeVisible();

    // Toggle Speaker Notes drawer
    await page.keyboard.press("n");
    const notesDrawer = page.locator("#speaker-notes-drawer");
    await expect(notesDrawer).toHaveClass(/open/);
    await expect(page.locator("#speaker-note-text")).toContainText(/AgroShift helps farmers and local advisors/i);

    // Navigate to Slide 2
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#slide-2")).toHaveClass(/active/);
    await expect(page.locator("#slide-2").getByRole("heading", { level: 2 })).toContainText(/Farmers need clear answers/i);

    // Navigate to Slide 3
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#slide-3")).toHaveClass(/active/);
    await expect(page.locator("#slide-3").getByRole("heading", { level: 2 })).toContainText(/Pin your farm/i);

    // Navigate to Slide 4
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#slide-4")).toHaveClass(/active/);
    await expect(page.locator("#slide-4").getByText(/NASA POWER/i).first()).toBeVisible();
    await expect(page.locator("#slide-4").getByText(/SMAP/i).first()).toBeVisible();

    // Navigate to Slide 5
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#slide-5")).toHaveClass(/active/);
    await expect(page.locator("#slide-5").getByText(/Water Saver & Pulse Fix/i)).toBeVisible();

    // Navigate to Slide 6
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#slide-6")).toHaveClass(/active/);
    await expect(page.locator("#slide-6").getByText(/Local Check: Verify canal water schedules/i)).toBeVisible();

    // Navigate to Slide 7
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#slide-7")).toHaveClass(/active/);
    await expect(page.locator("#slide-7").getByText(/Muhammad Talha/i)).toBeVisible();
    await expect(page.locator("#slide-7").getByText(/Sana Jalal/i)).toBeVisible();
    await expect(page.locator("#slide-7").getByText(/Hira Dawood/i)).toBeVisible();
    await expect(page.locator("#slide-7").getByText(/Sudais Ahmad/i)).toBeVisible();
    await expect(page.locator("#slide-7").getByText(/Aqsa Faisal/i)).toBeVisible();
    await expect(page.locator("#slide-7").getByText(/AgroShift: NASA data, local decisions/i)).toBeVisible();

    // Verify timer is running
    await expect(page.locator("#presentation-timer")).toBeVisible();

    // Zero console errors
    expect(consoleErrors).toHaveLength(0);
  });
});
