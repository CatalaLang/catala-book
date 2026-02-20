// @ts-check
/**
 * Catala interpreter wrapper
 * @typedef {import('./catala-jsoo').InterpretResult} InterpretResult
 * @typedef {import('./catala-jsoo').TypecheckResult} TypecheckResult
 * @typedef {import('./catala-jsoo').Diagnostic} Diagnostic
 * @typedef {import('./catala-jsoo').SourcePosition} SourcePosition
 */

import { files, getProjectLanguage, currentFile } from './files.js';

/** @type {boolean} */
export let interpreterReady = false;

/**
 * Load the interpreter script
 * @param {(ready: boolean) => void} onReady - Callback when interpreter is ready
 * @returns {void}
 */
export function loadInterpreter(onReady) {
  const script = document.createElement('script');
  script.src = 'catala_web_interpreter.js';
  script.onload = () => {
    if (typeof window.interpret === 'function' && typeof window.typecheck === 'function') {
      interpreterReady = true;
      onReady(true);
    } else {
      onReady(false);
    }
  };
  script.onerror = () => {
    onReady(false);
  };
  document.body.appendChild(script);
}

/**
 * Extract errors from diagnostics
 * @param {Diagnostic[]} diagnostics
 * @returns {Diagnostic[]}
 */
export function getErrors(diagnostics) {
  return diagnostics.filter(d => d.level === 'error');
}

/**
 * Extract warnings from diagnostics
 * @param {Diagnostic[]} diagnostics
 * @returns {Diagnostic[]}
 */
export function getWarnings(diagnostics) {
  return diagnostics.filter(d => d.level === 'warning');
}

/**
 * Get all positions from diagnostics of a given level
 * @param {Diagnostic[]} diagnostics
 * @param {'error' | 'warning'} level
 * @returns {SourcePosition[]}
 */
export function getPositions(diagnostics, level) {
  return diagnostics.filter(d => d.level === level).flatMap(d => Array.from(d.positions));
}

/**
 * Guard + error wrapper for interpreter calls
 * @template T
 * @param {() => T} fn
 * @returns {T | {success: false, output: string, diagnostics: Diagnostic[]}}
 */
function callInterpreter(fn) {
  if (!interpreterReady) {
    return {
      success: false,
      output: '',
      diagnostics: [{ level: 'error', message: 'Interpreter not ready yet', positions: [] }]
    };
  }
  try {
    return fn();
  } catch (e) {
    return {
      success: false,
      output: '',
      diagnostics: [{ level: 'error', message: (e instanceof Error ? e.message : String(e)), positions: [] }]
    };
  }
}

/**
 * Typecheck the current files
 * @returns {TypecheckResult}
 */
export function typecheck() {
  return /** @type {TypecheckResult} */ (callInterpreter(() => {
    const lang = getProjectLanguage();
    return window.typecheck({ files, language: lang, main: currentFile, outputFormat: 'ansi' });
  }));
}

/**
 * Run a specific scope
 * @param {string} scopeName
 * @returns {InterpretResult}
 */
export function runScope(scopeName) {
  return /** @type {InterpretResult} */ (callInterpreter(() => {
    const lang = getProjectLanguage();
    return window.interpret({ files, scope: scopeName, language: lang, main: currentFile, outputFormat: 'ansi' });
  }));
}
