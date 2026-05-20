import { test, expect } from "@playwright/test";

test.describe("BPL MCH demo — happy path", () => {
  test.beforeAll(async ({ request }) => {
    // Reset + reseed before the test run
    const reset = await request.post("/demo/reset");
    expect(reset.ok()).toBeTruthy();
    const seed = await request.post("/demo/seed");
    expect(seed.ok()).toBeTruthy();
  });

  test("landing page exposes /field and /admin entry points", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/ASHA mobile view/)).toBeVisible();
    await expect(page.getByText(/District dashboard/)).toBeVisible();
  });

  test("/field shows Sreelakshmi as CRITICAL", async ({ page }) => {
    await page.goto("/field");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Sreelakshmi M.")).toBeVisible();
    await expect(page.getByText("Critical").first()).toBeVisible();
  });

  test("/admin shows KPIs, alerts panel, scheme compliance", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("Mothers tracked")).toBeVisible();
    await expect(page.getByText("High-risk pregnancies")).toBeVisible();
    await expect(page.getByText("Live alerts")).toBeVisible();
    await expect(page.getByText("Scheme compliance")).toBeVisible();
  });

  test("admin can drill into Sreelakshmi's beneficiary detail", async ({ page }) => {
    await page.goto("/admin/people");
    await page.getByText("Sreelakshmi M.").first().click();
    await expect(page.getByText(/G2P1/).first()).toBeVisible();
    await expect(page.getByText("Visit history")).toBeVisible();
  });

  test("admin can open the SOS alert detail", async ({ page }) => {
    await page.goto("/admin/alerts");
    await page.getByText("SOS").first().click();
    await expect(page.getByText("Dispatch channels")).toBeVisible();
    await expect(page.getByText("102_ambulance")).toBeVisible();
  });

  test("schemes page shows compliance and PMMVY rows", async ({ page }) => {
    await page.goto("/admin/schemes");
    await expect(page.getByText("PMMVY").first()).toBeVisible();
    await expect(page.getByText("Sreelakshmi M.").first()).toBeVisible();
  });

  test("integrations page shows ABHA + HMIS tiles", async ({ page }) => {
    await page.goto("/admin/integrations");
    await expect(page.getByText("ABHA").first()).toBeVisible();
    await expect(page.getByText("HMIS").first()).toBeVisible();
  });

  test("registration wizard reaches OTP step", async ({ page }) => {
    await page.goto("/field/register");
    await page.getByPlaceholder("Head of family").fill("Test Head");
    // Block dropdown — select Agali
    await page.locator("select").first().selectOption("Agali");
    await page.locator("select").nth(1).selectOption("Agali");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByPlaceholder("Mother's name").fill("Test Mother");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Verify OTP")).toBeVisible();
  });

  test("Ctrl+Shift+D opens narrator panel", async ({ page }) => {
    await page.goto("/admin");
    await page.keyboard.press("Control+Shift+D");
    await expect(page.getByText("Narrator controls")).toBeVisible();
  });
});
