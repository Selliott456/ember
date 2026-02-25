import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addToCart, createCart, getOrCreateCart } from '$lib/server/shopify';
import { getCartId, setCartId, clearCartId, isCartNotFound } from '$lib/server/cartCookie';
import { apiError } from '$lib/server/apiResponse';

const ADD_REPLAY_TTL_MS = 5_000;

/** In-memory replay cache for add-to-cart by X-Request-Id (dedupe double-clicks). Single-node only. */
const addReplayCache = new Map<
	string,
	{ body: { ok: true; cart: unknown }; status: number; timestamp: number }
>();

function pruneAddReplayCache(now: number) {
	for (const [id, entry] of addReplayCache.entries()) {
		if (now - entry.timestamp > ADD_REPLAY_TTL_MS) addReplayCache.delete(id);
	}
}

type AddBody = {
	merchandiseId?: unknown;
	quantity?: unknown;
};

export const POST: RequestHandler = async (event) => {
	const requestId = event.request.headers.get('X-Request-Id')?.trim();
	const now = Date.now();
	if (requestId) {
		const cached = addReplayCache.get(requestId);
		if (cached && now - cached.timestamp <= ADD_REPLAY_TTL_MS) {
			return json(cached.body, { status: cached.status });
		}
	}

	const body = (await event.request.json().catch(() => ({}))) as AddBody;

	if (typeof body.merchandiseId !== 'string' || body.merchandiseId.trim().length === 0) {
		return apiError({ code: 'VALIDATION_ERROR', message: 'Invalid merchandiseId' }, 400);
	}

	const qty =
		typeof body.quantity === 'string' ? Number(body.quantity) : body.quantity;
	if (typeof qty !== 'number' || !Number.isInteger(qty) || qty <= 0) {
		return apiError({ code: 'VALIDATION_ERROR', message: 'Invalid quantity' }, 400);
	}

	const existingCartId = getCartId(event);
	let cartResult = await getOrCreateCart(existingCartId);

	if (!cartResult.ok || !cartResult.data) {
		return apiError(
			cartResult.error ?? { code: 'SHOPIFY_ERROR', message: 'Failed to create or fetch cart' },
			cartResult.status ?? 502
		);
	}

	let addResult = await addToCart(
		cartResult.data.id,
		body.merchandiseId,
		qty
	);

	// Stale cart: add failed because cart not found; recreate and retry once.
	if (!addResult.ok && isCartNotFound(addResult)) {
		clearCartId(event);
		const createResult = await createCart();
		if (!createResult.ok || !createResult.data) {
			return apiError(
				createResult.error ?? { code: 'SHOPIFY_ERROR', message: 'Failed to create cart' },
				createResult.status ?? 502
			);
		}
		addResult = await addToCart(
			createResult.data.id,
			body.merchandiseId,
			qty
		);
	}

	if (!addResult.ok || !addResult.data) {
		return apiError(
			addResult.error ?? { code: 'SHOPIFY_ERROR', message: 'Failed to add to cart' },
			addResult.status ?? 502
		);
	}

	// Only set cart cookie after a successful add (or after successful recreate+retry).
	setCartId(event, addResult.data.id);

	const responseBody = { ok: true as const, cart: addResult.data };
	if (requestId) {
		const ts = Date.now();
		addReplayCache.set(requestId, {
			body: responseBody,
			status: 200,
			timestamp: ts
		});
		pruneAddReplayCache(ts);
	}
	return json(responseBody);
};

