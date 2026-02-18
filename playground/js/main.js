// @ts-check
/**
 * Main entry point for Catala playground
 */

import { getCurrentFileContent, switchToFile, updateCurrentFile, loadFromUrl, loadAllFiles, getFileNames, currentFile as getCurrentFile, initializeDefaultFile } from './files.js';
import { initializeEditor, setEditorContent, getEditorContent, clearErrorDecorations, markDiagnostics, navigateToPosition as editorNavigateTo } from './editor.js';
import { loadInterpreter, runScope as executeScope, typecheck as runTypecheck, interpreterReady, getErrors, getWarnings } from './interpreter.js';
import { renderTabs, displayOutput, clearOutputIfSource, setStatus, escapeHtml, setNavigationCallback, renderErrorHtml } from './ui.js';
import { initPersistence, scheduleSave, loadFromStorage, clearStorage } from './persistence.js';
import { t, initLangFromHash, updateStaticText, getLang } from './i18n.js';

// ============================================================================
// Live typechecking
// ============================================================================

/** @type {number | undefined} */
let typecheckTimeout;

/** Delay before running typecheck after last keystroke (ms) */
const TYPECHECK_DELAY = 1000;

/**
 * Schedule a typecheck after a delay (debounced)
 */
function scheduleTypecheck() {
  if (typecheckTimeout) {
    clearTimeout(typecheckTimeout);
  }
  typecheckTimeout = setTimeout(performTypecheck, TYPECHECK_DELAY);
}

/**
 * Run typecheck and update error markers
 */
function performTypecheck() {
  if (!interpreterReady) return;

  // Save current editor content first
  updateCurrentFile(getEditorContent());

  const result = runTypecheck();

  // Clear previous decorations
  clearErrorDecorations();

  const errors = getErrors(result.diagnostics);
  const warnings = getWarnings(result.diagnostics);

  if (result.success) {
    // No errors - clear any error status (but don't overwrite other statuses)
    const statusEl = document.getElementById('status');
    if (statusEl && statusEl.textContent === t('typecheckError')) {
      setStatus(t('ready'), 'success');
    }
    // Clear output only if it was from typecheck (preserve execution results)
    clearOutputIfSource('typecheck');

    // Show warnings as squiggles in editor (no output panel clutter)
    if (warnings.length > 0) {
      markDiagnostics(warnings);
    }
  } else {
    // Show all diagnostics (errors + warnings) in editor
    markDiagnostics(result.diagnostics);
    setStatus(t('typecheckError'), 'error');

    // Display error messages in output panel
    const errorHtml = errors
      .map(e => `<span class="error">${renderErrorHtml(e.message)}</span>`)
      .join('\n');
    if (errorHtml) {
      displayOutput(errorHtml, 'typecheck');
    }
  }
}

// ============================================================================
// Checkpoint URLs (set during init)
// ============================================================================

/** @type {string | undefined} */
let checkpointUrl;

/** @type {string | undefined} */
let solutionUrl;

// ============================================================================
// Scope execution
// ============================================================================

/**
 * Run a specific scope
 * @param {string} scopeName
 */
function runScope(scopeName) {
  setStatus(t('running', { scope: scopeName }), 'info');
  displayOutput('', 'execution');
  clearErrorDecorations();

  updateCurrentFile(getEditorContent());

  setTimeout(() => {
    const result = executeScope(scopeName);
    const errors = getErrors(result.diagnostics);
    const warnings = getWarnings(result.diagnostics);

    if (result.success) {
      let html = `<span class="success">Scope ${escapeHtml(scopeName)} executed successfully:\n\n</span>`;
      html += escapeHtml(result.output || '');
      // Show warnings as squiggles in editor (no output panel clutter)
      if (warnings.length > 0) {
        markDiagnostics(warnings);
      }
      displayOutput(html, 'execution');
      setStatus(t('ready'), 'success');
    } else {
      const errorHtml = errors
        .map(e => `<span class="error">${renderErrorHtml(e.message)}</span>`)
        .join('\n');
      displayOutput(errorHtml || `<span class="error">Unknown error</span>`, 'execution');
      setStatus(t('errorSeeOutput'), 'error');
      markDiagnostics(result.diagnostics);
    }
  }, 10);
}

// ============================================================================
// File management
// ============================================================================

/**
 * Handle file switching
 * @param {string} filename
 */
function onSwitchFile(filename) {
  if (viewingSolution) hideSolution();
  // Only save if current file still exists (may have been deleted)
  if (getFileNames().includes(getCurrentFile)) {
    updateCurrentFile(getEditorContent());
  }
  switchToFile(filename, setEditorContent);
  reRenderTabs();
}

// ============================================================================
// Checkpoint operations
// ============================================================================

/**
 * Reset to checkpoint (re-fetch from URL or clear to empty)
 */
async function resetToCheckpoint() {
  if (!confirm(t('confirmReset'))) {
    return;
  }

  clearStorage();

  if (checkpointUrl) {
    setStatus(t('resetting'), 'success');
    const result = await loadFromUrl(checkpointUrl);
    if (result.success) {
      setEditorContent(getCurrentFileContent());
      reRenderTabs();
      setStatus(t('resetComplete'), 'success');
    } else {
      setStatus(t('resetFailed', { error: result.error || '' }), 'error');
    }
  } else {
    loadAllFiles({ files: { 'main.catala_en': '' }, currentFile: 'main.catala_en' });
    setEditorContent('');
    reRenderTabs();
    setStatus(t('resetComplete'), 'success');
  }
}

// ============================================================================
// Solution tab
// ============================================================================

/** @type {string | null} */
let solutionContent = null;

/** @type {boolean} */
let viewingSolution = false;

/** @type {import('monaco-editor').editor.IStandaloneCodeEditor | null} */
let solutionEditor = null;

/**
 * Show solution in a read-only Monaco editor (main editor is untouched)
 */
async function showSolution() {
  if (!solutionUrl) return;
  if (!solutionContent) {
    setStatus(t('loadingSolution'), 'info');
    try {
      const response = await fetch(solutionUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      solutionContent = await response.text();
    } catch (err) {
      setStatus(t('solutionFailed', { error: String(err) }), 'error');
      return;
    }
  }
  // Create the solution Monaco editor lazily
  if (!solutionEditor) {
    // @ts-expect-error - Monaco loaded globally
    const monaco = window.monaco;
    solutionEditor = monaco.editor.create(document.getElementById('solution-editor'), {
      value: solutionContent,
      language: 'catala',
      theme: 'catala-dark',
      fontSize: 14,
      minimap: { enabled: false },
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      readOnly: true,
      codeLens: false,
      padding: { top: 10 }
    });
  } else {
    solutionEditor.setValue(solutionContent);
  }
  const editorEl = document.getElementById('editor-container');
  const solutionEl = document.getElementById('solution-view');
  if (editorEl) editorEl.style.display = 'none';
  if (solutionEl) solutionEl.style.display = 'block';
  viewingSolution = true;
  reRenderTabs();
  setStatus(t('viewingSolution'), 'info');
}

/**
 * Hide solution and show the editor again
 */
function hideSolution() {
  const editorEl = document.getElementById('editor-container');
  const solutionEl = document.getElementById('solution-view');
  if (solutionEl) solutionEl.style.display = 'none';
  if (editorEl) editorEl.style.display = 'block';
  viewingSolution = false;
  setStatus(t('ready'), 'success');
}

/**
 * Re-render tabs (with solution tab when applicable)
 */
function reRenderTabs() {
  if (solutionUrl) {
    renderTabs(onSwitchFile, {
      active: viewingSolution,
      onShow: showSolution,
      onHide: () => { hideSolution(); reRenderTabs(); }
    });
  } else {
    renderTabs(onSwitchFile);
  }
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Parse hash parameters (e.g., #codeUrl=...&foo=bar)
 * @returns {URLSearchParams}
 */
function getHashParams() {
  const hash = window.location.hash.slice(1);
  return new URLSearchParams(hash);
}

/**
 * Initialize the playground
 */
async function init() {
  // Initialize i18n from hash parameters
  initLangFromHash();
  updateStaticText();

  // Parse URL parameters
  const hashParams = getHashParams();
  const codeUrl = hashParams.get('codeUrl') || undefined;
  const checkpointId = hashParams.get('checkpointId') || undefined;
  solutionUrl = hashParams.get('solutionUrl') || undefined;
  checkpointUrl = codeUrl;

  const persistEnabled = hashParams.get('persist') !== 'false';

  // Initialize default file with correct language before loading from storage
  initializeDefaultFile(getLang());

  // Initialize persistence (include lang for standalone playground storage key)
  initPersistence(checkpointId, persistEnabled, getLang());

  // Try to load from localStorage first
  const loadedFromStorage = loadFromStorage();

  // If no saved state, load from URL (or start empty)
  if (!loadedFromStorage && codeUrl) {
    setStatus(t('loadingCode'), 'success');
    const result = await loadFromUrl(codeUrl);
    if (!result.success) {
      setStatus(t('loadFailed', { error: result.error || '' }), 'error');
    }
  }

  // Initialize Monaco editor
  await initializeEditor(
    getCurrentFileContent(),
    runScope,
    () => {
      scheduleSave(getEditorContent, updateCurrentFile);
      scheduleTypecheck();
    }
  );

  // Wire up navigation callback for clickable error positions
  setNavigationCallback((filename, line, col) => {
    if (filename !== getCurrentFile && getFileNames().includes(filename)) {
      onSwitchFile(filename);
      // Wait one tick for the editor model to update before moving cursor
      setTimeout(() => editorNavigateTo(line, col), 50);
    } else {
      editorNavigateTo(line, col);
    }
  });

  // Render initial tabs
  reRenderTabs();

  // Setup reset button
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    if (checkpointId) {
      resetBtn.style.display = 'inline-block';
      resetBtn.addEventListener('click', resetToCheckpoint);
    } else {
      resetBtn.style.display = 'none';
    }
  }

  // Load interpreter
  loadInterpreter((ready) => {
    if (ready) {
      setStatus(t('interpreterReady'), 'success');
      performTypecheck();
    } else {
      setStatus(t('interpreterFailed'), 'error');
    }
  });

}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Reload when hash changes (enables exercise switching from learn.html)
window.addEventListener('hashchange', () => {
  location.reload();
});
