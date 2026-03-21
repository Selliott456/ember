<svelte:head>
	<title>Returns & Refunds | Ember</title>
	<meta
		name="description"
		content="Returns and refunds policy for Ember orders."
	/>
</svelte:head>

<main class="policy-page">
	<h1>Returns &amp; Refunds</h1>

	<p>
		Each Ember piece is made to order. Because of this, we keep returns simple
		and fair.
	</p>

	<section>
		<h2>We offer replacements or refunds if:</h2>
		<ul>
			<li>Your item arrives damaged</li>
			<li>You receive the wrong item</li>
		</ul>
	</section>

	<section>
		<h2>To request a replacement or refund:</h2>
		<ul>
			<li>Contact us within 7 days of delivery</li>
			<li>Include your order number and clear photos of the issue</li>
		</ul>
	</section>

	<section>
		<h2>We do not accept returns for:</h2>
		<ul>
			<li>Change of mind</li>
			<li>Incorrect sizing</li>
			<li>Minor variations in color or print placement</li>
		</ul>
	</section>

	<section>
		<h2>Sizing responsibility</h2>
		<p>
			Please check sizing guides carefully before ordering. If you&apos;re unsure,
			reach out — we&apos;re happy to help.
		</p>
	</section>

	<section>
		<h2>Refund method</h2>
		<p>Approved refunds will be issued to your original payment method.</p>
	</section>

	<section>
		<h2>Lost packages</h2>
		<p>
			If your package is marked as delivered but cannot be found, please contact
			the carrier first. If you still need help, reach out and we&apos;ll do our
			best to assist.
		</p>
	</section>
</main>

<style>
	.policy-page {
		max-width: 860px;
		margin: 0 auto;
		padding: 2rem 1rem 3rem;
		color: #1b1f24;
		background: #f8f9fa;
	}

	h1 {
		margin: 0 0 1rem;
		font-size: clamp(1.6rem, 3.8vw, 2.4rem);
	}

	h2 {
		margin: 1.6rem 0 0.45rem;
		font-size: clamp(1rem, 2.1vw, 1.2rem);
	}

	p,
	li {
		color: #2e3640;
		line-height: 1.65;
	}

	ul {
		margin: 0.45rem 0 0.8rem;
		padding-left: 1.1rem;
	}
</style>
