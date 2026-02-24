import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addToCart, getOrCreateCart } from '$lib/server/shopify';
import { getCartId, setCartId } from '$lib/server/cartCookie';

type AddBody = {
	merchandiseId?: unknown;
	quantity?: unknown;
};

export const POST: RequestHandler = async (event) => {
	const body = (await event.request.json().catch(() => ({}))) as AddBody;

	if (typeof body.merchandiseId !== 'string' || body.merchandiseId.trim().length === 0) {
		return json({ ok: false, error: 'Invalid merchandiseId' }, { status: 400 });
	}

	if (
		typeof body.quantity !== 'number' ||
		!Number.isInteger(body.quantity) ||
		body.quantity <= 0
	) {
		return json({ ok: false, error: 'Invalid quantity' }, { status: 400 });
	}

	const existingCartId = getCartId(event);

	// Ensure cart exists (but only here, on mutation).
	const cartResult = await getOrCreateCart(existingCartId);

	if (!cartResult.ok || !cartResult.data) {
		const message =
			cartResult.userErrors?.map((e) => e.message).join('; ') ??
			cartResult.errors?.map((e) => e.message).join('; ') ??
			'Failed to create or fetch cart';

		return json({ ok: false, error: message }, { status: 500 });
	}

	// Persist/refresh cart cookie.
	setCartId(event, cartResult.data.id);

	const addResult = await addToCart(
		cartResult.data.id,
		body.merchandiseId,
		body.quantity
	);

	if (!addResult.ok || !addResult.data) {
		const message =
			addResult.userErrors?.map((e) => e.message).join('; ') ??
			addResult.errors?.map((e) => e.message).join('; ') ??
			'Failed to add to cart';

		return json({ ok: false, error: message }, { status: 500 });
	}

	// Ensure cookie is aligned with latest cart id.
	setCartId(event, addResult.data.id);

	return json({ ok: true, cart: addResult.data });
};

