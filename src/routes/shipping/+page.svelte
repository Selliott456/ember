<svelte:head>
	<title>Shipping | Ember</title>
	<meta
		name="description"
		content="Shipping policy and delivery timelines for Ember orders."
	/>
</svelte:head>

<main class="policy-page">
	<h1>Shipping</h1>
	<p>
		We work with production partners to fulfill each order on demand. This means
		your items are made, prepared, and shipped after your order is placed.
	</p>

	<section class="notice">
		<h2>Customs &amp; import charges</h2>
		<p>
			International orders may be subject to customs duties or import taxes upon
			arrival. These charges are determined by local authorities and are not
			included at checkout.
		</p>
	</section>

	<section>
		<h2>Processing time</h2>
		<p>Orders are typically processed within 2–5 business days before shipping.</p>
	</section>

	<section>
		<h2>Shipping time</h2>
		<p>Estimated delivery times vary by location:</p>
		<ul>
			<li>US &amp; Europe: 5–10 business days</li>
			<li>UK: 4–8 business days</li>
			<li>Japan &amp; Asia: 5–10 business days</li>
			<li>Rest of world: 7–15 business days</li>
		</ul>
		<p>Please note these are estimates and may vary during peak periods.</p>
	</section>

	<section>
		<h2>Tracking</h2>
		<p>Once your order ships, you&apos;ll receive a confirmation email with tracking details.</p>
	</section>

	<section>
		<h2>Multiple items</h2>
		<p>Items may ship separately depending on availability and production location.</p>
	</section>

	<section>
		<h2>Customs &amp; duties</h2>
		<p>
			International orders may be subject to customs fees or import duties.
			These are the responsibility of the customer.
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

	.notice {
		margin: 1rem 0 0.4rem;
		padding: 0.9rem 1rem;
		border: 1px solid #f1c9c9;
		background: #fff3f3;
	}

	.notice h2 {
		margin-top: 0;
	}

	.notice p {
		margin: 0.4rem 0 0;
		color: #7f1d1d;
	}
</style>
