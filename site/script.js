const API_BASE = "https://api.goobguy.com";

/**
 * Fetch JSON from the API, throwing a descriptive Error on any failure
 * (network error, non-2xx response, or malformed JSON) so callers can
 * show a real error state instead of silently doing nothing.
 */
async function apiGet(path) {
  let response;
  try {
    response = await fetch(API_BASE + path);
  } catch (err) {
    throw new Error("Could not reach the API. It may be temporarily unavailable.");
  }

  let body;
  try {
    body = await response.json();
  } catch (err) {
    throw new Error(`Unexpected response from API (status ${response.status}).`);
  }

  if (!response.ok) {
    const detail = body && body.detail ? body.detail : `Request failed (${response.status})`;
    throw new Error(detail);
  }

  return body;
}

function setStatus(el, kind, message) {
  el.className = "status" + (kind ? " " + kind : "");
  el.textContent = message || "";
}

function formatBytes(n) {
  if (n === null || n === undefined) return "—";
  return Number(n).toLocaleString("en-US");
}

function formatTimestamp(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");
  } catch (e) {
    return iso;
  }
}

/** Chunk a hex string into byte-pairs with a space every 4 bytes, for readability. */
function formatHex(hex) {
  if (!hex) return "";
  const bytePairs = hex.match(/.{1,2}/g) || [];
  let out = "";
  for (let i = 0; i < bytePairs.length; i++) {
    out += bytePairs[i];
    out += (i + 1) % 4 === 0 ? "  " : " ";
  }
  return out.trim();
}

function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
}

// Printable ASCII, excluding space: '!' (33) through '~' (126). 94 characters.
const ASCII_CHARSET = Array.from({ length: 94 }, (_, i) => String.fromCharCode(33 + i)).join("");

const ALPHANUMERIC_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function bytesToCharset(bytes, charset) {
  const n = charset.length;
  const maxUsable = Math.floor(256 / n) * n;
  let out = "";
  for (const b of bytes) {
    if (b < maxUsable) out += charset[b % n];
  }
  return out;
}

function rejectionRate(charsetLength) {
  const maxUsable = Math.floor(256 / charsetLength) * charsetLength;
  return ((256 - maxUsable) / 256 * 100).toFixed(1);
}