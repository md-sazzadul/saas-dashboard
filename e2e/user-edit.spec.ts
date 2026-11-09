import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test.beforeEach(async () => {
  await mkdir("screenshots", { recursive: true });
});

test("an operator edits a user and sees the update after reload", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("admin@example.com");
  await page.getByLabel("Password", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("Welcome back, Admin!")).toBeHidden();

  const row = page.getByRole("row", { name: /View details for John Doe/ });
  await expect(row).toBeVisible();
  await page.screenshot({ path: "screenshots/dashboard.png", fullPage: true });
  await row.click();
  await page.getByRole("button", { name: "Edit user" }).click();
  await page.getByRole("textbox", { name: "Name" }).fill("John Smith");
  await page.getByRole("textbox", { name: "Company" }).fill("Northstar Labs");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("User details saved")).toBeVisible();
  await expect(page.getByRole("heading", { name: "John Smith" })).toBeVisible();
  await page.screenshot({ path: "screenshots/user-edit-saved.png", fullPage: true });

  await page.reload();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("row", { name: /John Smith/ })).toBeVisible();
});

test("captures the edit form as a README reference image", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("admin@example.com");
  await page.getByLabel("Password", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("Welcome back, Admin!")).toBeHidden();
  await page.getByRole("row", { name: /View details for John Doe/ }).click();
  await page.getByRole("button", { name: "Edit user" }).click();
  await expect(page.getByRole("heading", { name: "Edit account" })).toBeVisible();
  await page.screenshot({ path: "screenshots/user-edit-form.png", fullPage: true });
});
