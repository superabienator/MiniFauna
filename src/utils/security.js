// Utilidades de seguridad y resiliencia de datos locales

/**
 * Escapa caracteres HTML para prevenir XSS al interpolar texto en plantillas.
 * @param {unknown} str
 * @returns {string}
 */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Parsea JSON de forma segura evitando excepciones no capturadas si localStorage está corrupto.
 * @template T
 * @param {string | null} raw
 * @param {T} fallback
 * @returns {T}
 */
export function safeJsonParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
