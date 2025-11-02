import { test, expect } from '@playwright/test';

test('@smoke - has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});


test('@smoke - get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


test('@smoke - Dynamic table with Map', async ({ page }) => {
  await page.goto('http://www.uitestingplayground.com/dynamictable');
  
  const headers = await page.locator("span[role='columnheader']").allTextContents();
  const row =  page.locator("div[role='row']",{hasText :'System'});
  const cellValues = await row.locator("span[role='cell']").allTextContents();

  const map = new Map();
  for(let i=0; i<headers.length; i++){
    map.set(headers[i].trim(),  cellValues[i].trim());
  }
 
  for(let [key,value] of map){
    console.log(`${key} : ${value}`);
  }
});


test('@regression - Dynamic table with Object', async ({ page }) => {
  await page.goto('http://www.uitestingplayground.com/dynamictable');
  
  const headers = await page.locator("span[role='columnheader']").allTextContents();
  const row =  page.locator("div[role='row']",{hasText :'System'});
  const cellValues = await row.locator("span[role='cell']").allTextContents();

  const obj:Record<string,string> = {};
  for(let i=0; i<headers.length; i++){
    obj[headers[i].trim()] = cellValues[i].trim();
  }
  console.log(obj);
});