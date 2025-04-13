import { test, expect } from "@playwright/test";

test("comment creation and interaction flow", async ({ page }) => {
  // 1. Visit the homepage
  await page.goto("/");

  // 2. Verify the page structure
  const container = page.locator(".mantine-Container-root");
  await expect(container).toBeVisible();

  // Check for the "Comments" divider that separates create form from comment list
  const divider = page.getByText("Comments").first();
  await expect(divider).toBeVisible();

  // 3. Create a new comment
  const editor = page.locator(".ProseMirror").first();
  await expect(editor).toBeVisible();

  await editor.click();
  const commentText = `Test comment ${Date.now()}`;
  await editor.type(commentText);

  // Find and click the submit/comment button
  const commentButton = page.getByRole("button", { name: /comment/i });
  await expect(commentButton).toBeEnabled();
  await commentButton.click();

  // 4. Verify the comment appears in the list
  await expect(page.getByText(commentText)).toBeVisible();
  await expect(page.getByText("John Doe").first()).toBeVisible();
});
