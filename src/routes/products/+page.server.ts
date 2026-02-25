import type { PageServerLoad } from './$types';
import { getProducts } from '$lib/server/shopify';

const ALL_PRODUCTS_LIMIT = 100;

export const load: PageServerLoad = async () => {
	const result = await getProducts(ALL_PRODUCTS_LIMIT);

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
