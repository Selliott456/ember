<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	const collections = $derived(data.collections);
	const error = $derived(data.error);
	const canonical = $derived($page.url.origin + $page.url.pathname);
</script>

<svelte:head>
	<title>Collections | Storefront</title>
	<meta name="description" content="Browse our product collections." />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Collections | Storefront" />
	<meta property="og:description" content="Browse our product collections." />
	<meta property="og:url" content={canonical} />
</svelte:head>

<main class="page">
	<h1>Collections</h1>
	<a class="back" href="/">← Back to home</a>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if collections.length === 0 && !error}
		<p>No collections found.</p>
	{:else}
		<ul class="collection-grid">
			{#each collections as collection}
				<li class="collection-card">
					<a href="/collections/{collection.handle}">
						{#if collection.image}
							<img
								src={collection.image.url}
								alt={collection.image.altText ?? collection.title}
								loading="lazy"
							/>
						{:else}
							<div class="collection-placeholder">No image</div>
						{/if}
						<h2>{collection.title}</h2>
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

	h1 {
		margin-bottom: 1rem;
	}

	.back {
		display: inline-block;
		margin-bottom: 1.5rem;
		text-decoration: none;
		color: #444;
	}

	.collection-grid {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1.5rem;
		padding: 0;
		margin: 0;
	}

	.collection-card {
		border: 1px solid #e2e2e2;
		border-radius: 0.5rem;
		overflow: hidden;
		background: white;
	}

	.collection-card a {
		display: block;
		color: inherit;
		text-decoration: none;
		padding: 0.75rem;
	}

	.collection-card img {
		width: 100%;
		height: 200px;
		object-fit: cover;
		border-radius: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.collection-placeholder {
		width: 100%;
		height: 200px;
		background: #f3f4f6;
		border-radius: 0.5rem;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.collection-card h2 {
		font-size: 1rem;
		margin: 0;
	}

	.error {
		color: #b00020;
	}
</style>
