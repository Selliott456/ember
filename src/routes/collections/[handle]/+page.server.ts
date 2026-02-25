import type { PageServerLoad } from './$types';
import { getCollectionByHandle } from '$lib/server/shopify';

const PRODUCTS_PER_COLLECTION = 50;

export const load: PageServerLoad = async ({ params }) => {
	const handle = params.handle;
	const result = await getCollectionByHandle(handle, PRODUCTS_PER_COLLECTION);

	if (!result.ok) {
		return {
			collection: null,
			products: [],
			error: result.error?.message ?? 'Failed to load collection'
		};
	}

	const collection = result.data ?? null;
	const products = collection?.products ?? [];

	return {
		collection,
		products,
		error: null
	};
};
