// @ts-check
/**
 * Main entry point for Catala playground
 */

import { getCurrentFileContent, switchToFile, updateCurrentFile, loadFromUrl, loadAllFiles, getAllFiles, getFileNames, getMainFile, currentFile, initializeDefaultFile, solutionFile, setSolutionFile, removeSolutionFile } from './files.js';
import { encodeWorkspace, decodeWorkspace } from './share.js';
import { downloadWorkspace } from './download.js';
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

/** Whether the last typecheck produced an error (used to clear status on recovery) */
let hadTypecheckError = false;

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
    if (hadTypecheckError) {
      setStatus(t('ready'), 'success');
      hadTypecheckError = false;
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
    hadTypecheckError = true;
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

/** @type {string | null} */
let solutionFilename = null;

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

  // Defer one tick so the browser can paint the "Running..." status before the
  // synchronous interpreter call blocks the main thread.
  setTimeout(() => {
    const result = executeScope(scopeName);
    const errors = getErrors(result.diagnostics);
    const warnings = getWarnings(result.diagnostics);

    if (result.success) {
      let html = `<span class="success">${escapeHtml(t('scopeSuccess', { scope: scopeName }))}\n\n</span>`;
      html += renderErrorHtml(result.output || '');
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
      displayOutput(errorHtml || `<span class="error">${escapeHtml(t('unknownError'))}</span>`, 'execution');
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
  // Save if current file is a live user file or the open solution file
  if (getFileNames().includes(currentFile) || currentFile === solutionFile) {
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

/** The user file that was active before the solution tab was opened. */
let preSolutionFile = /** @type {string | null} */ (null);

/**
 * Open (or reset) the solution tab: fetch content if not cached, then load it
 * as an ephemeral file tab. Clicking the Solution tab always resets content so
 * the user sees the canonical solution even if they edited it.
 */
async function showSolution() {
  if (!solutionUrl || !solutionFilename) return;
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
  // Remember where the user was so closing the solution returns them there
  if (currentFile !== solutionFilename) preSolutionFile = currentFile;
  setSolutionFile(solutionFilename, solutionContent);
  switchToFile(solutionFilename, setEditorContent);
  reRenderTabs();
  setStatus(t('viewingSolution'), 'info');
}

/**
 * Close and discard the solution tab (no confirmation).
 */
function closeSolution() {
  const returnTo = preSolutionFile ?? getMainFile();
  preSolutionFile = null;
  removeSolutionFile();
  switchToFile(returnTo, setEditorContent);
  reRenderTabs();
  setStatus(t('ready'), 'success');
}

/**
 * Re-render tabs (with solution tab when applicable)
 */
function reRenderTabs() {
  if (solutionUrl) {
    renderTabs(onSwitchFile, {
      filename: solutionFile,
      onActivate: showSolution,
      onClose: closeSolution
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
  solutionFilename = solutionUrl
    ? (solutionUrl.split('/').pop()?.split('?')[0] || null)
    : null;
  checkpointUrl = codeUrl;

  // shared= param: base64url-encoded deflate-compressed workspace snapshot.
  // When present it takes absolute priority over localStorage and codeUrl.
  const sharedData = hashParams.get('shared') || undefined;

  // Share button: shown unless share=false is passed in the hash params.

  // Invariant: shared= and localStorage are mutually exclusive — the URL hash IS
  // the persistent state when shared= is present.
  const persistEnabled = hashParams.get('persist') !== 'false' && !sharedData;
  console.assert(!sharedData || !persistEnabled, 'shared state implies no localStorage persistence');

  // Initialize default file with correct language before loading from storage
  initializeDefaultFile(getLang());

  // Initialize persistence (include lang for standalone playground storage key)
  initPersistence(checkpointId, persistEnabled, getLang());

  // Priority: shared > localStorage > codeUrl > empty
  if (sharedData) {
    setStatus(t('loadingCode'), 'success');
    try {
      const state = await decodeWorkspace(sharedData);
      loadAllFiles(state);
    } catch (err) {
      setStatus(t('loadFailed', { error: String(err) }), 'error');
    }
  } else {
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
  }

  // Initialize Monaco editor
  await initializeEditor(
    getCurrentFileContent(),
    runScope,
    () => {
      scheduleSave(getEditorContent, updateCurrentFile);
      scheduleTypecheck();
    },
    () => {
      updateCurrentFile(getEditorContent());
      const filename = downloadWorkspace(getAllFiles().files);
      setStatus(t('downloaded', { filename }), 'success');
    }
  );

  // Wire up navigation callback for clickable error positions
  setNavigationCallback((filename, line, col) => {
    if (filename !== currentFile && getFileNames().includes(filename)) {
      onSwitchFile(filename);
      // Wait one tick for the editor model to update before moving cursor
      setTimeout(() => editorNavigateTo(line, col), 50);
    } else {
      editorNavigateTo(line, col);
    }
  });

  // Render initial tabs
  reRenderTabs();

  // Setup share button. Shown by default; pass share=false in hash to hide (e.g. learn.html).
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    if (hashParams.get('share') !== 'false') shareBtn.style.display = 'inline-block';
    shareBtn.addEventListener('click', async () => {
      updateCurrentFile(getEditorContent());
      const state = getAllFiles();
      try {
        const encoded = await encodeWorkspace(state);
        const url = `${window.location.origin}${window.location.pathname}#shared=${encoded}&lang=${getLang()}`;
        await navigator.clipboard.writeText(url);
        setStatus(t('shareCopied'), 'success');
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.startsWith('workspace_too_large:')) {
          const bytes = parseInt(msg.split(':')[1], 10);
          const kb = Math.ceil(bytes / 1024);
          setStatus(t('shareTooLarge', { size: String(kb) }), 'error');
        } else {
          setStatus(t('shareFailed'), 'error');
        }
      }
    });
  }

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

// ============================================================================
// Public JS API for embedders
// ============================================================================

// Exposed synchronously (before init()) so same-origin embedders like learn.html
// can call these in an iframe load event without worrying about async timing.
/** @type {any} */ (window).playground = {
  /** Hide the share button (called by learn.html to suppress sharing in tutorial mode) */
  hideShare() {
    const btn = document.getElementById('shareBtn');
    if (btn) btn.style.display = 'none';
  },
  /** Show the share button (restores default visibility) */
  showShare() {
    const btn = document.getElementById('shareBtn');
    if (btn) btn.style.display = 'inline-block';
  }
};

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
