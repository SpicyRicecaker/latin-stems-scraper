/* eslint-disable */
import { chromium } from 'playwright';
import { Map } from './types/types';
import { promises as fs } from 'fs';

(async () => {
  // Recall our sources
  const sources = [
    'https://en.wikipedia.org/wiki/List_of_Greek_and_Latin_roots_in_English/A%E2%80%93G',
    'https://en.wikipedia.org/wiki/List_of_Greek_and_Latin_roots_in_English/H%E2%80%93O',
    'https://en.wikipedia.org/wiki/List_of_Greek_and_Latin_roots_in_English/P%E2%80%93Z',
  ];
  // Create browser and new tab
  const browser = await chromium.launch();
  const actions = [];
  // For every source
  for (let i = 0; i < sources.length; ++i) {
    actions.push(
      (async (): Promise<any[]> => {
        // Open the page
        const page = await browser.newPage();
        await page.goto(sources[i]);
        await page.waitForSelector('table');
        // Evaluate table
        return page.evaluate((): any[] => {
          // All our cards
          const cards = [];
          // Get table
          const tables = document.querySelectorAll('table');
          // Loop through every table
          for (let i = 0; i < tables.length; ++i) {
            // Define our properties
            const properties = [];
            // By first getting the table headers
            const headers = tables[i]
              .querySelector('thead')
              ?.querySelector('tr')
              ?.querySelectorAll('th');
            if (!headers) {
              continue;
            }
            // For each header
            for (let j = 0; j < headers.length; ++j) {
              // Push to properties
              properties.push(headers[j].innerHTML);
            }
            // Next get all the rows in the body of the table
            const rows = tables[i]
              .querySelector('tbody')
              ?.querySelectorAll('tr');
            if (!rows) {
              continue;
            }
            // For every row
            for (let j = 0; j < rows.length; ++j) {
              // Create an empty card to store our properties
              const card: Map = {};
              // Get every cell in the row
              let cells = rows[j].querySelectorAll('td');
              if (!cells) {
                continue;
              }
              // For each cell
              for (let k = 0; k < cells.length; ++k) {
                // Recall our properties that we defined earlier
                // Add innerhtml to object with property based off of k
                if (properties[k]) {
                  card[properties[k]] = cells[k].innerHTML;
                }
              }
              // Push our finished card into our array of cards
              cards.push(card);
            }
          }
          return cards;
        });
      })()
    );
  }
  let res = await Promise.allSettled(actions);
  // Then select links
  await browser.close();
  // Flatten
  // Stringify
  // Write to file
  await fs.writeFile(
    'latin-stems.json',
    JSON.stringify(
      res.flatMap((cards, i) => {
        if (cards.status === 'fulfilled') {
          return cards.value;
        } else {
          console.log(`Source ${i} has errored.`);
        }
      })
    )
  );
})();
