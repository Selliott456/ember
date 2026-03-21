import type { PageServerLoad } from './$types';
import { getAllProducts } from '$lib/server/shopify';

export const load: PageServerLoad = async () => {
	const result = await getAllProducts();

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
