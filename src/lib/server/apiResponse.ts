import { json } from '@sveltejs/kit';
import type { ShopifyStructuredError } from '$lib/server/shopify';

/**
 * Consistent error JSON: { ok: false, error: { code, message } }.
 * Use status from Shopify result (400 user/validation, 502 upstream) or default.
 */
export function apiError(
  error: ShopifyStructuredError | string,
  status = 500
) {
  const body =
    typeof error === 'string'
      ? { ok: false, error: { code: 'ERROR', message: error } }
      : { ok: false, error: { code: error.code, message: error.message } };
  return json(body, { status });
}
