import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearCartId } from '$lib/server/cartCookie';

export const POST: RequestHandler = async (event) => {
	clearCartId(event);

	return json({ ok: true, cart: null });
};

