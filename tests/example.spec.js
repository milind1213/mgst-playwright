import { test, expect } from "@playwright/test";

test("@smoke - has title", async ({ page }) => {
  await page.route("**/api/user/123", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 123,
        name: "Milind",
        email: "mgs.milind@gmail.com",
      }),
    });
  });
  await page.goto("https://playwright.dev/");
  await expect(page).toHaveTitle(/Playwright/);
});