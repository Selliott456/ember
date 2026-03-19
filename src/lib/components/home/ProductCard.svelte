<script lang="ts">
	import { formatPrice } from '$lib/formatPrice';

	export let href: string;
	export let title: string;
	export let imageSrc: string;
	export let imageAlt: string;
	export let amount: string;
	export let currencyCode: string;
	export let hoverImageSrc: string | null = null;
	export let hoverImageAlt: string | null = null;
</script>

<article class="product-card">
	<a href={href}>
		<div class="image-wrap">
			<img class="primary" src={imageSrc} alt={imageAlt} loading="lazy" />
			{#if hoverImageSrc}
				<img
					class="secondary"
					src={hoverImageSrc}
					alt={hoverImageAlt ?? imageAlt}
					loading="lazy"
					aria-hidden="true"
				/>
			{/if}
		</div>
		<div class="meta">
			<h3>{title}</h3>
			<p>{formatPrice(amount, currencyCode)}</p>
		</div>
	</a>
</article>

<style>
	.product-card a {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.image-wrap {
		position: relative;
		overflow: hidden;
		background: #111315;
	}

	.image-wrap img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
	}

	.secondary {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 220ms ease;
	}

	.product-card:hover .secondary {
		opacity: 1;
	}

	.meta {
		padding-top: 0.85rem;
	}

	h3 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 500;
		letter-spacing: 0.02em;
	}

	p {
		margin: 0.35rem 0 0;
		font-size: 0.88rem;
		color: #bcc0c4;
	}
</style>
