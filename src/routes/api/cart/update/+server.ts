import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateCartLines } from '$lib/server/shopify';
import { getCartId } from '$lib/server/cartCookie';
import { apiError } from '$lib/server/apiResponse';

type UpdateBody = {
	lineId?: unknown;
	quantity?: unknown;
};

export const POST: RequestHandler = async (event) => {
	const cartId = getCartId(event);

	if (!cartId) {
		return apiError({ code: 'VALIDATION_ERROR', message: 'No cart to update' }, 400);
	}

	const body = (await event.request.json().catch(() => ({}))) as UpdateBody;

	if (typeof body.lineId !== 'string' || body.lineId.trim().length === 0) {
		return apiError({ code: 'VALIDATION_ERROR', message: 'Invalid lineId' }, 400);
	}

	if (
		typeof body.quantity !== 'number' ||
		!Number.isInteger(body.quantity) ||
		body.quantity <= 0
	) {
		return apiError({ code: 'VALIDATION_ERROR', message: 'Invalid quantity' }, 400);
	}

	const result = await updateCartLines(cartId, [
		{ id: body.lineId, quantity: body.quantity }
	]);

	if (!result.ok || !result.data) {
		return apiError(
			result.error ?? { code: 'SHOPIFY_ERROR', message: 'Failed to update cart line' },
			result.status ?? 502
		);
	}

	return json({ ok: true, cart: result.data });
};

