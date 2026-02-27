<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { dev } from "$app/environment";
  import { formatPrice } from "$lib/formatPrice";

  let { data }: { data: PageData } = $props();

  const products = $derived(data.products);
  const canonical = $derived($page.url.origin + $page.url.pathname);

  const BUCKET_TAGS = {
    fieldnotes: ["fieldnotes"],
    basecamp: ["basecamp", "everyday"],
    conditions: ["conditions"],
    naeba: ["naeba"]
  } as const;

  function hasAnyTag(product: { tags?: string[] }, tagsToMatch: string[]) {
    const tags = (product.tags ?? []).map((t) => t.toLowerCase());
    return tagsToMatch.some((tag) => tags.includes(tag));
  }

  const fieldNotesProducts = $derived(
    products.filter((p) => hasAnyTag(p, BUCKET_TAGS.fieldnotes))
  );
  const baseCampProducts = $derived(
    products.filter((p) => hasAnyTag(p, BUCKET_TAGS.basecamp))
  );
  const conditionsProducts = $derived(
    products.filter((p) => hasAnyTag(p, BUCKET_TAGS.conditions))
  );
  const naebaProducts = $derived(
    products.filter((p) => hasAnyTag(p, BUCKET_TAGS.naeba))
  );

  const ALL_BUCKET_TAGS = [
    ...BUCKET_TAGS.fieldnotes,
    ...BUCKET_TAGS.basecamp,
    ...BUCKET_TAGS.conditions,
    ...BUCKET_TAGS.naeba
  ];

  const unbucketedProducts = $derived(
    products.filter((p) => {
      return !hasAnyTag(p, ALL_BUCKET_TAGS);
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

  <section class="collections-intro">
    <h2>Collections</h2>
  </section>

  <section class="collections-grid">
    <article class="collection-box">
      <img
        src="/images/fieldnotes_home.png"
        alt="Field Notes collection"
        loading="lazy"
      />
      <div class="collection-box-body">
        <a class="btn btn-primary collection-cta" href="/collections/field-notes">
          Shop Field Notes →
        </a>
        <p class="collection-blurb">
          An ongoing study in form and detail. Field Notes blends utility and refinement, drawing
          from observation, process, and the beauty of well-made essentials.
        </p>
      </div>
    </article>

    <article class="collection-box">
      <img
        src="/images/basecamp_home.png"
        alt="Base Camp collection"
        loading="lazy"
      />
      <div class="collection-box-body">
        <a class="btn btn-primary collection-cta" href="/collections/base-camp">
          Shop Base Camp →
        </a>
        <p class="collection-blurb">
          The foundation. Elevated essentials cut clean, built right, and made to be worn daily
          without thinking twice.
        </p>
      </div>
    </article>

    <article class="collection-box">
      <img
        src="/images/conditions_home.png"
        alt="Conditions collection"
        loading="lazy"
      />
      <div class="collection-box-body">
        <a class="btn btn-primary collection-cta" href="/collections/conditions">
          Shop Conditions →
        </a>
        <p class="collection-blurb">
          Built for whatever the day throws at you. Conditions focuses on weight, texture, and
          structure — premium pieces designed to move through shifting environments.
        </p>
      </div>
    </article>

    <article class="collection-box">
      <img
        src="/images/naeba_home.png"
        alt="Naeba collection"
        loading="lazy"
      />
      <div class="collection-box-body">
        <a class="btn btn-primary collection-cta" href="/collections/naeba">
          Shop Naeba →
        </a>
        <p class="collection-blurb">
          Cold air, clean lines, and movement built into every stitch. Naeba is made for long days,
          late lifts, and the quiet confidence of well-made gear.
        </p>
      </div>
    </article>
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

  .collections-intro {
    margin-bottom: var(--space-4);
  }

  .collections-intro h2 {
    margin: 0;
    font-size: 1.4rem;
    letter-spacing: var(--letter-spacing-tight);
  }

  .collections-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-6);
    margin-bottom: var(--space-8);
  }

  .collection-box {
    border-radius: var(--radius-md);
    border: none;
    background-color: transparent;
    overflow: hidden;
    position: relative;
  }

  .collection-box img {
    display: block;
    width: 100%;
    height: 260px;
    object-fit: cover;
  }

  .collection-box-body {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.78),
      rgba(0, 0, 0, 0.35),
      transparent
    );
    color: #ffffff;
    justify-content: flex-end;
  }

  .collection-box-body p {
    margin: 0;
    font-size: 0.95rem;
  }

  .collection-box-body .btn {
    align-self: flex-start;
    margin-top: var(--space-2);
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    padding-left: 0;
    padding-right: 0;
    text-decoration: underline;
    color: #ffffff;
    font-weight: var(--font-weight-bold);
    font-size: 1rem;
  }

  .collection-cta {
    transition:
      transform 160ms ease-out,
      text-decoration-color 160ms ease-out;
  }

  .collection-blurb {
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 160ms ease-out,
      transform 160ms ease-out;
    font-size: 0.9rem;
  }

  .collection-box:hover .collection-box-body {
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.9),
      rgba(0, 0, 0, 0.55),
      transparent
    );
  }

  .collection-box:hover .collection-cta {
    transform: translateY(-1.5rem);
  }

  .collection-box:hover .collection-blurb {
    opacity: 1;
    transform: translateY(0);
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

    .collections-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--space-4);
    }
  }
</style>
