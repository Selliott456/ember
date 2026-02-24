<script lang="ts">
	import type { PageData } from './$types';
	import { cart } from '$lib/stores/cart';

	export let data: PageData;

	const product = data.product;

	let selectedVariantId: string | null =
		product.variants.length > 0 ? product.variants[0].id : null;
	let quantity = 1;
	let submitting = false;
	let message: string | null = null;

	async function handleAddToCart() {
		message = null;

		if (!selectedVariantId) {
			message = 'Please select a variant.';
			return;
		}

		if (!Number.isInteger(quantity) || quantity <= 0) {
			message = 'Quantity must be a positive integer.';
			return;
		}

		submitting = true;
		try {
			await cart.addToCart(selectedVariantId, quantity);
			message = 'Added to cart.';
		} catch (e) {
			message = e instanceof Error ? e.message : 'Failed to add to cart.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>{product.title} | Storefront</title>
	<meta name="description" content={product.description} />
	<meta property="og:type" content="product" />
	<meta property="og:title" content={product.title} />
	<meta property="og:description" content={product.description} />
	{#if product.featuredImage}
		<meta property="og:image" content={product.featuredImage.url} />
	{/if}
</svelte:head>

<main class="page">
	<a class="back" href="/">← Back to products</a>

	<section class="product">
		{#if product.featuredImage}
			<div class="image">
				<img
					src={product.featuredImage.url}
					alt={product.featuredImage.altText ?? product.title}
					loading="lazy"
				/>
			</div>
		{/if}

		<div class="details">
			<h1>{product.title}</h1>
			<p class="price">
				{product.priceRange.minVariantPrice.amount}
				{' '}
				{product.priceRange.minVariantPrice.currencyCode}
			</p>

			{#if product.variants.length > 0}
				<label>
					<span>Variant</span>
					<select bind:value={selectedVariantId}>
						{#each product.variants as variant}
							<option value={variant.id} disabled={!variant.availableForSale}>
								{variant.title} {!variant.availableForSale ? '(Sold out)' : ''}
							</option>
						{/each}
					</select>
				</label>
			{/if}

			<label>
				<span>Quantity</span>
				<input
					type="number"
					min="1"
					step="1"
					bind:value={quantity}
				/>
			</label>

			<button on:click|preventDefault={handleAddToCart} disabled={submitting}>
				{submitting ? 'Adding…' : 'Add to cart'}
			</button>

			{#if message}
				<p class="message">{message}</p>
			{/if}

			{#if product.description}
				<div class="description">
					<p>{product.description}</p>
				</div>
			{/if}
		</div>
	</section>
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

	.product {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
		gap: 2rem;
		align-items: flex-start;
	}

	.image img {
		width: 100%;
		border-radius: 0.5rem;
		object-fit: cover;
	}

	.details h1 {
		margin-bottom: 0.5rem;
	}

	.price {
		font-weight: 600;
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 1rem;
	}

	label span {
		display: block;
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
		color: #555;
	}

	select,
	input[type='number'] {
		width: 100%;
		padding: 0.4rem 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid #ccc;
	}

	button {
		margin-top: 0.5rem;
		padding: 0.6rem 1.2rem;
		border-radius: 0.25rem;
		border: none;
		background: #111827;
		color: white;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.7;
		cursor: default;
	}

	.message {
		margin-top: 0.75rem;
		font-size: 0.9rem;
		color: #065f46;
	}

	.description {
		margin-top: 1.5rem;
		color: #444;
	}

	@media (max-width: 768px) {
		.product {
			grid-template-columns: 1fr;
		}
	}
</style>

