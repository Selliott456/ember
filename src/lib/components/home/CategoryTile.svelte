<script lang="ts">
	export let href: string;
	export let label: string;
</script>

<a class="category-tile" href={href}>{label}</a>

<style>
	.category-tile {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.8rem 1.2rem;
		border: 1px solid #34373b;
		color: #e8e9e8;
		text-decoration: none;
		font-size: 0.78rem;
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
