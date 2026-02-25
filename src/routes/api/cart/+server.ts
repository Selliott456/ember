import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCart } from '$lib/server/shopify';
import { getCartId, clearCartId, isCartNotFound } from '$lib/server/cartCookie';
import { apiError } from '$lib/server/apiResponse';

export const GET: RequestHandler = async (event) => {
	const cartId = getCartId(event);

	if (!cartId) {
		return json({ ok: true, cart: null });
	}

	const result = await getCart(cartId);

	// Stale cart recovery: Shopify returned null or a not-found error for this cookie id. Clear cookie and return empty cart.
	if (!result.ok && isCartNotFound(result)) {
		clearCartId(event);
		return json({ ok: true, cart: null });
	}
	if (result.ok && result.data === null) {
		clearCartId(event);
		return json({ ok: true, cart: null });
	}

	if (!result.ok) {
		return apiError(
			result.error ?? { code: 'SHOPIFY_ERROR', message: 'Failed to fetch cart' },
			result.status ?? 502
		);
	}

	return json({ ok: true, cart: result.data });
};

