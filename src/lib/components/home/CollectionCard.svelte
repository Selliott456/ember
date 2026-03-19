<script lang="ts">
	export let href: string;
	export let title: string;
	export let description: string;
	export let imageSrc: string;
	export let imageAlt: string;
</script>

<article class="collection-card">
	<a href={href}>
		<img src={imageSrc} alt={imageAlt} loading="lazy" />
		<div class="body">
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	</a>
</article>

<style>
	.collection-card {
		overflow: hidden;
		background: #121416;
	}

	a {
		display: block;
		position: relative;
		color: #f5f5f4;
		text-decoration: none;
	}

	img {
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		filter: saturate(0.9) contrast(1.03);
		transition: transform 260ms ease;
	}

	.body {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 1.2rem;
		background: linear-gradient(to top, rgba(5, 7, 10, 0.96), rgba(5, 7, 10, 0.42), transparent);
	}

	h3 {
		margin: 0;
		font-size: 1.15rem;
		letter-spacing: 0.04em;
	}

	p {
		margin: 0.4rem 0 0;
		font-size: 0.88rem;
		color: rgba(245, 245, 244, 0.94);
	}

	.collection-card:hover img {
		transform: scale(1.03);
	}
</style>
