<script lang="ts">
	export let imageSrc = '/images/hero-image.png';
	export let imageAlt = 'Ember streetwear hero image';
	export let title = 'EMBER';
	export let tagline = 'Premium apparel made for motion.';
	export let logoSrc = '/images/branding/ember_logo_white_transparent.png';
</script>

<section class="hero" style={`--hero-image: url('${imageSrc}')`}>
	<div class="overlay"></div>
	<div class="content">
		<p class="eyebrow">New drop live now</p>
		<h1 class="brand-heading">
			<img src={logoSrc} alt="" loading="eager" aria-hidden="true" />
			<span class="sr-only-heading">{title}</span>
		</h1>
		<p class="tagline">{tagline}</p>
		<div class="actions">
			<a class="btn btn-primary" href="/collections/badbish">Shop New Drop</a>
			<a class="btn btn-secondary" href="/collections">View Collections</a>
		</div>
	</div>
	<img class="sr-only-image" src={imageSrc} alt={imageAlt} loading="eager" />
</section>

<style>
	.hero {
		position: relative;
		min-height: clamp(520px, 72vh, 760px);
		margin: 0 calc(50% - 50vw);
		background-image: var(--hero-image);
		background-size: cover;
		background-position: center;
		display: grid;
		align-items: center;
	}

	.overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, rgba(5, 7, 10, 0.55), rgba(5, 7, 10, 0.8));
	}

	.content {
		position: relative;
		z-index: 1;
		max-width: 1120px;
		width: 100%;
		margin: 0 auto;
		padding: 0 1.5rem;
		color: #f8f8f7;
	}

	.eyebrow {
		margin: 0 0 0.6rem;
		font-size: 0.72rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-brand-gold);
		opacity: 0.85;
	}

	h1 {
		margin: 0;
		font-size: clamp(3rem, 12vw, 7.2rem);
		letter-spacing: 0.06em;
		line-height: 0.9;
		font-weight: 700;
	}

	.brand-heading img {
		width: min(72vw, 620px);
		height: auto;
		display: block;
	}

	.sr-only-heading {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.tagline {
		margin: 1rem 0 0;
		max-width: 32ch;
		font-size: clamp(1rem, 2.6vw, 1.2rem);
		opacity: 0.9;
	}

	.actions {
		margin-top: 2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.btn {
		text-decoration: none;
		padding: 0.8rem 1.25rem;
		font-size: 0.82rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		border: 1px solid transparent;
		transition: transform 160ms ease, background-color 160ms ease, border-color 160ms ease;
	}

	.btn:hover {
		transform: translateY(-1px);
	}

	.btn-primary {
		background: var(--color-brand-gold);
		color: #101214;
	}

	.btn-secondary {
		border-color: rgba(238, 238, 236, 0.8);
		color: #f3f4f3;
		background: rgba(16, 18, 20, 0.45);
	}

	.sr-only-image {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
