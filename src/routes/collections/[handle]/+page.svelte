<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const collection = $derived(data.collection);
	const products = $derived(data.products);
	const error = $derived(data.error);
</script>

<svelte:head>
	{#if collection}
		<title>{collection.title} | Collections</title>
		<meta name="description" content={collection.description ?? collection.title} />
	{/if}
</svelte:head>

<main class="page">
	<a class="back" href="/collections">← All collections</a>

	{#if collection}
		<h1>{collection.title}</h1>
		{#if collection.description}
			<p class="description">{collection.description}</p>
		{/if}
	{/if}

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if products.length === 0 && !error}
		<p>No products in this collection.</p>
	{:else if products.length > 0}
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
							{product.priceRange.minVariantPrice.amount}
							{' '}
							{product.priceRange.minVariantPrice.currencyCode}
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

	h1 {
		margin-bottom: 0.5rem;
	}

	.description {
		margin-bottom: 1.5rem;
		color: #555;
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
