<script lang="ts">
	import { page } from '$app/stores';

	const homeCollections = [
		{
			handle: 'field-notes',
			title: 'Field Notes',
			image: '/images/fieldnotes_home.png',
			alt: 'Field Notes collection'
		},
		{
			handle: 'base-camp',
			title: 'Base Camp',
			image: '/images/basecamp_home.png',
			alt: 'Base Camp collection'
		},
		{
			handle: 'conditions',
			title: 'Conditions',
			image: '/images/conditions_home.png',
			alt: 'Conditions collection'
		},
		{
			handle: 'naeba',
			title: 'Naeba',
			image: '/images/naeba_home.png',
			alt: 'Naeba collection'
		},
		{
			handle: 'hanko',
			title: 'Hanko',
			image: '/images/hanko_sweater.png',
			alt: 'Hanko collection'
		},
		{
			handle: 'badbish',
			title: 'Badbish',
			image: '/images/badbish.png',
			alt: 'Badbish collection'
		}
	];
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

	<ul class="collection-grid">
		{#each homeCollections as collection}
			<li class="collection-card">
				<a href="/collections/{collection.handle}">
					<img src={collection.image} alt={collection.alt} loading="lazy" />
					<h2>{collection.title}</h2>
				</a>
			</li>
		{/each}
	</ul>
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

	.collection-card h2 {
		font-size: 1rem;
		margin: 0;
	}
</style>
