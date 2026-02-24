import type { RequestEvent } from '@sveltejs/kit';

const CART_COOKIE_NAME = 'cart_id';
const CART_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function getCartId(event: RequestEvent): string | null {
	return event.locals.cartId ?? null;
}

export function setCartId(event: RequestEvent, cartId: string): void {
	event.locals.cartId = cartId;

	const secure = event.url.hostname !== 'localhost';

	event.cookies.set(CART_COOKIE_NAME, cartId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure,
		maxAge: CART_MAX_AGE_SECONDS
	});
}

export function clearCartId(event: RequestEvent): void {
	event.locals.cartId = null;

	event.cookies.delete(CART_COOKIE_NAME, {
		path: '/'
	});
}

