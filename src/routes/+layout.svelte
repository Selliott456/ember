<script lang="ts">
  import { page } from "$app/stores";
  import { afterNavigate } from "$app/navigation";
  import { onMount } from "svelte";
  import "$lib/theme.css";
  import { cart } from "$lib/stores/cart";
  import SiteFooter from "$lib/components/home/SiteFooter.svelte";

  let { children } = $props();

  const currentPath = $derived($page.url.pathname);
  const cartQuantity = $derived($cart.cart?.totalQuantity ?? 0);
  let isNavOpen = $state(false);

  afterNavigate(() => {
    isNavOpen = false;
  });

  onMount(() => {
    cart.loadCart();
  });
</script>

<svelte:head>
  <link rel="icon" href="/images/branding/ember_logo_white_transparent.png" />
</svelte:head>

<div class="app-root surface-grain">
  <div class="announcement-bar">
    <a href="/collections/hanko">SHOP NEW COLLECTION - HANKO</a>
  </div>
  <header class="site-header">
    <div class="site-header-inner">
      <a href="/" class="brand-wordmark" aria-label="Ember storefront home">
        <img
          src="/images/branding/ember_crop.png"
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
      <nav class="site-nav" class:site-nav-open={isNavOpen} aria-label="Primary">
        <div class="site-nav-links">
          <div class="nav-item nav-item-shop">
            <a href="/products" data-active={currentPath.startsWith("/products")}
              >Shop</a
            >
            <div class="shop-dropdown" aria-label="Shop categories">
              <div class="shop-column">
                <h3>Women</h3>
                <a href="/products?gender=women&type=tee">Tees</a>
                <a href="/products?gender=women&type=sweater">Sweaters</a>
                <a href="/products?gender=women&type=hoodie">Hoodies</a>
                <a href="/products?gender=women&type=bottoms">Bottoms</a>
              </div>
              <div class="shop-column">
                <h3>Men</h3>
                <a href="/products?gender=men&type=tee">Tees</a>
                <a href="/products?gender=men&type=sweater">Sweaters</a>
                <a href="/products?gender=men&type=hoodie">Hoodies</a>
                <a href="/products?gender=men&type=bottoms">Bottoms</a>
              </div>
              <div class="shop-column">
                <h3>Unisex</h3>
                <a href="/products?gender=unisex&type=tee">Tees</a>
                <a href="/products?gender=unisex&type=sweater">Sweaters</a>
                <a href="/products?gender=unisex&type=hoodie">Hoodies</a>
                <a href="/products?gender=unisex&type=bottoms">Bottoms</a>
              </div>
            </div>
          </div>
          <a
            href="/collections"
            data-active={currentPath.startsWith("/collections")}>Collections</a
          >
          <a
            href="/new-arrivals"
            data-active={currentPath.startsWith("/new-arrivals")}>New Arrivals</a
          >
          <a href="/#lookbook" data-active={false}>Lookbook</a>
        </div>

        <div class="site-nav-actions">
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
          <span class="nav-divider" aria-hidden="true">|</span>
          <a
            href="https://instagram.com/ember_apparel_co"
            aria-label="Instagram @ember_apparel_co"
            target="_blank"
            rel="noreferrer"
            class="social-nav-link"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="nav-icon">
              <rect x="4" y="4" width="16" height="16" rx="4" ry="4" fill="none" stroke="currentColor" stroke-width="1.8" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8" />
              <circle cx="17" cy="7" r="1" fill="currentColor" />
            </svg>
          </a>
          <a
            href="https://tiktok.com/@ember_apparel_co"
            aria-label="TikTok @ember_apparel_co"
            target="_blank"
            rel="noreferrer"
            class="social-nav-link"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="nav-icon">
              <path
                d="M15.6 3c.3 2.1 1.6 3.6 3.8 4v2.8c-1.3 0-2.6-.4-3.8-1.1v6.3c0 3.2-2.6 5.8-5.8 5.8S4 18.2 4 15s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v2.9c-.3-.1-.6-.2-.9-.2-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3V3h2.8z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </nav>
    </div>
  </header>

  <main class="app-main">
    {@render children()}
  </main>
  <SiteFooter />
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

  .announcement-bar a {
    color: inherit;
    text-decoration: none;
  }

  .announcement-bar a:hover {
    text-decoration: underline;
    text-underline-offset: 0.22rem;
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
    width: clamp(82px, 11vw, 118px);
    height: auto;
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

  .nav-item {
    position: relative;
  }

  .nav-item-shop {
    padding-bottom: 0.7rem;
    margin-bottom: -0.7rem;
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

  .shop-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 560px;
    padding: 0.9rem 1rem;
    border: 1px solid #2f353c;
    background: rgba(9, 12, 15, 0.98);
    display: none;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.15rem;
    z-index: 25;
  }

  .shop-column h3 {
    margin: 0 0 0.45rem;
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-brand-gold);
    font-weight: 600;
  }

  .shop-column a {
    display: block;
    padding: 0.2rem 0;
    font-size: 0.73rem;
    letter-spacing: 0.04em;
    text-transform: none;
    color: #d8dde1;
    border-bottom: none;
  }

  .shop-column a:hover {
    color: #f5f6f5;
  }

  .nav-item-shop:hover .shop-dropdown,
  .nav-item-shop:focus-within .shop-dropdown {
    display: grid;
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

  .social-nav-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .nav-divider {
    color: #6b7280;
    opacity: 0.7;
    font-size: 0.8rem;
    line-height: 1;
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

    .shop-dropdown {
      display: none !important;
    }
  }
</style>
