<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import favicon from "$lib/assets/favicon.svg";
  import "$lib/theme.css";
  import { cart } from "$lib/stores/cart";

  let { children } = $props();

  const currentPath = $derived($page.url.pathname);
  const cartQuantity = $derived($cart.cart?.totalQuantity ?? 0);
  let isNavOpen = $state(false);

  onMount(() => {
    cart.loadCart();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="app-root surface-grain">
  <div class="announcement-bar">Free shipping over $100</div>
  <header class="site-header">
    <div class="site-header-inner">
      <a href="/" class="brand-wordmark" aria-label="Ember storefront home">
        <img
          src="/images/branding/ember_logo_white_transparent.png"
          alt=""
          loading="eager"
          aria-hidden="true"
        />
      </a>
      <button
        type="button"
        class="site-nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded={isNavOpen}
        onclick={() => (isNavOpen = !isNavOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav
        class="site-nav"
        class:site-nav-open={isNavOpen}
        aria-label="Primary"
      >
        <div class="site-nav-links">
          <a href="/products" data-active={currentPath.startsWith("/products")}
            >Shop</a
          >
          <a
            href="/collections"
            data-active={currentPath.startsWith("/collections")}>Collections</a
          >
          <a href="/products" data-active={false}>New Arrivals</a>
          <a href="/about" data-active={currentPath.startsWith("/about")}
            >About</a
          >
          <a href="/#lookbook" data-active={false}>Lookbook</a>
        </div>

        <div class="site-nav-actions">
          <a href="/search" aria-label="Search">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              class="nav-icon"
            >
              <circle
                cx="11"
                cy="11"
                r="6.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M16 16l4.3 4.3"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </a>
          <a href="/account" aria-label="Account">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              class="nav-icon"
            >
              <circle
                cx="12"
                cy="8"
                r="3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M5.5 20c1.2-3.1 3.7-4.9 6.5-4.9S17.3 16.9 18.5 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </a>
          <a
            href="/cart"
            class="cart-link"
            data-active={currentPath.startsWith("/cart")}
            aria-label="Cart"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              class="nav-icon"
            >
              <path
                d="M3 5h2l2.4 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L21 8H7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="10" cy="19" r="1.5" fill="currentColor" />
              <circle cx="17" cy="19" r="1.5" fill="currentColor" />
            </svg>
            {#if cartQuantity > 0}
              <span
                class="cart-badge"
                aria-label={`${cartQuantity} items in cart`}
              >
                {cartQuantity}
              </span>
            {/if}
          </a>
        </div>
      </nav>
    </div>
  </header>

  <main class="app-main">
    {@render children()}
  </main>
</div>

<style>
  .announcement-bar {
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    text-align: center;
    padding: 0.35rem 1rem;
    color: #f1f3f2;
    background: #090b0d;
    border-bottom: 1px solid #262a2e;
  }

  .site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    border-bottom: 1px solid rgba(130, 136, 142, 0.4);
    background: rgba(8, 10, 12, 0.9);
    backdrop-filter: blur(10px);
  }

  .site-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.85rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .brand-wordmark {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }

  .brand-wordmark img {
    display: block;
    width: clamp(96px, 14vw, 142px);
    height: 58px;
    object-fit: cover;
    object-position: center;
    clip-path: inset(10px 0 0 0);
  }

  .site-nav-toggle {
    display: none;
    background: transparent;
    border: 0;
    padding: 0.25rem;
    margin-left: auto;
  }

  .site-nav-toggle span {
    display: block;
    width: 1.1rem;
    height: 1px;
    background: #f2f3f2;
    margin: 0.22rem 0;
  }

  .site-nav {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .site-nav-links {
    display: flex;
    align-items: center;
    gap: 1.1rem;
  }

  .site-nav-links a {
    text-decoration: none;
    color: #e4e7e8;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .site-nav-links a:hover,
  .site-nav-links a[data-active="true"] {
    color: #f3f4f3;
  }

  .site-nav-actions {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .site-nav-actions a {
    color: #f1f2f1;
  }

  .cart-link {
    display: inline-flex;
    align-items: center;
    position: relative;
  }

  .nav-icon {
    width: 1rem;
    height: 1rem;
  }

  .cart-badge {
    min-width: 1.1rem;
    height: 1.1rem;
    border-radius: 999px;
    padding: 0 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 700;
    line-height: 1;
    background: #dc2626;
    color: #ffffff;
  }

  @media (max-width: 920px) {
    .site-nav-toggle {
      display: inline-block;
    }

    .site-nav {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #272b30;
      background: rgba(12, 14, 16, 0.97);
      display: none;
      flex-direction: column;
      align-items: flex-start;
    }

    .site-nav.site-nav-open {
      display: flex;
    }

    .site-nav-links {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.85rem;
    }
  }
</style>
