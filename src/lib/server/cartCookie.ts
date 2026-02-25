import type { RequestEvent } from '@sveltejs/kit';
import { shopifyConfig } from '$lib/config/shopify';

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

