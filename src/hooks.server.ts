import type { Handle } from '@sveltejs/kit';

const CART_COOKIE_NAME = 'cart_id';

export const handle: Handle = async ({ event, resolve }) => {
	const cartId = event.cookies.get(CART_COOKIE_NAME) ?? null;

	// Do not create a new cart here; just mirror the cookie into locals.
	event.locals.cartId = cartId || null;

	return resolve(event);
};

