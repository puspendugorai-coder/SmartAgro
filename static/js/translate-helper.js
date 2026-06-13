// ── Shared dynamic-content translation helper ──────────
const TR_CACHE_PREFIX = 'sa_tr_v1_';

function _trCacheKey(text, lang) {
  // short hash-ish key so localStorage keys stay manageable
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return TR_CACHE_PREFIX + lang + '_' + hash;
}

function getCachedTranslation(text, lang) {
  try { return localStorage.getItem(_trCacheKey(text, lang)); }
  catch { return null; }
}

function setCachedTranslation(text, lang, translated) {
  try { localStorage.setItem(_trCacheKey(text, lang), translated); }
  catch {}
}

/**
 * Translate an array of strings into `lang`.
 * Returns a same-length array (uses cache where possible).
 * If lang is 'en' or empty, returns the input unchanged.
 */
async function translateDynamicTexts(texts, lang) {
  if (!lang || lang === 'en' || !Array.isArray(texts) || !texts.length) {
    return texts;
  }

  const result    = new Array(texts.length);
  const toFetch   = [];
  const toFetchAt = [];

  texts.forEach((t, i) => {
    if (typeof t !== 'string' || !t.trim()) { result[i] = t; return; }
    const cached = getCachedTranslation(t, lang);
    if (cached !== null) { result[i] = cached; }
    else { toFetch.push(t); toFetchAt.push(i); }
  });

  if (!toFetch.length) return result;

  try {
    const res  = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: toFetch, lang })
    });
    const data = await res.json();
    const translations = Array.isArray(data.translations) ? data.translations : toFetch;
    translations.forEach((tr, j) => {
      const idx = toFetchAt[j];
      result[idx] = tr;
      setCachedTranslation(toFetch[j], lang, tr);
    });
  } catch (e) {
    console.error('[translateDynamicTexts] failed', e);
    toFetchAt.forEach((idx, j) => { result[idx] = toFetch[j]; });
  }

  return result;
}
