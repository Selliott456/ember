import type { RequestEvent } from '@sveltejs/kit';
import { shopifyConfig } from '$lib/config/shopify';

/** True if Shopify result indicates the cart was not found (stale/invalid ID). */
export function isCartNotFound(result: {
  error?: { code: string; message: string };
  userErrors?: { message: string }[];
}): boolean {
  const msg = (result.error?.message ?? '').toLowerCase();
  if (msg && (msg.includes('cart') && (msg.includes('not found') || msg.includes("couldn't find") || msg.includes('invalid')))) {
    return true;
  }
  const firstUser = result.userErrors?.[0]?.message?.toLowerCase();
  if (firstUser && (firstUser.includes('cart') && (firstUser.includes('not found') || firstUser.includes("couldn't find")))) {
    return true;
  }
  return false;
}

export function getCartId(event: RequestEvent): string | null {
	return event.locals.cartId ?? null;
}

export function setCartId(event: RequestEvent, cartId: string): void {
	event.locals.cartId = cartId;

	const secure = event.url.hostname !== 'localhost';

	event.cookies.set(shopifyConfig.cartCookieName, cartId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure,
		maxAge: shopifyConfig.cartCookieMaxAgeSeconds
	});
}

export function clearCartId(event: RequestEvent): void {
	event.locals.cartId = null;

	event.cookies.delete(shopifyConfig.cartCookieName, {
		path: '/'
	});
}

