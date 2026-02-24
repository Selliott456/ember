import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getProductByHandle } from '$lib/server/shopify';

export const load: PageServerLoad = async ({ params }) => {
	const handle = params.handle;

	const result = await getProductByHandle(handle);

	if (!result.ok) {
		const message =
			result.userErrors?.map((e) => e.message).join('; ') ??
			result.errors?.map((e) => e.message).join('; ') ??
			'Failed to load product';

		throw error(500, message);
	}

	if (!result.data) {
		throw error(404, 'Product not found');
	}

	return {
		product: result.data
	};
};

