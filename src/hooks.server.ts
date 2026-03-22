import type { Handle } from '@sveltejs/kit';
import { getShopifyConfig } from '$lib/server/config/shopify';

export const handle: Handle = async ({ event, resolve }) => {
	const { cartCookieName } = getShopifyConfig();
	const cartId = event.cookies.get(cartCookieName) ?? null;

	// Do not create a new cart here; just mirror the cookie into locals.
	event.locals.cartId = cartId || null;

	return resolve(event);
};

