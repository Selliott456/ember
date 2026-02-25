## Headless Shopify Storefront (SvelteKit)

Minimal SvelteKit + TypeScript storefront using the Shopify Storefront GraphQL API and Cart API.

### Requirements

- Node.js 18.17+ or 20.5+
- npm (or pnpm / yarn)
- A Shopify store with a Storefront API token (set exactly one: **SHOPIFY_STOREFRONT_PUBLIC_TOKEN** or **SHOPIFY_STOREFRONT_PRIVATE_TOKEN**)

### Environment variables

Create a `.env` file in the project root (never commit this) with:

```bash
SHOPIFY_STORE_DOMAIN=your-shop-name.myshopify.com
SHOPIFY_STOREFRONT_API_VERSION=2026-01
# Exactly one of the two (public or private token):
# SHOPIFY_STOREFRONT_PUBLIC_TOKEN=your_public_token   # header: X-Shopify-Storefront-Access-Token
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=your_private_token  # header: Shopify-Storefront-Private-Token

# Optional overrides
SHOPIFY_CART_COOKIE_NAME=cart_id
SHOPIFY_CART_COOKIE_MAX_AGE_DAYS=30
```

Exactly one of `SHOPIFY_STOREFRONT_PUBLIC_TOKEN` or `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` must be set; the app asserts this at startup. The client sends that token in the matching header (`X-Shopify-Storefront-Access-Token` for public, `Shopify-Storefront-Private-Token` for private) and uses the version in the URL: `https://<domain>/api/<SHOPIFY_STOREFRONT_API_VERSION>/graphql.json`.

All Shopify configuration is read server-side from `$env/dynamic/private` in `src/lib/server/config/shopify.ts`; the Storefront token is **never** exposed to the client (anything under `src/lib/server/` is server-only).

### Running locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`:

- `/` – featured products (SSR)
- `/products/[handle]` – product detail page with variant selector and “Add to cart”
- `/cart` – cart lines, quantity updates, remove, and checkout link

Cart state is backed by Shopify’s Cart API and persisted via an HttpOnly `cart_id` cookie.

### Shopify integration overview

- GraphQL client: `src/lib/server/shopify/client.ts`
- Queries and mutations: `src/lib/server/shopify/queries.ts`
- Types: `src/lib/server/shopify/types.ts`
- High-level API (products + cart): `src/lib/server/shopify/index.ts`
- Cart cookie helpers: `src/lib/server/cartCookie.ts`
- Cart API routes: `src/routes/api/cart/*`

All Shopify calls are made server-side only (under `src/lib/server` and `src/routes/api`).

### Deployment notes

1. Choose and configure a SvelteKit adapter (e.g. `@sveltejs/adapter-auto` for Node / serverless).
2. Set the same environment variables on your hosting platform as in `.env`.
3. Ensure `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_VERSION`, and exactly one of `SHOPIFY_STOREFRONT_PUBLIC_TOKEN` / `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` are set in the production environment.
4. Serve over HTTPS in production so the `cart_id` cookie can be marked `Secure`.

Sitemap and robots placeholders live under `static/robots.txt` and `static/sitemap.xml`; update the `Sitemap` URL and hostnames when deploying.

### Sanity test checklist (manual)

Run through these after changes or before release:

- [ ] **Home** – `/` loads; product grid shows; each product links to `/products/[handle]`.
- [ ] **Product** – Open a product; variant selector works; quantity ≥ 1; “Add to cart” disabled when sold out; add to cart shows success message.
- [ ] **Cart** – `/cart` shows lines; change quantity (including 0 = remove); remove line; clear cart; checkout link goes to Shopify when cart has items.
- [ ] **Collections** – `/collections` lists collections; `/collections/[handle]` shows collection products; product links work.
- [ ] **SEO** – Home, product, collection, and cart have `<title>` and meta description; canonical and OG tags present (inspect with “View Page Source” or devtools).
- [ ] **Stale cart** – Clear the `cart_id` cookie (or use an invalid value), then open `/cart` or add to cart; app should recover (empty cart or new cart created) without a hard error.

### Automated tests

- **Unit (Vitest)** – Cart cookie parsing and stale-cart detection:
  ```bash
  npm run test
  ```
- **Smoke (Playwright, optional)** – Add to cart → cart page → checkout link present (no purchase):
  ```bash
  npm run build && npm run preview
  # In another terminal, with .env set:
  npx playwright install --with-deps
  npm run test:e2e
  ```
