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
	export let colorOptions: string[] = [];

	function swatchColor(name: string): string {
		const key = name.toLowerCase().trim();
		const map: Record<string, string> = {
			black: '#111111',
			charcoal: '#3b3f46',
			grey: '#8b9099',
			gray: '#8b9099',
			white: '#f5f5f5',
			cream: '#eee7db',
			ivory: '#f2ede2',
			navy: '#22324a',
			blue: '#3a6ea5',
			red: '#9f2f2f',
			burgundy: '#5f1f2c',
			green: '#4e6b59',
			olive: '#6b6b4c',
			brown: '#6b4f3a',
			tan: '#b39372',
			khaki: '#a29475',
			beige: '#cabaa0',
			purple: '#6b5f91',
			pink: '#b97787',
			yellow: '#d4b84e',
			gold: '#caa84a',
			orange: '#c47a3c'
		};
		for (const token of Object.keys(map)) {
			if (key.includes(token)) return map[token];
		}
		return '#d1d5db';
	}
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
			{#if colorOptions.length}
				<div class="swatches" aria-label="Available colors">
					{#each colorOptions as color}
						<span
							class="swatch"
							style={`background-color: ${swatchColor(color)}`}
							title={color}
							aria-label={color}
						></span>
					{/each}
				</div>
			{/if}
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
		background: transparent;
		line-height: 0;
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

	.swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 0.32rem;
		margin-bottom: 0.5rem;
	}

	.swatch {
		width: 0.62rem;
		height: 0.62rem;
		border-radius: 999px;
		border: 1px solid rgba(0, 0, 0, 0.2);
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
