import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCart } from '$lib/server/shopify';
import { getCartId, clearCartId } from '$lib/server/cartCookie';
import { apiError } from '$lib/server/apiResponse';

export const GET: RequestHandler = async (event) => {
	const cartId = getCartId(event);

	if (!cartId) {
		return json({ ok: true, cart: null });
	}

	const result = await getCart(cartId);

	if (!result.ok) {
		return apiError(
			result.error ?? { code: 'SHOPIFY_ERROR', message: 'Failed to fetch cart' },
			result.status ?? 502
		);
	}

	// Stale cart: cookie pointed to a cart that Shopify no longer has (e.g. expired).
	// Clear cookie and return empty so client shows no cart; next add will create a new one.
	if (result.data === null) {
		clearCartId(event);
		return json({ ok: true, cart: null });
	}

	return json({ ok: true, cart: result.data });
};

