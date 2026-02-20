#!/usr/bin/env node
/**
 * Lint for unused i18n keys.
 * Usage: node scripts/lint-i18n.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function findDefinedI18nKeys() {
  const i18nFile = path.join(ROOT, 'js', 'i18n.js');
  const content = fs.readFileSync(i18nFile, 'utf8');

  const keys = new Map(); // key -> line number
  const lines = content.split('\n');
  let inEnSection = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('en: {')) {
      inEnSection = true;
      braceDepth = 1;
      continue;
    }
    if (inEnSection) {
      braceDepth += (line.match(/{/g) || []).length;
      braceDepth -= (line.match(/}/g) || []).length;
      if (braceDepth <= 0) {
        inEnSection = false;
        continue;
      }
      const match = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*):\s*['"]/);
      if (match) {
        keys.set(match[1], i + 1);
      }
    }
  }

  return keys;
}

function findUsedI18nKeys() {
  const used = new Set();
  const jsDir = path.join(ROOT, 'js');
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

  for (const file of jsFiles) {
    const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
    const matches = content.matchAll(/\bt\(['"]([^'"]+)['"]/g);
    for (const match of matches) {
      used.add(match[1]);
    }
  }

  return used;
}

const defined = findDefinedI18nKeys();
const used = findUsedI18nKeys();
let hasErrors = false;

for (const [key, line] of defined) {
  if (!used.has(key)) {
    console.log(`  js/i18n.js:${line} - unused key: ${key}`);
    hasErrors = true;
  }
}

if (!hasErrors) {
  console.log('No unused i18n keys found.');
}

process.exit(hasErrors ? 1 : 0);
