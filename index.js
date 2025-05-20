import puppeteer from 'puppeteer';
import {setTimeout} from "node:timers/promises";

// just need the url to channel we want
const targetLoungeChannel = 'https://revolt.onech.at/server/01JDKH82R0RHG2VF9YDWKEFHC5/channel/01JDKJX5E3370PBN8121999MND';
const spoofLoungeChannel = 'https://app.revolt.chat/server/01JQT731F1T231HEBZ709M46V1/channel/01JQT7E1V0DHAQF2X5KPNDZVDW';
const claim = '/claim';

// Some tickets which are not disappearing are causing the bot to always claim them
// This blacklist should ignore them from being selected
const blackListedTickets = [
    'ticket-8650',
]

// STEPS
// 1.) in command prompt run the following command without leading 
// start chrome --remote-debugging-port=9222 --user-data-dir="C:\chrome-debug-profile"
// 2.) login to revolt chat in the browser that was opened
// 3.) open terminal ctrl + ` (tilda to the left of 1 key)
// 4.) run below command 
// node index.js
const browserURL = 'http://127.0.0.1:9222';
const browser = await puppeteer.connect({browserURL, defaultViewport: null,});
const page = await browser.newPage();

// TBD change below to targetLoungeChannel
await page.goto(targetLoungeChannel);

// will run infinitely
while (true){
    // try to get a ticket
    const ticket = await getTicket(page);
    if (ticket){
        const successful = await claimTicket(ticket);
        // Log the progress
        if (successful) {
            console.log('$$$ Claimed $$$');
            console.log('Waiting for cool off');
            // have a cool down
            // await setTimeout(1*20*1000); // testing cool down
            await setTimeout(7*60*1000); // prod cool down
        } else {
            console.log('Some one else claimed :(')
        }
        console.log('Going again')
    } else {
        // we do not have a ticket and we try again after half second pause
        await setTimeout(500);
    }
}


// takes in a page and tries to load the ticket
async function getTicket(page) {
    try {
        // will try to load ticket for 10 seconds. If it finds a ticket will return to be claimed
        // ATTENTION - Potential failure point if selector needs to be changed (because of channel name has different casing)

        // Get all div elements and then run through each
        const ticketElements = await page.$$("div");

        let validTicketElement = null;
        for (const el of ticketElements) {
            // Using aria-label to try and get ticket
            const label = await page.evaluate(el => el.getAttribute('aria-label'), el);

            // Get a ticket which matches the aria label for the ticket, but not the blacklisted tickets
            if (label && label.includes('ticket-') && !blackListedTickets.includes(label)) {
                // console.log("Here is the label", label)
                validTicketElement = el;
                break;
            }
          }
        if (validTicketElement === null) {
            throw new Error("No ticket found")
        }

        return validTicketElement;
      } catch (error) {
        // console.log(error)
        // we hit the 15 second timeout and return false so we don't try to click on nonexistent things
        await setTimeout(15*1000);
        console.log('no ticket found in past 15 seconds')
        return false;
      }
      
}

async function claimTicket(ticket) {
    try {
        // if we have a ticket we click on it
        await setTimeout(200);
        await ticket.click();
        // enter claim message
        await page.locator('#message').fill(claim);
        // wait half a second before pressing 'Enter' on keyboard
        await page.keyboard.press('Enter');
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
}