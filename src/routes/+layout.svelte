<script lang="ts">
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/theme.css';

	let { children } = $props();

	const currentPath = $derived($page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-root surface-grain">
	<header class="site-header">
		<div class="site-header-inner">
			<a href="/" class="brand-mark" aria-label="Ember storefront home">
				<span class="brand-wordmark">EMBER</span>
				<span class="brand-sub">skate supply</span>
			</a>
			<nav class="site-nav" aria-label="Primary">
				<a href="/" data-active={currentPath === '/'}>Home</a>
				<a href="/products" data-active={currentPath.startsWith('/products') && currentPath !== '/'}>Products</a>
				<a href="/collections" data-active={currentPath.startsWith('/collections')}>Collections</a>
				<a href="/cart" data-active={currentPath.startsWith('/cart')}>Cart</a>
			</nav>
		</div>
	</header>

	<main class="app-main">
		{@render children()}
	</main>
</div>
