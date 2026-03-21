<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { formatPrice } from "$lib/formatPrice";

  let { data }: { data: PageData } = $props();

  const products = $derived(data.products);
  const error = $derived(data.error);
  const canonical = $derived($page.url.origin + $page.url.pathname);

  const genderFilter = $derived(
    $page.url.searchParams.get("gender")?.toLowerCase() ?? null,
  );
  const collectionFilter = $derived(
    $page.url.searchParams.get("collection")?.toLowerCase() ?? null,
  );
  const typeFilter = $derived(
    $page.url.searchParams.get("type")?.toLowerCase() ?? null,
  );
  const COLLECTION_TAG_MAP: Record<string, string[]> = {
    hanko: ["hanko"],
    badbish: ["badbish", "bad-bish", "bad bish"],
    "field-notes": ["fieldnotes", "field-notes", "field notes"],
    "base-camp": ["basecamp", "base-camp", "base camp", "everyday"],
    conditions: ["conditions"],
    naeba: ["naeba"],
  };

  const TYPE_TAG_MAP: Record<string, string[]> = {
    tee: ["tee", "tees", "t-shirt", "t-shirts"],
    "long-sleeve": [
      "long-sleeve",
      "long sleeves",
      "long-sleeves",
      "long sleeve",
    ],
    hoodie: ["hoodie", "hoodies", "hooded"],
    sweater: [
      "sweater",
      "sweaters",
      "knit",
      "knitwear",
      "crewneck",
      "sweatshirt",
      "jumper",
    ],
    pants: ["pants", "trousers", "joggers", "jogger", "shorts"],
    bottoms: [
      "pants",
      "trousers",
      "joggers",
      "jogger",
      "shorts",
      "bottom",
      "bottoms",
    ],
    jeans: ["jeans", "denim"],
  };

  const FILTER_LABELS: Record<string, string> = {
    tee: "Tees",
    "long-sleeve": "Long Sleeves",
    hoodie: "Hoodies",
    sweater: "Sweaters",
    pants: "Pants",
    bottoms: "Bottoms",
    jeans: "Jeans",
    hanko: "Hanko",
    badbish: "Badbish",
    "field-notes": "Field Notes",
    "base-camp": "Basecamp",
    conditions: "Conditions",
    naeba: "Naeba",
  };

  const heading = $derived.by(() => {
    if (typeFilter) return FILTER_LABELS[typeFilter] ?? "Filtered Products";
    if (collectionFilter)
      return FILTER_LABELS[collectionFilter] ?? "Filtered Products";
    if (genderFilter) return FILTER_LABELS[genderFilter] ?? "Filtered Products";
    return "All products";
  });
  const pageTitle = $derived(`${heading} | Storefront`);
  const pageDescription = $derived(`Browse ${heading.toLowerCase()}.`);

  function tagMatchesAny(tag: string, allowed: string[]) {
    const normalizedTag = tag.toLowerCase().trim();
    return allowed.some((candidate) => {
      const normalizedCandidate = candidate.toLowerCase().trim();
      return (
        normalizedTag === normalizedCandidate ||
        normalizedTag.includes(normalizedCandidate) ||
        normalizedCandidate.includes(normalizedTag)
      );
    });
  }

  function toTokens(value: string): string[] {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function containsTerm(value: string, term: string): boolean {
    const valueTokens = toTokens(value);
    const termTokens = toTokens(term);
    if (!termTokens.length) return false;
    if (termTokens.length === 1) return valueTokens.includes(termTokens[0]);
    return valueTokens.join(" ").includes(termTokens.join(" "));
  }

  function matchesFilter(product: any) {
    const tags = (product.tags ?? []).map((t: string) => t.toLowerCase());
    const title = String(product.title ?? "").toLowerCase();
    const productType = String(product.productType ?? "").toLowerCase();
    const handle = String(product.handle ?? "").toLowerCase();
    const searchable = [title, productType, handle, ...tags].join(" ");
    if (genderFilter) {
      if (!tags.includes(genderFilter)) return false;
    }
    if (collectionFilter) {
      const allowedCollections = COLLECTION_TAG_MAP[collectionFilter] ?? [
        collectionFilter,
      ];
      if (!tags.some((tag: string) => tagMatchesAny(tag, allowedCollections)))
        return false;
    }
    if (typeFilter) {
      const allowed = TYPE_TAG_MAP[typeFilter] ?? [typeFilter];
      const inTags = tags.some((tag: string) => tagMatchesAny(tag, allowed));
      const inTitleOrType = allowed.some((candidate) => {
        return containsTerm(searchable, candidate);
      });
      if (!inTags && !inTitleOrType) return false;
    }
    return true;
  }

  const filteredProducts = $derived(products.filter((p) => matchesFilter(p)));

  // Track which gallery image is active per product ID
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
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:url" content={canonical} />
</svelte:head>

<main class="page">
  <h1>{heading}</h1>
  <a class="back" href="/">← Back to home</a>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if filteredProducts.length === 0 && !error}
    <p>No products found.</p>
  {:else}
    <ul class="product-grid">
      {#each filteredProducts as product}
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
    padding: 2rem 1rem 3rem;
  }

  .back {
    display: inline-block;
    margin-bottom: 1.5rem;
    text-decoration: none;
    color: #444;
  }

  .product-grid {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
    padding: 0;
    margin: 0;
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
