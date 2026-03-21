<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import CollectionCard from '$lib/components/home/CollectionCard.svelte';
	import ProductCard from '$lib/components/home/ProductCard.svelte';
	import CategoryTile from '$lib/components/home/CategoryTile.svelte';
	import SiteFooter from '$lib/components/home/SiteFooter.svelte';

	let { data }: { data: PageData } = $props();

	const products = $derived(data.products);
	const canonical = $derived($page.url.origin + $page.url.pathname);

	const featuredCollections = [
		{
			title: 'Hanko',
			description: 'Precision graphics and clean silhouettes.',
			href: '/collections/hanko',
			imageSrc: '/images/hanko_sweater.png',
			imageAlt: 'Hanko collection'
		},
		{
			title: 'Field Notes',
			description: 'Utility essentials refined by detail.',
			href: '/collections/field-notes',
			imageSrc: '/images/fieldnotes_home.png',
			imageAlt: 'Field Notes collection'
		},
		{
			title: 'Conditions',
			description: 'Built for shifting city weather.',
			href: '/collections/conditions',
			imageSrc: '/images/conditions_home.png',
			imageAlt: 'Conditions collection'
		},
		{
			title: 'Basecamp',
			description: 'Foundational layers for every day.',
			href: '/collections/base-camp',
			imageSrc: '/images/basecamp_home.png',
			imageAlt: 'Basecamp collection'
		}
	] as const;

	const curatedProducts = $derived(products.slice(0, 4));

	function getColorOptions(product: any): string[] {
		const seen = new Set<string>();
		const colors: string[] = [];
		for (const variant of product.variants ?? []) {
			const title = String(variant.title ?? '').trim();
			if (!title || title.toLowerCase() === 'default title') continue;
			const firstOption = title.split('/')[0]?.trim();
			if (!firstOption) continue;
			const key = firstOption.toLowerCase();
			if (seen.has(key)) continue;
			seen.add(key);
			colors.push(firstOption);
		}
		return colors.slice(0, 5);
	}

	const lookbookImages = [
		'/images/couple_street.png',
		'/images/group_skatepark.png',
		'/images/group_street.png',
		'/images/group_skate_laugh.png',
		'/images/group_skate_sundown.png',
		'/images/couple_skatepark.png'
	];
</script>

<svelte:head>
	<title>Ember | Premium Streetwear</title>
	<meta
		name="description"
		content="Premium streetwear with clean design and a worn-in edge."
	/>
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Ember | Premium Streetwear" />
	<meta
		property="og:description"
		content="Premium streetwear with clean design and a worn-in edge."
	/>
	<meta property="og:url" content={canonical} />
</svelte:head>

<main class="home">
	<HeroSection
		imageSrc="/images/hero-image.png"
		imageAlt="Ember crew in premium streetwear"
		title="EMBER"
		tagline="Premium streetwear for everyday movement."
	/>

	<section class="section">
		<div class="section-heading">
			<h2>Featured Collections</h2>
		</div>
		<div class="collection-grid">
			{#each featuredCollections as collection}
				<CollectionCard
					href={collection.href}
					title={collection.title}
					description={collection.description}
					imageSrc={collection.imageSrc}
					imageAlt={collection.imageAlt}
				/>
			{/each}
		</div>
	</section>

	<section class="statement">
		<p>
			Built for everyday movement, made with weight, grit, and comfort in mind.
			Ember blends clean design with a worn-in edge.
		</p>
	</section>

	<section class="new-drop">
		<div class="new-drop-media">
			<img src="/images/badbish_quad_1.png" alt="Badbish new drop preview" loading="lazy" />
		</div>
		<div class="new-drop-copy">
			<p class="new-drop-eyebrow">New Drop</p>
			<h2>Badbish</h2>
			<p>
				Signature graphics, washed tones, and heavyweight staples. A focused
				drop designed to hit hard and wear easy.
			</p>
			<a href="/collections/badbish">Shop Badbish</a>
		</div>
	</section>

	<section class="section">
		<div class="section-heading">
			<h2>Best Sellers</h2>
		</div>
		<div class="product-grid">
			{#each curatedProducts as product}
				<ProductCard
					href={`/products/${product.handle}`}
					title={product.title}
					imageSrc={(product.images?.[0]?.url ?? product.featuredImage?.url) || '/images/hero-image.png'}
					imageAlt={product.images?.[0]?.altText ?? product.featuredImage?.altText ?? product.title}
					hoverImageSrc={product.images?.[1]?.url ?? null}
					hoverImageAlt={product.images?.[1]?.altText ?? product.title}
					amount={product.priceRange.minVariantPrice.amount}
					currencyCode={product.priceRange.minVariantPrice.currencyCode}
					colorOptions={getColorOptions(product)}
				/>
			{:else}
				{#each [0, 1, 2, 3] as idx}
					<ProductCard
						href="/products"
						title={`Ember Piece ${idx + 1}`}
						imageSrc={lookbookImages[(idx + 1) % lookbookImages.length]}
						imageAlt="Ember product placeholder"
						amount="98"
						currencyCode="USD"
					/>
				{/each}
			{/each}
		</div>
	</section>

	<section class="editorial-banner">
		<img src="/images/shoreditch.png" alt="Ember lifestyle banner" loading="lazy" />
		<div class="editorial-copy">
			<p>Premium pieces. designed to be worn hard.</p>
			<a href="/about">Explore the Brand</a>
		</div>
	</section>

	<section class="section">
		<div class="section-heading">
			<h2>Shop by Category</h2>
		</div>
		<div class="category-row">
			<CategoryTile href="/products?type=tee" label="Tees" />
			<CategoryTile href="/products?type=sweater" label="Sweaters" />
			<CategoryTile href="/products?type=bottoms" label="Bottoms" />
		</div>
	</section>

	<section class="value-strip" aria-label="Brand values">
		<div>
			<strong>Heavyweight feel</strong>
			<p>Structured fabrics with premium drape.</p>
		</div>
		<div>
			<strong>All-day comfort</strong>
			<p>Designed to move from morning to late nights.</p>
		</div>
		<div>
			<strong>Small-run drops</strong>
			<p>Intentional pieces, released in tight batches.</p>
		</div>
	</section>

	<section class="section" id="lookbook">
		<div class="section-heading">
			<h2>Lookbook</h2>
		</div>
		<div class="lookbook-grid">
			{#each lookbookImages as imageSrc, idx}
				<figure class="lookbook-shot">
					<img src={imageSrc} alt={`Ember lookbook image ${idx + 1}`} loading="lazy" />
				</figure>
			{/each}
		</div>
	</section>

	<SiteFooter />
</main>

<style>
	:global(body) {
		background: #0a0d10;
		color: #ececea;
	}

	.home {
		max-width: 1120px;
		margin: 0 auto;
		padding: 0 1.5rem 2.5rem;
	}

	.section {
		margin-top: clamp(3rem, 7vw, 6rem);
	}

	.section-heading {
		margin-bottom: 1.4rem;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	h2 {
		margin: 0;
		font-size: clamp(1.2rem, 3vw, 1.65rem);
		letter-spacing: 0.04em;
		font-weight: 600;
	}

	.collection-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.statement {
		margin: clamp(3.5rem, 8vw, 7rem) auto 0;
		max-width: 72ch;
		padding: 0 1rem;
		text-align: center;
	}

	.statement p {
		margin: 0;
		color: #c5c7c9;
		font-size: clamp(1.05rem, 2.2vw, 1.35rem);
		line-height: 1.65;
	}

	.new-drop {
		margin-top: clamp(2.8rem, 6vw, 5rem);
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
		gap: 1.2rem;
		align-items: stretch;
	}

	.new-drop-media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.new-drop-copy {
		background: #101316;
		border: 1px solid #2a2f35;
		padding: clamp(1.1rem, 2.3vw, 1.8rem);
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.new-drop-eyebrow {
		margin: 0 0 0.35rem;
		font-size: 0.73rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-brand-gold);
	}

	.new-drop-copy h2 {
		font-size: clamp(1.4rem, 2.8vw, 2rem);
		color: var(--color-brand-gold);
	}

	.new-drop-copy p {
		margin: 0.85rem 0 0;
		color: #c2c7cb;
		line-height: 1.6;
	}

	.new-drop-copy a {
		margin-top: 1rem;
		align-self: flex-start;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 0.75rem;
		color: #f2f3f2;
		border-bottom: 1px solid rgba(242, 243, 242, 0.75);
		padding-bottom: 0.2rem;
	}

	.product-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.editorial-banner {
		position: relative;
		margin-top: clamp(3rem, 7vw, 6rem);
	}

	.editorial-banner::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(5, 7, 10, 0.72), rgba(5, 7, 10, 0.2));
		pointer-events: none;
	}

	.editorial-banner img {
		width: 100%;
		height: clamp(260px, 42vw, 420px);
		object-fit: cover;
		filter: saturate(0.9) contrast(1.02);
	}

	.editorial-copy {
		position: absolute;
		left: 2rem;
		bottom: 2rem;
		max-width: 28rem;
		z-index: 1;
	}

	.editorial-copy p {
		margin: 0;
		font-size: clamp(1.1rem, 3vw, 1.8rem);
		line-height: 1.25;
		font-weight: 500;
		color: var(--color-brand-gold);
	}

	.editorial-copy a {
		display: inline-block;
		margin-top: 1rem;
		color: #f1f3f2;
		text-decoration: none;
		text-transform: uppercase;
		font-size: 0.78rem;
		letter-spacing: 0.14em;
		border-bottom: 1px solid rgba(241, 243, 242, 0.7);
		padding-bottom: 0.2rem;
	}

	.category-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		width: 100%;
	}

	.value-strip {
		margin-top: clamp(2.8rem, 6vw, 5rem);
		padding: 1.35rem 1rem;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		border-top: 1px solid #2a2d31;
		border-bottom: 1px solid #2a2d31;
	}

	.value-strip strong {
		font-size: 0.88rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.value-strip p {
		margin: 0.5rem 0 0;
		color: #bcc1c6;
		font-size: 0.88rem;
	}

	.lookbook-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.lookbook-shot {
		margin: 0;
		overflow: hidden;
	}

	.lookbook-shot img {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		transition: transform 220ms ease;
	}

	.lookbook-shot:hover img {
		transform: scale(1.02);
	}

	@media (max-width: 960px) {
		.collection-grid,
		.product-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.new-drop {
			grid-template-columns: 1fr;
		}

		.lookbook-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.value-strip {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.home {
			padding: 0 1rem 2rem;
		}

		.collection-grid,
		.product-grid,
		.lookbook-grid {
			grid-template-columns: 1fr;
		}

		.editorial-copy {
			left: 1rem;
			right: 1rem;
			bottom: 1rem;
		}

		.category-row {
			grid-template-columns: 1fr;
		}
	}
</style>
