<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { dev } from "$app/environment";
  import { formatPrice } from "$lib/formatPrice";

  let { data }: { data: PageData } = $props();

  const products = $derived(data.products);
  const canonical = $derived($page.url.origin + $page.url.pathname);

  const fieldNotesProducts = $derived(
    products.filter((p) => p.tags?.includes("fieldnotes")).slice(0, 3)
  );
  const baseCampProducts = $derived(
    products
      .filter((p) => p.tags?.includes("basecamp") || p.tags?.includes("everyday"))
      .slice(0, 3)
  );
  const conditionsProducts = $derived(
    products.filter((p) => p.tags?.includes("conditions")).slice(0, 3)
  );
  const naebaProducts = $derived(
    products.filter((p) => p.tags?.includes("naeba")).slice(0, 3)
  );

  const unbucketedProducts = $derived(
    products.filter((p) => {
      const tags = p.tags ?? [];
      const buckets = ["fieldnotes", "basecamp", "everyday", "conditions", "naeba"];
      return !tags.some((tag) => buckets.includes(tag));
    })
  );

  $effect(() => {
    if (dev && unbucketedProducts.length) {
      console.warn(
        "[debug] Products missing collection tags:",
        unbucketedProducts.map((p) => ({ title: p.title, handle: p.handle, tags: p.tags }))
      );
    }
  });
</script>

<svelte:head>
  <title>Ember skate supply</title>
  <meta
    name="description"
    content="Ember skate supply – premium apparel made for motion."
  />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ember skate supply" />
  <meta
    property="og:description"
    content="Ember skate supply – premium apparel made for motion."
  />
  <meta property="og:url" content={canonical} />
</svelte:head>

<main class="page">
  <section class="hero">
    <div class="hero-brand">
      <img
        class="hero-logo"
        src="/images/branding/image.png"
        alt="Ember logo"
        loading="eager"
      />
      <p class="hero-tagline">PREMIUM APPAREL MADE FOR MOTION.</p>
    </div>
    <img
      class="hero-image"
      src="/images/hero-image.png"
      alt="Skate crew wearing Ember apparel"
      loading="eager"
    />
  </section>

  <section class="shop-all">
    <div class="shop-all-media">
      <img
        src="/images/group_skate_sundown.png"
        alt="Friends skating together at sundown"
        loading="lazy"
      />
      <div class="shop-all-cta-group">
        <a class="shop-all-tile shop-all-tile--men" href="/collections/men">Shop men</a>
        <a class="shop-all-tile shop-all-tile--unisex" href="/collections/unisex">Shop unisex</a>
        <a class="shop-all-tile shop-all-tile--women" href="/collections/women">Shop women</a>
        <a class="shop-all-tile shop-all-tile--all" href="/products">Shop all</a>
      </div>
    </div>
  </section>

  <section class="collection-carousel">
    <div class="collection-carousel-header">
      <h2>Shop Field Notes collection</h2>
      <a href="/collections/field-notes">View all</a>
    </div>
    {#if fieldNotesProducts.length}
      <div class="collection-carousel-track">
        {#each fieldNotesProducts as product}
          <a href={`/products/${product.handle}`} class="collection-card">
            {#if product.featuredImage}
              <img
                src={product.featuredImage.url}
                alt={product.featuredImage.altText ?? product.title}
                loading="lazy"
              />
            {/if}
            <div class="collection-card-body">
              <h3>{product.title}</h3>
              <p class="collection-card-price">
                {formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode
                )}
              </p>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <p class="collection-empty">No Field Notes pieces live yet.</p>
    {/if}
  </section>

  <section class="collection-carousel">
    <div class="collection-carousel-header">
      <h2>Shop Base Camp collection</h2>
      <a href="/collections/base-camp">View all</a>
    </div>
    {#if baseCampProducts.length}
      <div class="collection-carousel-track">
        {#each baseCampProducts as product}
          <a href={`/products/${product.handle}`} class="collection-card">
            {#if product.featuredImage}
              <img
                src={product.featuredImage.url}
                alt={product.featuredImage.altText ?? product.title}
                loading="lazy"
              />
            {/if}
            <div class="collection-card-body">
              <h3>{product.title}</h3>
              <p class="collection-card-price">
                {formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode
                )}
              </p>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <p class="collection-empty">No Base Camp staples live yet.</p>
    {/if}
  </section>

  <section class="collection-carousel">
    <div class="collection-carousel-header">
      <h2>Conditions collection</h2>
      <a href="/collections/conditions">View all</a>
    </div>
    {#if conditionsProducts.length}
      <div class="collection-carousel-track">
        {#each conditionsProducts as product}
          <a href={`/products/${product.handle}`} class="collection-card">
            {#if product.featuredImage}
              <img
                src={product.featuredImage.url}
                alt={product.featuredImage.altText ?? product.title}
                loading="lazy"
              />
            {/if}
            <div class="collection-card-body">
              <h3>{product.title}</h3>
              <p class="collection-card-price">
                {formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode
                )}
              </p>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <p class="collection-empty">No Conditions pieces live yet.</p>
    {/if}
  </section>

  <section class="collection-carousel">
    <div class="collection-carousel-header">
      <h2>Naeba collection</h2>
      <a href="/collections/naeba">View all</a>
    </div>
    {#if naebaProducts.length}
      <div class="collection-carousel-track">
        {#each naebaProducts as product}
          <a href={`/products/${product.handle}`} class="collection-card">
            {#if product.featuredImage}
              <img
                src={product.featuredImage.url}
                alt={product.featuredImage.altText ?? product.title}
                loading="lazy"
              />
            {/if}
            <div class="collection-card-body">
              <h3>{product.title}</h3>
              <p class="collection-card-price">
                {formatPrice(
                  product.priceRange.minVariantPrice.amount,
                  product.priceRange.minVariantPrice.currencyCode
                )}
              </p>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <p class="collection-empty">No Naeba pieces live yet.</p>
    {/if}
  </section>

  {#if dev}
    <section class="debug-untagged">
      <h2>Debug: Untagged products</h2>
      {#if unbucketedProducts.length}
        <p>These products are not in any of: fieldnotes, basecamp/everyday, conditions, naeba.</p>
        <ul>
          {#each unbucketedProducts as product}
            <li>
              <code>{product.title}</code>
              <span>({product.handle})</span>
              {#if product.tags?.length}
                <span>– tags: {product.tags.join(", ")}</span>
              {:else}
                <span>– no tags</span>
              {/if}
            </li>
          {/each}
        </ul>
      {:else}
        <p>All loaded products are tagged into one of: fieldnotes, basecamp/everyday, conditions, naeba.</p>
      {/if}
    </section>
  {/if}
</main>

<style>
  .page {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 1.5rem 3.5rem;
  }

  .hero {
    position: relative;
    margin: 0 calc(50% - 50vw) 2.75rem;
  height: 60vh;
    border-radius: 0;
    overflow: hidden;
  }

  .hero::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  background-color: rgba(0, 48, 63, 0.7); /* darker brand ink vignette */
    mix-blend-mode: multiply;
  z-index: 0;
  }

  .hero-image {
    display: block;
    width: 100%;
  height: 100%;
  object-fit: cover;
  }

  .hero-brand {
  position: absolute;
  left: 1.5rem;
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
   z-index: 1;
}

  .hero-logo {
  display: block;
  max-width: 360px;
  width: 100%;
  height: auto;
}

  .hero-tagline {
  margin-top: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
}

  .shop-all {
    display: block;
  }

  .shop-all-media img {
    display: block;
    width: 100%;
    border-radius: var(--radius-md);
    object-fit: cover;
  }

  .shop-all-media {
    position: relative;
  }

  .shop-all-cta-group {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: 2fr 1fr; /* top row 2/3 height, bottom row 1/3 */
  }

  .shop-all-tile {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.8rem;
    font-weight: var(--font-weight-medium);
    color: #ffffff;
    padding: 1.5rem 0.5rem;
  }

  .shop-all-tile--all {
    background-color: rgba(220, 174, 29, 0.7); /* brand gold */
    color: #021f29;
    grid-column: 1 / -1; /* span full width under the three columns */
  }

  .shop-all-tile--women {
    background-color: rgba(202, 228, 219, 0.55); /* brand mist */
    color: #021f29;
  }

  .shop-all-tile--men {
    background-color: rgba(122, 157, 150, 0.7); /* brand sage */
  }

  .shop-all-tile--unisex {
    background-color: rgba(0, 48, 63, 0.78); /* brand ink */
    color: #ffffff;
  }

  .collection-carousel {
    margin-top: var(--space-8);
  }

  .collection-carousel-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
  }

  .collection-carousel-header h2 {
    margin: 0;
    font-size: 1.3rem;
    letter-spacing: var(--letter-spacing-tight);
  }

  .collection-carousel-header a {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    text-decoration: none;
    color: var(--color-text-soft);
  }

  .collection-carousel-header a:hover {
    color: var(--color-text);
  }

  .collection-carousel-track {
    display: flex;
    gap: var(--space-4);
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .collection-card {
    flex: 0 0 220px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border-subtle);
    background-color: var(--color-surface);
    padding: var(--space-3);
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-none);
    transition:
      transform 90ms ease-out,
      box-shadow 90ms ease-out,
      border-color 90ms ease-out;
  }

  .collection-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-sm);
    border-color: var(--color-border);
  }

  .collection-card-label {
    font-size: 0.9rem;
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-tight);
  }

  .collection-card img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: var(--radius-md);
    margin-bottom: 0.5rem;
  }

  .collection-card-body h3 {
    margin: 0 0 0.25rem;
    font-size: 0.95rem;
    letter-spacing: var(--letter-spacing-tight);
  }

  .collection-card-price {
    margin: 0;
    font-size: 0.9rem;
    font-weight: var(--font-weight-semibold);
  }

  .collection-empty {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }

  .debug-untagged {
    margin-top: var(--space-8);
    padding: var(--space-4);
    border-radius: var(--radius-md);
    border: 1px dashed var(--color-border-subtle);
    background-color: #fff7ed;
    font-size: 0.85rem;
  }

  .debug-untagged h2 {
    margin: 0 0 0.5rem;
    font-size: 0.95rem;
  }

  .debug-untagged ul {
    margin: 0.25rem 0 0;
    padding-left: 1.1rem;
  }

  .debug-untagged li {
    margin-bottom: 0.25rem;
  }

  @media (max-width: 768px) {
    .collection-carousel {
      margin-top: var(--space-6);
    }

    .collection-card {
      flex-basis: 70%;
    }
  }

  @media (max-width: 768px) {
    .hero {
      margin: 0 calc(50% - 50vw) 2rem;
      width: 100vw;
      height: 30vh;
    }

    .hero-brand {
      top: 50%;
      left: 50%;
      bottom: auto;
      transform: translate(-50%, -50%);
      align-items: center;
      text-align: center;
    }

    .shop-all-cta-group {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: none; /* let rows size naturally when stacked */
    }
  }
</style>
