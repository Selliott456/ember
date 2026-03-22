import type { RequestEvent } from '@sveltejs/kit';
import { getShopifyConfig } from '$lib/server/config/shopify';

/** Cookie path used for set and delete so they stay in sync. */
const CART_COOKIE_PATH = '/' as const;

/** Options for setting the cart cookie. Secure defaults: httpOnly, sameSite lax, path '/', maxAge from config, secure in production. */
function cartCookieSetOptions() {
	const { cartCookieMaxAgeSeconds } = getShopifyConfig();
	return {
		path: CART_COOKIE_PATH,
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: process.env.NODE_ENV === 'production',
		maxAge: cartCookieMaxAgeSeconds
	};
}

/** Structured error codes that mean the cart was not found (stale/invalid ID). Check these before message heuristics. */
const CART_NOT_FOUND_CODES = new Set(['CART_NOT_FOUND', 'CART_INVALID']);

function looksLikeCartNotFoundMessage(text: string): boolean {
  const t = text.toLowerCase();
  return (
    (t.includes('cart') && (t.includes('not found') || t.includes("couldn't find") || t.includes('invalid'))) ||
    (t.includes('couldn\'t find') && t.includes('cart'))
  );
}

/** True if message or error list looks like Shopify cart-not-found. Use when mapping raw Shopify responses to CART_NOT_FOUND. */
export function isCartNotFoundFromMessage(
  message?: string,
  errors?: { message: string }[]
): boolean {
  if (message && looksLikeCartNotFoundMessage(message)) return true;
  if (errors?.some((e) => e.message && looksLikeCartNotFoundMessage(e.message))) return true;
  return false;
}

/** True if Shopify result indicates the cart was not found (stale/invalid ID). Prefer structured code, then message heuristics. */
export function isCartNotFound(result: {
  error?: { code?: string; message?: string };
  userErrors?: { message: string }[];
}): boolean {
  if (result.error?.code && CART_NOT_FOUND_CODES.has(result.error.code)) return true;

  const msg = result.error?.message ?? '';
  if (msg && looksLikeCartNotFoundMessage(msg)) return true;
  const firstUser = result.userErrors?.[0]?.message ?? '';
  if (firstUser && looksLikeCartNotFoundMessage(firstUser)) return true;
  return false;
}

export function getCartId(event: RequestEvent): string | null {
	const { cartCookieName } = getShopifyConfig();
	return event.locals.cartId ?? event.cookies.get(cartCookieName) ?? null;
}

export function setCartId(event: RequestEvent, cartId: string): void {
	const { cartCookieName } = getShopifyConfig();
	event.locals.cartId = cartId;
	event.cookies.set(cartCookieName, cartId, cartCookieSetOptions());
}

export function clearCartId(event: RequestEvent): void {
	const { cartCookieName } = getShopifyConfig();
	event.locals.cartId = null;
	event.cookies.delete(cartCookieName, { path: CART_COOKIE_PATH });
}

