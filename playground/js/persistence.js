// @ts-check
/**
 * LocalStorage persistence for playground state
 */

import { getAllFiles, loadAllFiles } from './files.js';

/** @type {string | undefined} */
let storageKey;

/** @type {boolean} */
let enabled = true;

/** @type {number | undefined} */
let saveTimeout;

/**
 * Initialize persistence with a checkpoint ID
 * @param {string | undefined} checkpointId
 * @param {boolean} persistEnabled
 * @param {string} lang - Language code for default storage key
 */
export function initPersistence(checkpointId, persistEnabled, lang = 'en') {
  enabled = persistEnabled;
  storageKey = checkpointId ? `catala-learn-${checkpointId}` : `catala-playground-${lang}`;
}

/**
 * Schedule a debounced save to localStorage
 * @param {() => string} getEditorContent - Function to get current editor content
 * @param {(content: string) => void} updateCurrentFile - Function to update file state
 */
export function scheduleSave(getEditorContent, updateCurrentFile) {
  if (!enabled || !storageKey) return;

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = window.setTimeout(() => {
    if (!storageKey) return;
    updateCurrentFile(getEditorContent());
    const state = getAllFiles();
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, 1000);
}

/**
 * Load state from localStorage
 * @returns {boolean} - True if loaded successfully
 */
export function loadFromStorage() {
  if (!enabled || !storageKey) return false;

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const state = JSON.parse(saved);
      if (state.files && Object.keys(state.files).length > 0) {
        loadAllFiles(state);
        return true;
      }
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return false;
}

/**
 * Clear the current checkpoint's localStorage entry and cancel any pending save
 */
export function clearStorage() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = undefined;
  }
  if (storageKey) {
    localStorage.removeItem(storageKey);
  }
}
