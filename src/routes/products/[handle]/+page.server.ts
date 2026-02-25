import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getProductByHandle } from '$lib/server/shopify';

export const load: PageServerLoad = async ({ params }) => {
	const handle = params.handle;

	const result = await getProductByHandle(handle);

	if (!result.ok) {
		throw error(result.status ?? 500, result.error?.message ?? 'Failed to load product');
	}

	if (!result.data) {
		throw error(404, 'Product not found');
	}

	return {
		product: result.data
	};
};

