<script lang="ts">
	export let imageSrc = '/images/couple_skatepark.png';
</script>

<section class="basecamp-hero" style={`--hero-image: url('${imageSrc}')`}>
	<div class="overlay"></div>
	<div class="content">
		<p class="eyebrow">Basecamp Collection</p>
		<h2>Built to be worn every day</h2>
		<p class="body">
			A collection of premium essentials, designed with clarity, weight, and
			purpose. Each piece is stripped back to what matters — clean lines,
			considered fabric, and a fit that holds up, day after day.
		</p>
	</div>
</section>

<style>
	.basecamp-hero {
		position: relative;
		margin: 0 calc(50% - 50vw) 1.4rem;
		min-height: clamp(400px, 58vw, 560px);
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
		background: linear-gradient(
			to top,
			rgba(8, 10, 12, 0.9),
			rgba(8, 10, 12, 0.56),
			rgba(8, 10, 12, 0.18)
		);
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
		font-size: clamp(2rem, 4.4vw, 3.1rem);
		line-height: 1.08;
		letter-spacing: 0.01em;
	}

	.body {
		margin: 0.95rem 0 0;
		max-width: 64ch;
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
