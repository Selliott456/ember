<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { formatPrice } from '$lib/formatPrice';

	let { data }: { data: PageData } = $props();

	const products = $derived(data.products);
	const error = $derived(data.error);
	const canonical = $derived($page.url.origin + $page.url.pathname);
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

	{#if products.length === 0 && !error}
		<p>No products found.</p>
	{:else}
		<ul class="product-grid">
			{#each products as product}
				<li class="product-card">
					<a href="/products/{product.handle}">
						{#if product.featuredImage}
							<img
								src={product.featuredImage.url}
								alt={product.featuredImage.altText ?? product.title}
								loading="lazy"
							/>
						{/if}
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

	.product-card img {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 0.5rem;
		margin-bottom: 0.5rem;
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
