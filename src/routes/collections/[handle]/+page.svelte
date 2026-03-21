<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { excerpt } from "$lib/seo";
  import { formatPrice } from "$lib/formatPrice";
  import HankoCollectionHero from "$lib/components/collections/HankoCollectionHero.svelte";
  import NaebaCollectionHero from "$lib/components/collections/NaebaCollectionHero.svelte";
  import BadbishCollectionHero from "$lib/components/collections/BadbishCollectionHero.svelte";
  import ConditionsCollectionHero from "$lib/components/collections/ConditionsCollectionHero.svelte";
  import FieldNotesCollectionHero from "$lib/components/collections/FieldNotesCollectionHero.svelte";
  import BasecampCollectionHero from "$lib/components/collections/BasecampCollectionHero.svelte";

  let { data }: { data: PageData } = $props();

  const collection = $derived(data.collection);
  const products = $derived(data.products);
  const error = $derived(data.error);
  const isHankoCollection = $derived(collection?.handle === "hanko");
  const isNaebaCollection = $derived(collection?.handle === "naeba");
  const isBadbishCollection = $derived(collection?.handle === "badbish");
  const isConditionsCollection = $derived(collection?.handle === "conditions");
  const isFieldNotesCollection = $derived(collection?.handle === "field-notes");
  const isBasecampCollection = $derived(collection?.handle === "base-camp");
  const metaDescription = $derived(
    collection ? excerpt(collection.description, 160) || collection.title : "",
  );
  const canonical = $derived($page.url.origin + $page.url.pathname);

  const imageIndexById = $state<Record<string, number>>({});

  function getImages(product: any) {
    if (product.images && product.images.length) return product.images;
    if (product.featuredImage) return [product.featuredImage];
    return [];
  }

  function currentImage(product: any) {
    const images = getImages(product);
    if (!images.length) return null;
    const idx = imageIndexById[product.id] ?? 0;
    return images[idx] ?? images[0];
  }

  function cycleImage(event: MouseEvent, product: any) {
    event.preventDefault();
    event.stopPropagation();
    const images = getImages(product);
    if (!images.length) return;
    const current = imageIndexById[product.id] ?? 0;
    imageIndexById[product.id] = (current + 1) % images.length;
  }

  function getColorOptions(product: any): string[] {
    const seen = new Set<string>();
    const colors: string[] = [];
    for (const variant of product.variants ?? []) {
      const title = String(variant.title ?? "").trim();
      if (!title || title.toLowerCase() === "default title") continue;
      const firstOption = title.split("/")[0]?.trim();
      if (!firstOption) continue;
      const key = firstOption.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      colors.push(firstOption);
    }
    return colors.slice(0, 5);
  }

  function swatchColor(name: string): string {
    const key = name.toLowerCase().trim();
    const map: Record<string, string> = {
      black: "#111111",
      charcoal: "#3b3f46",
      grey: "#8b9099",
      gray: "#8b9099",
      white: "#f5f5f5",
      cream: "#eee7db",
      ivory: "#f2ede2",
      navy: "#22324a",
      blue: "#3a6ea5",
      red: "#9f2f2f",
      burgundy: "#5f1f2c",
      green: "#4e6b59",
      olive: "#6b6b4c",
      brown: "#6b4f3a",
      tan: "#b39372",
      khaki: "#a29475",
      beige: "#cabaa0",
      purple: "#6b5f91",
      pink: "#b97787",
      yellow: "#d4b84e",
      gold: "#caa84a",
      orange: "#c47a3c",
    };
    for (const token of Object.keys(map)) {
      if (key.includes(token)) return map[token];
    }
    return "#d1d5db";
  }
</script>

<svelte:head>
  {#if collection}
    <title>{collection.title} | Collections | Storefront</title>
    <meta name="description" content={metaDescription} />
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={collection.title} />
    <meta property="og:description" content={metaDescription} />
    <meta property="og:url" content={canonical} />
    {#if collection.image}
      <meta property="og:image" content={collection.image.url} />
      <meta
        property="og:image:alt"
        content={collection.image.altText ?? collection.title}
      />
    {/if}
  {/if}
</svelte:head>

<main class="page">
  {#if collection}
    {#if isHankoCollection}
      <HankoCollectionHero imageSrc="/images/Hanko-fonts.png" />
      <a class="back" href="/collections">← All collections</a>
    {:else if isNaebaCollection}
      <NaebaCollectionHero imageSrc="/images/naeba_hero.png" />
      <a class="back" href="/collections">← All collections</a>
    {:else if isBadbishCollection}
      <BadbishCollectionHero imageSrc="/images/badbish_group.png" />
      <a class="back" href="/collections">← All collections</a>
    {:else if isConditionsCollection}
      <ConditionsCollectionHero imageSrc="/images/conditions_home.png" />
      <a class="back" href="/collections">← All collections</a>
    {:else if isFieldNotesCollection}
      <FieldNotesCollectionHero imageSrc="/images/fieldnotes_hero.png" />
      <a class="back" href="/collections">← All collections</a>
    {:else if isBasecampCollection}
      <BasecampCollectionHero imageSrc="/images/couple_skatepark.png" />
      <a class="back" href="/collections">← All collections</a>
    {:else}
      <a class="back" href="/collections">← All collections</a>
    {/if}

    <h1>{collection.title}</h1>
    {#if isNaebaCollection}
      <p class="naeba-drop-anchor" id="drop" aria-hidden="true"></p>
    {/if}
    {#if collection.description}
      <p class="description">{collection.description}</p>
    {/if}
  {/if}

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if products.length === 0 && !error}
    <p>No products in this collection.</p>
  {:else if products.length > 0}
    <ul class="product-grid" id="products">
      {#each products as product}
        <li class="product-card">
          <a href="/products/{product.handle}">
            <div
              class="product-image-shell"
              role="button"
              tabindex="0"
              aria-label="Cycle product images"
              onclick={(event) => cycleImage(event, product)}
              onkeydown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  cycleImage(event as unknown as MouseEvent, product);
                }
              }}
            >
              {#if currentImage(product)}
                <img
                  src={currentImage(product).url}
                  alt={currentImage(product).altText ?? product.title}
                  loading="lazy"
                />
              {/if}
              <div class="image-hint image-hint-left">←</div>
              <div class="image-hint image-hint-right">→</div>
            </div>
            {#if getColorOptions(product).length}
              <div class="swatches" aria-label="Available colors">
                {#each getColorOptions(product) as color}
                  <span
                    class="swatch"
                    style={`background-color: ${swatchColor(color)}`}
                    title={color}
                    aria-label={color}
                  ></span>
                {/each}
              </div>
            {/if}
            <h2>{product.title}</h2>
            <p class="price">
              {formatPrice(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode,
              )}
            </p>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<style>
  .page {
    max-width: 960px;
    margin: 0 auto;
    padding: 0.75rem 1rem 3rem;
  }

  .back {
    display: inline-block;
    margin-bottom: 1rem;
    text-decoration: none;
    color: #444;
  }

  h1 {
    margin-bottom: 0.5rem;
  }

  .description {
    margin-bottom: 1.5rem;
    color: #555;
  }

  .naeba-drop-anchor {
    margin: 0;
    height: 0;
  }

  .product-grid {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
    padding: 0;
    margin: 1.25rem 0 0;
  }

  .product-card {
    border: 1px solid #e2e2e2;
    border-radius: 0.5rem;
    overflow: hidden;
    background: white;
  }

  .product-card a {
    display: block;
    color: inherit;
    text-decoration: none;
    padding: 0.75rem;
  }

  .product-image-shell {
    position: relative;
    width: 100%;
    height: 200px;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
  }

  .product-image-shell img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .image-hint {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 1.6rem;
    height: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.6);
    color: #f9fafb;
    font-size: 0.7rem;
    opacity: 0;
    transition: opacity 120ms ease-out;
  }

  .image-hint-left {
    left: 0.4rem;
  }

  .image-hint-right {
    right: 0.4rem;
  }

  .product-image-shell:hover .image-hint {
    opacity: 1;
  }

  .product-card h2 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .price {
    font-weight: 600;
  }

  .swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 0.32rem;
    margin: 0.2rem 0 0.45rem;
  }

  .swatch {
    width: 0.62rem;
    height: 0.62rem;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .error {
    color: #b00020;
  }

</style>
