/* eslint-disable */
import puppeteer from 'puppeteer';

(async () => {
  // Recall our sources
  const sources = [
    'https://en.wikipedia.org/wiki/List_of_Greek_and_Latin_roots_in_English/A%E2%80%93G',
    'https://en.wikipedia.org/wiki/List_of_Greek_and_Latin_roots_in_English/H%E2%80%93O',
    'https://en.wikipedia.org/wiki/List_of_Greek_and_Latin_roots_in_English/P%E2%80%93Z',
  ];
  // Create browser and new tab
  const browser = await puppeteer.launch({ headless: false });
  const actions = [];
  // For every source
  for (let i = 0; i < sources.length; ++i) {
    actions.push(
      (async () => {
        // Open the page
        const page = await browser.newPage();
        await page.goto(sources[i]);
        // Get the tables
        const tables = await page.$$('table');
        // Loob through tables
        for (let i = 0; i < tables.length; i++) {
          // First get the header
          const thead = await tables[i].$('thead');
          if (!thead) {
            continue;
          }
          // then get th in header
          const theadth = await thead.$$('th');
          if (!theadth) {
            continue;
          }
          // Loop through object and build object headers hopefully
          const names = [];
          for(let i = 0; i < theadth.length; ++i){
            names.push(await theadth[i].getProperty('innerHTML').toString());
          }
          // Loop through tbody
          const tbody = await tables[i].$('tbody');
          if(!tbody) {
            continue;
          }
          // Get rows in tbody
          const trs = await tbody.$$('tr');
          if(!trs){
            continue;
          }
          // Create card array
          const cards = [];
          // Loop through rows
          for(let i = 0; i < trs.length; i++){
            // Get td
            const tds = await trs[i].$$('td');
            if(!tds){
              continue;
            }
            // Create card
            const card = {};
            // For every td
            for(let j = 0; j < tds.length; j++){
              // Card with names[i] has property of tds inner html
              card[names[j]]
            }
          }
        }
      })()
    );
  }
  await Promise.allSettled(actions);

  // Then select links
  // await browser.close();
})();
