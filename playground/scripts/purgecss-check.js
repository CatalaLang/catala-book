/**
 * Dead CSS detection using PurgeCSS.
 * Usage: node scripts/purgecss-check.js
 */

import { PurgeCSS } from 'purgecss';
import { glob } from 'glob';

const cssFiles = glob.sync('css/**/*.css', { cwd: new URL('..', import.meta.url).pathname });
const contentFiles = glob.sync('{js/**/*.js,*.html}', { cwd: new URL('..', import.meta.url).pathname });

const result = await new PurgeCSS().purge({
  content: contentFiles.map(f => new URL(`../${f}`, import.meta.url).pathname),
  css: cssFiles.map(f => new URL(`../${f}`, import.meta.url).pathname),
  rejected: true,
  safelist: {
    standard: ['html', 'body'],
    greedy: [/^ansi-/],
  },
});

let hasUnused = false;

for (const file of result) {
  if (file.rejected && file.rejected.length > 0) {
    console.log(`\nUnused CSS selectors in ${file.file}:`);
    for (const selector of file.rejected) {
      console.log(`  - ${selector}`);
    }
    hasUnused = true;
  }
}

if (hasUnused) {
  console.error('\nError: unused CSS selectors found.');
  process.exit(1);
} else {
  console.log('No unused CSS selectors found.');
}
