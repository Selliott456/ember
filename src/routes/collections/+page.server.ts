import type { PageServerLoad } from './$types';
import { getCollections } from '$lib/server/shopify';

const COLLECTION_LIST_SIZE = 24;

export const load: PageServerLoad = async () => {
	const result = await getCollections(COLLECTION_LIST_SIZE);

	if (!result.ok) {
		return {
			collections: [],
			error: result.error?.message ?? 'Failed to load collections'
		};
	}

	return {
		collections: result.data ?? [],
		error: null
	};
};
