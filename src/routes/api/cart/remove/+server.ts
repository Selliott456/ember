import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { removeFromCart } from '$lib/server/shopify';
import { getCartId } from '$lib/server/cartCookie';

type RemoveBody = {
	lineId?: unknown;
};

export const POST: RequestHandler = async (event) => {
	const cartId = getCartId(event);

	if (!cartId) {
		return json({ ok: false, error: 'No cart to update' }, { status: 400 });
	}

	const body = (await event.request.json().catch(() => ({}))) as RemoveBody;

	if (typeof body.lineId !== 'string' || body.lineId.trim().length === 0) {
		return json({ ok: false, error: 'Invalid lineId' }, { status: 400 });
	}

	const result = await removeFromCart(cartId, [body.lineId]);

	if (!result.ok || !result.data) {
		const message =
			result.userErrors?.map((e) => e.message).join('; ') ??
			result.errors?.map((e) => e.message).join('; ') ??
			'Failed to remove cart line';

		return json({ ok: false, error: message }, { status: 500 });
	}

	return json({ ok: true, cart: result.data });
};

