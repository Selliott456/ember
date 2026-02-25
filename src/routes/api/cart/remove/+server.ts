import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { removeFromCart } from '$lib/server/shopify';
import { getCartId } from '$lib/server/cartCookie';
import { apiError } from '$lib/server/apiResponse';

type RemoveBody = {
	lineId?: unknown;
};

export const POST: RequestHandler = async (event) => {
	const cartId = getCartId(event);

	if (!cartId) {
		return apiError({ code: 'VALIDATION_ERROR', message: 'No cart' }, 400);
	}

	const body = (await event.request.json().catch(() => ({}))) as RemoveBody;

	if (typeof body.lineId !== 'string' || body.lineId.trim().length === 0) {
		return apiError({ code: 'VALIDATION_ERROR', message: 'Invalid lineId' }, 400);
	}

	const result = await removeFromCart(cartId, [body.lineId]);

	if (!result.ok || !result.data) {
		return apiError(
			result.error ?? { code: 'SHOPIFY_ERROR', message: 'Failed to remove cart line' },
			result.status ?? 502
		);
	}

	return json({ ok: true, cart: result.data });
};

