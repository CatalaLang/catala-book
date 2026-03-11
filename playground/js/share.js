// @ts-check
/**
 * Workspace sharing via URL-encoded, compressed state.
 *
 * Design decisions:
 * - Encoding: deflate-raw (native CompressionStream API) + base64url, no dependencies.
 * - State format: the same {files, currentFile} object as getAllFiles().
 * - URL placement: #shared=<base64url> in the hash, alongside other params (lang, etc.).
 * - Size limit: 64KB *compressed* (before base64 expansion). Larger workspaces are
 *   rejected with an error rather than silently truncated or producing broken URLs.
 * - Persistence invariant: when #shared= is present, localStorage is disabled — the
 *   URL hash IS the persistent state. No "edit locally" escape hatch: what you share
 *   is exactly what the recipient sees, always.
 * - Share button behaviour: copy-to-clipboard only. The sender's address bar is not
 *   rewritten, so their session continues with normal localStorage persistence.
 */

const MAX_COMPRESSED_BYTES = 64 * 1024; // 64 KiB

/**
 * Encode a workspace state to a base64url string.
 * @param {{files: Record<string, string>, currentFile: string}} state
 * @returns {Promise<string>}
 * @throws {Error} with message `workspace_too_large:<bytes>` if limit exceeded
 */
export async function encodeWorkspace(state) {
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);

  const cs = new CompressionStream('deflate-raw');
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();

  const compressed = await new Response(cs.readable).arrayBuffer();

  if (compressed.byteLength > MAX_COMPRESSED_BYTES) {
    throw new Error(`workspace_too_large:${compressed.byteLength}`);
  }

  // base64url (RFC 4648 §5): replace + with -, / with _, strip = padding
  return btoa(String.fromCharCode(...new Uint8Array(compressed)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode a base64url string back to workspace state.
 * @param {string} encoded
 * @returns {Promise<{files: Record<string, string>, currentFile: string}>}
 */
export async function decodeWorkspace(encoded) {
  const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));

  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();

  const text = await new Response(ds.readable).text();
  return JSON.parse(text);
}
