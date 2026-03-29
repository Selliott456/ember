import type { SizeGuideKey } from './data';

type GuideProductLike = {
	title?: string | null;
	handle?: string | null;
	productType?: string | null;
	tags?: string[] | null;
};

function includesAny(haystack: string, needles: string[]) {
	return needles.some((needle) => haystack.includes(needle));
}

export function getSizeGuideKey(product: GuideProductLike): SizeGuideKey {
	const title = String(product.title ?? '').toLowerCase();
	const handle = String(product.handle ?? '').toLowerCase();
	const productType = String(product.productType ?? '').toLowerCase();
	const tags = (product.tags ?? []).map((t) => String(t).toLowerCase());
	const joined = [title, handle, productType, ...tags].join(' ');

	if (includesAny(joined, ['hoodie', 'hooded'])) return 'hoodie';
	if (includesAny(joined, ['crop', 'cropped'])) return 'cropped_tee';
	if (
		includesAny(joined, [
			'jean',
			'jeans',
			'trouser',
			'trousers',
			'pant',
			'pants',
			'bottoms',
			'denim',
			'jogger',
			'joggers'
		])
	)
		return 'jeans_trousers';
	if (
		includesAny(joined, ['tee', 't-shirt', 't shirt', 'shirt', 'short sleeve'])
	)
		return 'tee';

	return 'tee';
}
