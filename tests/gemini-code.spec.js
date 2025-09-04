import { test, expect } from "@playwright/test";
import { generatePlaywrightSteps } from "../utils/gemini-helper";
import fs from "fs";

test("Code Steps Generate", async () => {
  const task = `
    1. Open the URL: https://basecopy5.staging.pg-test.com/v2/
    2. Click on the 'Sign In' button
    3. Enter 'mgs@gmail.com' in the email field and 'Mgs@1213' in the password field
    4. Click on the 'Login' button
    5. Wait until all user names are visible
    6. Extract all user names from the page
    7. Print the extracted user names in the console
    8. Validate that each extracted user name is not null or empty
  `;

  const code = await generatePlaywrightSteps(task);
  await fs.promises.writeFile("tests/ai-test.spec.ts", code, "utf8");
});
