<svelte:head>
	<title>New Arrivals | Ember</title>
	<meta
		name="description"
		content="Explore the latest arrivals from Badbish and Hanko."
	/>
</svelte:head>

<main class="page">
	<header class="intro">
		<p class="eyebrow">New Arrivals</p>
		<h1>Latest Drops</h1>
		<p>Fresh pieces from our newest stories.</p>
	</header>

	<section class="arrival-grid" aria-label="New arrival collections">
		<a class="arrival-card" href="/collections/badbish">
			<img src="/images/badbish.png" alt="Badbish collection" loading="lazy" />
			<div class="overlay">
				<h2>Badbish</h2>
				<span>Shop collection</span>
			</div>
		</a>

		<a class="arrival-card" href="/collections/hanko">
			<img src="/images/hanko_sweater.png" alt="Hanko collection" loading="lazy" />
			<div class="overlay">
				<h2>Hanko</h2>
				<span>Shop collection</span>
			</div>
		</a>
	</section>
</main>

<style>
	.page {
		max-width: 1120px;
		margin: 0 auto;
		padding: 2rem 1.5rem 3rem;
	}

	.intro {
		margin-bottom: 1.5rem;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-brand-gold);
	}

	h1 {
		margin: 0.3rem 0 0.4rem;
		font-size: clamp(1.55rem, 3.6vw, 2.4rem);
	}

	.intro p {
		color: #c2c7cb;
	}

	.arrival-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.arrival-card {
		position: relative;
		display: block;
		text-decoration: none;
		color: #f4f6f7;
		overflow: hidden;
		border: 1px solid #2a2f35;
		background: #0f1215;
	}

	.arrival-card img {
		display: block;
		width: 100%;
		height: clamp(320px, 48vw, 520px);
		object-fit: cover;
	}

	.overlay {
		position: absolute;
		left: 1rem;
		right: 1rem;
		bottom: 1rem;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 0.5rem;
	}

	h2 {
		margin: 0;
		font-size: clamp(1.1rem, 2.8vw, 1.8rem);
	}

	.overlay span {
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		border-bottom: 1px solid rgba(244, 246, 247, 0.7);
		padding-bottom: 0.2rem;
	}

	@media (max-width: 780px) {
		.page {
			padding: 1.4rem 1rem 2rem;
		}

		.arrival-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
