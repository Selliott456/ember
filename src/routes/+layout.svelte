<script lang="ts">
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/theme.css';

	let { children } = $props();

	const currentPath = $derived($page.url.pathname);
	let isNavOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-root surface-grain">
	<header class="site-header">
		<div class="site-header-inner">
			<a href="/" class="brand-mark" aria-label="Ember storefront home">
				<div class="brand-logo-wrap">
					<img
						class="brand-logo"
						src="/images/branding/nav_image.png"
						alt="Ember mountain logo"
						loading="eager"
					/>
				</div>
			</a>
			<button
				type="button"
				class="site-nav-toggle"
				aria-label="Toggle navigation"
				aria-expanded={isNavOpen}
				on:click={() => (isNavOpen = !isNavOpen)}
			>
				<span></span>
				<span></span>
				<span></span>
			</button>
			<nav class="site-nav" class:site-nav-open={isNavOpen} aria-label="Primary">
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
