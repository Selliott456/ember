<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { formatPrice } from '$lib/formatPrice';

	let { data }: { data: PageData } = $props();

	const products = $derived(data.products);
	const error = $derived(data.error);
	const canonical = $derived($page.url.origin + $page.url.pathname);

	const genderFilter = $derived($page.url.searchParams.get('gender')?.toLowerCase() ?? null);
	const collectionFilter = $derived(
		$page.url.searchParams.get('collection')?.toLowerCase() ?? null
	);
	const typeFilter = $derived($page.url.searchParams.get('type')?.toLowerCase() ?? null);

	const TYPE_TAG_MAP: Record<string, string[]> = {
		tee: ['tee', 'tees', 't-shirt', 't-shirts'],
		hoodie: ['hoodie', 'hoodies', 'hooded'],
		sweater: ['sweater', 'sweaters', 'knit'],
		pants: ['pants', 'trousers', 'joggers', 'jogger', 'shorts'],
		jeans: ['jeans', 'denim']
	};

	function matchesFilter(product: any) {
		const tags = (product.tags ?? []).map((t: string) => t.toLowerCase());
		if (genderFilter && !tags.includes(genderFilter)) return false;
		if (collectionFilter && !tags.includes(collectionFilter)) return false;
		if (typeFilter) {
			const allowed = TYPE_TAG_MAP[typeFilter] ?? [typeFilter];
			if (!tags.some((tag) => allowed.includes(tag))) return false;
		}
		return true;
	}

	const filteredProducts = $derived(products.filter((p) => matchesFilter(p)));

	// Track which gallery image is active per product ID
	const imageIndexById = $state<Record<string, number>>({});

	function getImages(product: any) {
		if (product.images && product.images.length) return product.images;
		if (product.featuredImage) return [product.featuredImage];
		return [];
	}

	function currentImage(product: any) {
		const images = getImages(product);
		if (!images.length) return null;
		const idx = imageIndexById[product.id] ?? 0;
		return images[idx] ?? images[0];
	}

	function cycleImage(event: MouseEvent, product: any) {
		event.preventDefault();
		event.stopPropagation();
		const images = getImages(product);
		if (!images.length) return;
		const current = imageIndexById[product.id] ?? 0;
		imageIndexById[product.id] = (current + 1) % images.length;
	}
</script>

<svelte:head>
	<title>All products | Storefront</title>
	<meta name="description" content="Browse all products." />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="All products | Storefront" />
	<meta property="og:description" content="Browse all products." />
	<meta property="og:url" content={canonical} />
</svelte:head>

<main class="page">
	<h1>All products</h1>
	<a class="back" href="/">← Back to home</a>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if filteredProducts.length === 0 && !error}
		<p>No products found.</p>
	{:else}
		<ul class="product-grid">
			{#each filteredProducts as product}
				<li class="product-card">
					<a href="/products/{product.handle}">
						<div
							class="product-image-shell"
							on:click={(event) => cycleImage(event, product)}
						>
							{#if currentImage(product)}
								<img
									src={currentImage(product).url}
									alt={currentImage(product).altText ?? product.title}
									loading="lazy"
								/>
							{/if}
							<div class="image-hint image-hint-left">←</div>
							<div class="image-hint image-hint-right">→</div>
						</div>
						<h2>{product.title}</h2>
						<p class="price">
							{formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
						</p>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	.page {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1rem 3rem;
	}

	.back {
		display: inline-block;
		margin-bottom: 1.5rem;
		text-decoration: none;
		color: #444;
	}

	.product-grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1.5rem;
		padding: 0;
		margin: 0;
	}

	.product-card {
		border: 1px solid #e2e2e2;
		border-radius: 0.5rem;
		overflow: hidden;
		background: white;
	}

	.product-card a {
		display: block;
		color: inherit;
		text-decoration: none;
		padding: 0.75rem;
	}

	.product-image-shell {
		position: relative;
		width: 100%;
		height: 200px;
		margin-bottom: 0.5rem;
		border-radius: 0.5rem;
		overflow: hidden;
		cursor: pointer;
	}

	.product-image-shell img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.image-hint {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 1.6rem;
		height: 1.6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.6);
		color: #f9fafb;
		font-size: 0.7rem;
		opacity: 0;
		transition: opacity 120ms ease-out;
	}

	.image-hint-left {
		left: 0.4rem;
	}

	.image-hint-right {
		right: 0.4rem;
	}

	.product-image-shell:hover .image-hint {
		opacity: 1;
	}

	.product-card h2 {
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}

	.price {
		font-weight: 600;
	}

	.error {
		color: #b00020;
	}
</style>
