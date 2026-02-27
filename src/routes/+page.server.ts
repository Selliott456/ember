import type { PageServerLoad } from './$types';
import { getProducts } from '$lib/server/shopify';

// Fetch enough products so each tagged carousel
// has room to show up to three items.
const FEATURED_PRODUCT_COUNT = 60;

export const load: PageServerLoad = async () => {
	const result = await getProducts(FEATURED_PRODUCT_COUNT);

	if (!result.ok) {
		return {
			products: [],
			error: result.error?.message ?? 'Failed to load products'
		};
	}

	return {
		products: result.data ?? [],
		error: null
	};
};

