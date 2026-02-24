import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCart } from '$lib/server/shopify';
import { getCartId } from '$lib/server/cartCookie';

export const GET: RequestHandler = async (event) => {
	const cartId = getCartId(event);

	// Do not create a cart here; just return empty structure if none.
	if (!cartId) {
		return json({ ok: true, cart: null });
	}

	const result = await getCart(cartId);

	if (!result.ok) {
		const message =
			result.userErrors?.map((e) => e.message).join('; ') ??
			result.errors?.map((e) => e.message).join('; ') ??
			'Failed to fetch cart';

		return json({ ok: false, error: message }, { status: 500 });
	}

	return json({ ok: true, cart: result.data ?? null });
};

