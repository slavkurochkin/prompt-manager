import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

try {
  console.log('Navigating to http://localhost:5174/...');
  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(2000);

  console.log('Clicking Requirements Constructor button...');
  await page.click('button:has-text("Requirements Constructor")');
  await page.waitForTimeout(1000);

  console.log('Expanding Technical Architecture section...');
  await page.click('div:has-text("Technical Architecture")');
  await page.waitForTimeout(1000);

  console.log('Selecting React from Frontend Framework dropdown...');
  const frontendSelect = page.locator('select').first();
  await frontendSelect.selectOption('React');
  await page.waitForTimeout(500);

  console.log('Checking if clear button is visible...');
  const clearButton = page.locator('.btn-clear-select').first();
  const isVisible = await clearButton.isVisible();
  console.log(`Clear button visible: ${isVisible}`);

  if (isVisible) {
    console.log('Clicking clear button...');
    await clearButton.click({ force: true });
    await page.waitForTimeout(500);

    console.log('Checking if value was cleared...');
    const selectValue = await frontendSelect.inputValue();
    console.log(`Select value after clear: "${selectValue}"`);
    
    if (selectValue === '') {
      console.log('✅ SUCCESS: Clear button worked! Value was cleared.');
    } else {
      console.log('❌ FAILED: Clear button did not work. Value is still:', selectValue);
    }
  } else {
    console.log('❌ Clear button is not visible');
  }

  console.log('\nTest completed. Browser will stay open for 5 seconds...');
  await page.waitForTimeout(5000);
} catch (error) {
  console.error('Error during test:', error);
} finally {
  await browser.close();
}

