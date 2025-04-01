import puppeteer from 'puppeteer';
import {setTimeout} from "node:timers/promises";

// Or import puppeteer from 'puppeteer-core';
const legitHostLogin = 'https://app.revolt.chat/login';
const spoofHostLogin = 'https://revolt.onech.at/login';
const spoofHostChannel = 'https://revolt.onech.at/server/01JQS39HAPK7T569HV0DGN5ZRN/channel/01JQS3BBTR6677TZ589N9VGK0P';
const claim = '/claim';
const email = '';
const normalPword = '';
const spoofPword = '';

// Launch the browser and open a new blank page
const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto(spoofHostLogin);

// Set screen size.
// await page.setViewport({width: 1080, height: 1024});

// Type into search box. 
await page.locator('#app > div > div > div._form_1xdze_87 > div > form > input:nth-child(2)').fill(email);
await page.locator('#app > div > div > div._form_1xdze_87 > div > form > input:nth-child(4)').fill(spoofPword);
await setTimeout(3000);

// Wait and click on first result.
await page.locator('#app > div > div > div._form_1xdze_87 > div > form > button').click();


await setTimeout(2000);
await page.goto(spoofHostChannel);
await setTimeout(1000);
await page.locator('#message').fill(claim);
await page.keyboard.press('Enter');
await setTimeout(500);
await page.locator('#message').fill('YUHHHHHH');
await page.keyboard.press('Enter');
// Locate the full title with a unique string.
// const textSelector = await page
//   .locator('text/Customize and automate')
//   .waitHandle();
// const fullTitle = await textSelector?.evaluate(el => el.textContent);

// Print the full title.
// console.log('The title of this blog post is "%s".', fullTitle);

// await browser.close();