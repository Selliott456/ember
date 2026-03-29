<script lang="ts">
	export let imageSrc = '/images/hanko-stmaps.png';
</script>

<section class="hanko-hero" style={`--hero-image: url('${imageSrc}')`}>
	<div class="overlay"></div>
	<div class="content">
		<p class="eyebrow">Hanko Collection</p>
		<h2>A mark of identity, carried forward</h2>
		<p class="body">
			Inspired by traditional Japanese hanko seals, this collection reimagines a
			centuries-old mark of identity in a more personal form. Each piece is
			based on dogs we know and love — adopted, remembered, and carried forward
			as a quiet imprint of character, presence, and belonging.
		</p>
	</div>
</section>

<style>
	.hanko-hero {
		position: relative;
		margin: 0 calc(50% - 50vw) 1.4rem;
		min-height: clamp(360px, 56vw, 520px);
		background-image: var(--hero-image);
		background-size: cover;
		background-position: center;
		overflow: hidden;
		display: grid;
		align-items: end;
	}

	.overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(6, 8, 10, 0.9), rgba(6, 8, 10, 0.55), rgba(6, 8, 10, 0.15));
	}

	.content {
		position: relative;
		z-index: 1;
		max-width: 1120px;
		margin: 0 auto;
		padding: clamp(1.2rem, 3vw, 2rem) 1.2rem clamp(1.3rem, 3.2vw, 2.4rem);
		color: #f5f6f5;
		animation: fade-up 380ms ease-out both;
	}

	.eyebrow {
		margin: 0 0 0.45rem;
		font-size: 0.74rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-brand-gold);
	}

	h2 {
		margin: 0;
		max-width: 20ch;
		font-size: clamp(1.9rem, 4.4vw, 3.1rem);
		line-height: 1.06;
		letter-spacing: 0.015em;
	}

	.body {
		margin: 0.95rem 0 0;
		max-width: 66ch;
		font-size: clamp(0.95rem, 1.7vw, 1.08rem);
		line-height: 1.6;
		color: rgba(245, 246, 245, 0.94);
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
