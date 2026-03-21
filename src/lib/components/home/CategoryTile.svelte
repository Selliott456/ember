<script lang="ts">
	export let href: string;
	export let label: string;
</script>

<a class="category-tile" href={href}>{label}</a>

<style>
	.category-tile {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 3.1rem;
		padding: 1rem 1.2rem;
		border: 1px solid #34373b;
		color: #e8e9e8;
		text-decoration: none;
		font-size: 0.82rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		background: #121417;
		transition: background-color 160ms ease, border-color 160ms ease;
	}

	.category-tile:hover {
		background: #181b1f;
		border-color: #565c63;
	}
</style>
