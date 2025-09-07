import { test, request, expect } from "@playwright/test";
import { fetchEmails } from "../utils/gmailUtils";

test("Gmail -Email Reading Test", async ({ page, request }) => {
  test.setTimeout(120000);
  const body = await fetchEmails(
    "milind.ghoongade@gmail.com",
    "aeve xsgq mizi rrib",
    "INBOX",
    "Test Automation Email 2025"
  );

  if (body) {
    console.log("✅ Found the latest email with subject!");
  } else {
    console.log("❌ No matching email found in latest message");
  }

  expect(body).toContain("Please confirm receipt of this email");

  const ticketIdMatch = body.match(/Ticket ID:\s*(\d+)/);
  expect(ticketIdMatch[1]).toBe("12345");

  const userIdMatch = body.match(/User ID:\s*(QA-\d+)/);
  expect(userIdMatch[1]).toBe("QA-9876");

  expect(body).toContain("Priority: High");

  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = body.match(urlRegex);

  for (let url of urls) {
    const response = await request.get(url);
    expect(response.status()).not.toBe(200);
  }
});
