import type { PageServerLoad } from './$types';
import { getProducts } from '$lib/server/shopify';

const FEATURED_PRODUCT_COUNT = 12;

export const load: PageServerLoad = async () => {
	const result = await getProducts(FEATURED_PRODUCT_COUNT);

	if (!result.ok) {
		return {
			products: [],
			error:
				result.userErrors?.map((e) => e.message).join('; ') ??
				result.errors?.map((e) => e.message).join('; ') ??
				'Failed to load products'
		};
	}

	return {
		products: result.data ?? [],
		error: null
	};
};

