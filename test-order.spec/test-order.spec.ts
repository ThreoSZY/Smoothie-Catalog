import { test, expect, type Page } from "@playwright/test";

test.describe("Order is added successfully", async ({ page }) => {
  await page.goto("http://localhost:8096/customer/alice");

  const ingredientBtn = await page.locator(".btn-primary");
  ingredientBtn.click();

  const saveBtn = await page.locator("#save-btn");
  saveBtn.click();

  const submitBtn = await page.locator("#submit-btn");
  saveBtn.click();

  await expect(page.locator("tr:last-child")).toContainText("alice");

  await page.goto("http://localhost:8096/operator/jim");
  await expect(page.locator("tr:last-child")).toContainText("alice");
});
