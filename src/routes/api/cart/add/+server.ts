import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addToCart, getOrCreateCart } from '$lib/server/shopify';
import { getCartId, setCartId } from '$lib/server/cartCookie';
import { apiError } from '$lib/server/apiResponse';

type AddBody = {
	merchandiseId?: unknown;
	quantity?: unknown;
};

export const POST: RequestHandler = async (event) => {
	const body = (await event.request.json().catch(() => ({}))) as AddBody;

	if (typeof body.merchandiseId !== 'string' || body.merchandiseId.trim().length === 0) {
		return apiError({ code: 'VALIDATION_ERROR', message: 'Invalid merchandiseId' }, 400);
	}

	if (
		typeof body.quantity !== 'number' ||
		!Number.isInteger(body.quantity) ||
		body.quantity <= 0
	) {
		return apiError({ code: 'VALIDATION_ERROR', message: 'Invalid quantity' }, 400);
	}

	const existingCartId = getCartId(event);
	const cartResult = await getOrCreateCart(existingCartId);

	if (!cartResult.ok || !cartResult.data) {
		return apiError(
			cartResult.error ?? { code: 'SHOPIFY_ERROR', message: 'Failed to create or fetch cart' },
			cartResult.status ?? 502
		);
	}

	setCartId(event, cartResult.data.id);

	const addResult = await addToCart(
		cartResult.data.id,
		body.merchandiseId,
		body.quantity
	);

	if (!addResult.ok || !addResult.data) {
		return apiError(
			addResult.error ?? { code: 'SHOPIFY_ERROR', message: 'Failed to add to cart' },
			addResult.status ?? 502
		);
	}

	setCartId(event, addResult.data.id);
	return json({ ok: true, cart: addResult.data });
};

