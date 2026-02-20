// @ts-check
/**
 * UI management and output rendering
 */

import { getFileNames, addNewFile, deleteFile, currentFile, getMainFile } from './files.js';
import { t } from './i18n.js';

/**
 * Escape HTML special characters
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * @typedef {{ active: boolean, onShow: () => void, onHide: () => void }} SolutionTabConfig
 */

/**
 * Render file tabs
 * @param {(filename: string) => void} onSwitchFile - Callback when switching files
 * @param {SolutionTabConfig} [solutionTab] - Optional solution tab config
 * @returns {void}
 */
export function renderTabs(onSwitchFile, solutionTab) {
  const tabsContainer = document.getElementById('fileTabs');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = '';

  getFileNames().forEach(filename => {
    const tab = document.createElement('button');
    tab.className = 'file-tab' + (filename === currentFile ? ' active' : '');
    tab.dataset.file = filename;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = filename;
    tab.appendChild(nameSpan);

    // Add close button for non-main files
    if (filename !== getMainFile()) {
      const closeBtn = document.createElement('span');
      closeBtn.className = 'close-btn';
      closeBtn.textContent = '×';
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(t('confirmDelete', { filename }))) {
          deleteFile(filename);
          if (currentFile === filename) {
            onSwitchFile(getMainFile());
          } else {
            renderTabs(onSwitchFile);
          }
        }
      };
      tab.appendChild(closeBtn);
    }

    tab.onclick = () => onSwitchFile(filename);
    tabsContainer.appendChild(tab);
  });

  // Add button
  const addBtn = document.createElement('button');
  addBtn.className = 'add-file-btn';
  addBtn.textContent = '+';
  addBtn.title = t('addModuleFile');
  addBtn.onclick = () => {
    const name = prompt(t('promptFilename'));
    if (!name) return;
    const result = addNewFile(name);
    if ('error' in result) {
      alert(result.error);
      return;
    }
    onSwitchFile(result.filename);
  };
  tabsContainer.appendChild(addBtn);

  if (solutionTab) {
    const solTab = document.createElement('button');
    solTab.className = 'file-tab solution' + (solutionTab.active ? ' active' : '');
    solTab.textContent = t('solution');
    solTab.onclick = () => solutionTab.active ? solutionTab.onHide() : solutionTab.onShow();
    tabsContainer.appendChild(solTab);
  }
}

// ============================================================================
// Clickable source positions in error output
// ============================================================================

/** @type {((filename: string, line: number, col: number) => void) | null} */
let navigationCallback = null;

/**
 * Register callback for navigating to a source position when clicked
 * @param {(filename: string, line: number, col: number) => void} cb
 */
export function setNavigationCallback(cb) {
  navigationCallback = cb;
}

/** Matches Catala source positions: filename.catala_en:startLine.startCol-endLine.endCol */
const POS_PATTERN = /([\w][\w.-]*\.catala_(?:en|fr|pl)):(\d+)\.(\d+)-(\d+)\.(\d+)/g;

/** ANSI SGR color code → CSS color (dark theme palette) */
const ANSI_COLORS = /** @type {Record<number, string>} */ ({
  30: '#888888',  // black → dark gray (log)
  31: '#f48771',  // red (errors)
  32: '#89d185',  // green (results)
  33: '#e6b400',  // yellow (warnings)
  34: '#6b9bd1',  // blue (box drawing)
  35: '#c792ea',  // magenta (debug)
  36: '#56b6c2',  // cyan
  37: '#c8c9db',  // white
});

/**
 * Render an error message as HTML, converting ANSI color codes to styled spans
 * and turning source positions into clickable buttons. Works for both plain and
 * ANSI-colored messages.
 * @param {string} message
 * @returns {string}
 */
export function renderErrorHtml(message) {
  /** @type {number | null} */
  let currentColorCode = null;
  let isBold = false;
  let styleOpen = false;
  let html = '';
  let pos = 0;

  const closeStyle = () => {
    if (styleOpen) { html += '</span>'; styleOpen = false; }
  };
  const openStyle = () => {
    if (currentColorCode !== null || isBold) {
      // Monaco hover (supportHtml:true) sanitizes <span> attributes:
      //   - style= is kept only if it matches exactly /^(color:#hex;)?(background-color:#hex;)?$/
      //   - class= is kept only for "codicon codicon-*" patterns
      // So: emit color as inline style with trailing semicolon (survives Monaco sanitizer),
      // and bold only as a CSS class (works in the output panel, stripped in hover).
      const classes = [];
      let sty = '';
      if (currentColorCode !== null) {
        classes.push(`ansi-c${currentColorCode}`);
        const hex = ANSI_COLORS[currentColorCode];
        if (hex) sty = ` style="color:${hex};"`;
      }
      if (isBold) { classes.push('ansi-bold'); }
      const cls = classes.length ? ` class="${classes.join(' ')}"` : '';
      html += `<span${cls}${sty}>`;
      styleOpen = true;
    }
  };

  /** @param {string} str */
  const emitText = (str) => {
    let last = 0;
    for (const m of str.matchAll(POS_PATTERN)) {
      html += escapeHtml(str.slice(last, m.index));
      const [full, filename, startLine, startCol] = m;
      closeStyle();
      html +=
        `<button class="pos-link" data-file="${escapeHtml(filename)}" ` +
        `data-line="${startLine}" data-col="${startCol}">${escapeHtml(full)}</button>`;
      openStyle();
      last = /** @type {number} */ (m.index) + full.length;
    }
    html += escapeHtml(str.slice(last));
  };

  while (pos < message.length) {
    const escIdx = message.indexOf('\x1b[', pos);
    if (escIdx === -1) { emitText(message.slice(pos)); break; }
    if (escIdx > pos) emitText(message.slice(pos, escIdx));

    const endIdx = message.indexOf('m', escIdx + 2);
    if (endIdx === -1) { emitText(message.slice(escIdx)); break; }

    const codes = message.slice(escIdx + 2, endIdx).split(';').map(Number);
    pos = endIdx + 1;

    let changed = false;
    for (const code of codes) {
      if (code === 0) { currentColorCode = null; isBold = false; changed = true; }
      else if (code === 1) { isBold = true; changed = true; }
      else if (code === 39) { currentColorCode = null; changed = true; }
      else if (code >= 30 && code <= 37) { currentColorCode = code; changed = true; }
    }
    if (changed) { closeStyle(); openStyle(); }
  }

  closeStyle();
  return html;
}

// Delegated click handler for .pos-link buttons anywhere in the document
document.addEventListener('click', (e) => {
  const target = /** @type {HTMLElement} */ (e.target);
  if (target.classList.contains('pos-link') && navigationCallback) {
    const filename = target.dataset.file || '';
    const line = parseInt(target.dataset.line || '1', 10);
    const col = parseInt(target.dataset.col || '1', 10);
    navigationCallback(filename, line, col);
  }
});

// ============================================================================
// Output panel
// ============================================================================

/**
 * Track the source of current output content
 * @type {'typecheck' | 'execution' | null}
 */
let outputSource = null;

/**
 * Display output in the output panel
 * @param {string} html - HTML content to display
 * @param {'typecheck' | 'execution'} [source] - Source of the output
 * @returns {void}
 */
export function displayOutput(html, source) {
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = html;
    outputSource = source || null;
  }
}

/**
 * Clear output only if it came from a specific source
 * @param {'typecheck' | 'execution'} source
 * @returns {boolean} - Whether output was cleared
 */
export function clearOutputIfSource(source) {
  if (outputSource === source) {
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = '';
      outputSource = null;
    }
    return true;
  }
  return false;
}

/**
 * Update status message
 * @param {string} message
 * @param {'success' | 'error' | 'info'} [type='info']
 * @returns {void}
 */
export function setStatus(message, type = 'info') {
  const status = document.getElementById('status');
  if (status) {
    // Update status bar styling
    status.className = 'status-bar status-' + type;

    // Set text content (no need for inner span, styling is on the bar itself)
    status.textContent = message;
  }
}
