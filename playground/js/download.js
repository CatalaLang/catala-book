// @ts-check
/**
 * Workspace download: single file or ZIP archive.
 *
 * Single file  → downloads the .catala_XX file directly.
 * Multiple files → builds a minimal stored (uncompressed) ZIP in memory.
 *   Stored entries keep the implementation dependency-free; the files are
 *   plain text so compression would save little. CRC-32 is required by the
 *   ZIP spec even for stored entries.
 */

// ============================================================================
// CRC-32 (required by ZIP for stored entries)
// ============================================================================

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

/**
 * @param {Uint8Array} bytes
 * @returns {number}
 */
function crc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (const b of bytes) crc = CRC_TABLE[(crc ^ b) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ============================================================================
// Minimal ZIP writer (stored / no compression)
// ============================================================================

/**
 * Build an uncompressed ZIP archive from a map of filename → content.
 * @param {Record<string, string>} files
 * @returns {Uint8Array}
 */
function buildZip(files) {
  const enc = new TextEncoder();
  /** @type {Array<{localHeader: Uint8Array, cdEntry: Uint8Array}>} */
  const parts = [];
  let localOffset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = enc.encode(name);
    const dataBytes = enc.encode(content);
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    // Local file header (30 bytes) + filename + data
    const local = new Uint8Array(30 + nameBytes.length + size);
    const lv = new DataView(local.buffer);
    lv.setUint32( 0, 0x04034b50, true); // signature
    lv.setUint16( 4, 20,         true); // version needed
    lv.setUint16( 6, 0,          true); // flags
    lv.setUint16( 8, 0,          true); // compression: stored
    lv.setUint16(10, 0,          true); // mod time
    lv.setUint16(12, 0,          true); // mod date
    lv.setUint32(14, crc,        true); // CRC-32
    lv.setUint32(18, size,       true); // compressed size
    lv.setUint32(22, size,       true); // uncompressed size
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0,          true); // extra field length
    local.set(nameBytes, 30);
    local.set(dataBytes, 30 + nameBytes.length);

    // Central directory entry (46 bytes) + filename
    const cd = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32( 0, 0x02014b50, true); // signature
    cv.setUint16( 4, 20,         true); // version made by
    cv.setUint16( 6, 20,         true); // version needed
    cv.setUint16( 8, 0,          true); // flags
    cv.setUint16(10, 0,          true); // compression: stored
    cv.setUint16(12, 0,          true); // mod time
    cv.setUint16(14, 0,          true); // mod date
    cv.setUint32(16, crc,        true); // CRC-32
    cv.setUint32(20, size,       true); // compressed size
    cv.setUint32(24, size,       true); // uncompressed size
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0,          true); // extra field length
    cv.setUint16(32, 0,          true); // file comment length
    cv.setUint16(34, 0,          true); // disk number start
    cv.setUint16(36, 0,          true); // internal attrs
    cv.setUint32(38, 0,          true); // external attrs
    cv.setUint32(42, localOffset,true); // offset of local header
    cd.set(nameBytes, 46);

    parts.push({ localHeader: local, cdEntry: cd });
    localOffset += local.length;
  }

  // End of central directory (22 bytes)
  const cdSize = parts.reduce((s, p) => s + p.cdEntry.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32( 0, 0x06054b50,   true); // signature
  ev.setUint16( 4, 0,            true); // disk number
  ev.setUint16( 6, 0,            true); // disk with start of CD
  ev.setUint16( 8, parts.length, true); // entries on this disk
  ev.setUint16(10, parts.length, true); // total entries
  ev.setUint32(12, cdSize,       true); // size of CD
  ev.setUint32(16, localOffset,  true); // offset of CD
  ev.setUint16(20, 0,            true); // comment length

  const total = localOffset + cdSize + eocd.length;
  const out = new Uint8Array(total);
  let pos = 0;
  for (const { localHeader } of parts) { out.set(localHeader, pos); pos += localHeader.length; }
  for (const { cdEntry }     of parts) { out.set(cdEntry,     pos); pos += cdEntry.length; }
  out.set(eocd, pos);
  return out;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Trigger a browser download for a Blob.
 * @param {Blob} blob
 * @param {string} filename
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Download the current workspace.
 * Single file → downloads the .catala_XX file directly.
 * Multiple files → downloads a catala-workspace.zip archive.
 * @param {Record<string, string>} files
 * @returns {string} - The downloaded filename (for status display)
 */
export function downloadWorkspace(files) {
  const entries = Object.entries(files);
  if (entries.length === 1) {
    const [name, content] = entries[0];
    triggerDownload(new Blob([content], { type: 'text/plain' }), name);
    return name;
  }
  const zip = buildZip(files);
  triggerDownload(new Blob([/** @type {ArrayBuffer} */ (zip.buffer)], { type: 'application/zip' }), 'catala-workspace.zip');
  return 'catala-workspace.zip';
}
