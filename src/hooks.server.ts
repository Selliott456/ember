import type { Handle } from '@sveltejs/kit';
import { shopifyConfig } from '$lib/server/config/shopify';

export const handle: Handle = async ({ event, resolve }) => {
	const cartId = event.cookies.get(shopifyConfig.cartCookieName) ?? null;

	// Do not create a new cart here; just mirror the cookie into locals.
	event.locals.cartId = cartId || null;

	return resolve(event);
};

