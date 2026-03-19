import type { PageServerLoad } from './$types';
import { getCollectionByHandle, getProducts } from '$lib/server/shopify';

const PRODUCTS_PER_COLLECTION = 50;

const TAG_COLLECTIONS: Record<string, { title: string; tags: string[] }> = {
	'field-notes': { title: 'Field Notes', tags: ['fieldnotes'] },
	'base-camp': { title: 'Base Camp', tags: ['basecamp', 'everyday'] },
	conditions: { title: 'Conditions', tags: ['conditions'] },
	naeba: { title: 'Naeba', tags: ['naeba'] },
	hanko: { title: 'Hanko', tags: ['hanko'] },
	badbish: { title: 'Badbish', tags: ['badbish', 'bad-bish', 'bad bish'] }
};

export const load: PageServerLoad = async ({ params }) => {
	const handle = params.handle;

	// For our featured collections, derive products from tags instead of Shopify collections.
	const tagConfig = TAG_COLLECTIONS[handle];
	if (tagConfig) {
		const result = await getProducts(PRODUCTS_PER_COLLECTION);

		if (!result.ok) {
			return {
				collection: null,
				products: [],
				error: result.error?.message ?? 'Failed to load collection'
			};
		}

		const allProducts = result.data ?? [];
		const tagSet = tagConfig.tags.map((t) => t.toLowerCase());

		const products = allProducts.filter((p) => {
			const tags = (p.tags ?? []).map((t) => t.toLowerCase());
			return tags.some((tag) => tagSet.includes(tag));
		});

		const collection = {
			id: `tag:${handle}`,
			handle,
			title: `${tagConfig.title} collection`,
			description: '',
			image: null
		};

		return {
			collection,
			products,
			error: null
		};
	}

	// Fallback: real Shopify collection by handle.
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
