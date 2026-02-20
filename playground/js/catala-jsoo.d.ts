/**
 * Type definitions for Catala JSOO (js_of_ocaml) web interpreter
 *
 * These functions are exported by catala_web_interpreter.ml and available
 * on the global scope after loading catala_web_interpreter.js
 */

/**
 * A source position in the user's code
 */
export interface SourcePosition {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  message?: string;
}

/**
 * A diagnostic (error or warning) from the compiler
 */
export interface Diagnostic {
  level: 'error' | 'warning';
  message: string;
  positions: SourcePosition[];
}

/**
 * Result from interpreting Catala code
 */
export interface InterpretResult {
  /** Whether interpretation succeeded */
  success: boolean;
  /** Formatted output if successful */
  output: string;
  /** Diagnostics (errors and warnings) */
  diagnostics: Diagnostic[];
}

/**
 * Options for the interpret function
 */
export interface InterpretOptions {
  /** All source files as { filename: contents } - first file is main by default */
  files: Record<string, string>;
  /** Name of the scope to execute */
  scope: string;
  /** Language code ("en", "fr", "pl") - defaults to "en" */
  language?: string;
  /** Override which file is the main entry point */
  main?: string;
  /** Enable tracing (not typically used in web) */
  trace?: boolean;
  /** Output format for diagnostic messages: "plain" (default) or "ansi" */
  outputFormat?: 'plain' | 'ansi';
}

/**
 * Result from typechecking Catala code
 */
export interface TypecheckResult {
  /** Whether typechecking succeeded */
  success: boolean;
  /** Success message if successful */
  output: string;
  /** Diagnostics (errors and warnings) */
  diagnostics: Diagnostic[];
}

/**
 * Options for the typecheck function
 */
export interface TypecheckOptions {
  /** All source files as { filename: contents } - first file is main by default */
  files: Record<string, string>;
  /** Language code ("en", "fr", "pl") - defaults to "en" */
  language?: string;
  /** Override which file is the main entry point */
  main?: string;
  /** Output format for diagnostic messages: "plain" (default) or "ansi" */
  outputFormat?: 'plain' | 'ansi';
}

/**
 * Catala interpreter functions exported to JavaScript via JSOO
 */
export interface CatalaInterpreter {
  /**
   * Interpret Catala source code and execute a scope
   * @param options - Interpretation options
   * @returns Result object with success status and output or error
   */
  interpret(options: InterpretOptions): InterpretResult;

  /**
   * Typecheck Catala source code without executing
   * @param options - Typecheck options
   * @returns Result object with success status and errors if any
   */
  typecheck(options: TypecheckOptions): TypecheckResult;
}

declare global {
  interface Window extends CatalaInterpreter {}

  // Also available on globalThis
  var interpret: CatalaInterpreter['interpret'];
  var typecheck: CatalaInterpreter['typecheck'];
}
