import type { PageServerLoad } from './$types';
import { getCart } from '$lib/server/shopify';

export const load: PageServerLoad = async (event) => {
	const cartId = event.locals.cartId ?? null;

	if (!cartId) {
		return {
			cart: null
		};
	}

	const result = await getCart(cartId);

	if (!result.ok) {
		return {
			cart: null,
			error: result.error?.message ?? 'Failed to load cart'
		};
	}

	return {
		cart: result.data ?? null,
		error: null
	};
};

