## Headless Shopify Storefront (SvelteKit)

Minimal SvelteKit + TypeScript storefront using the Shopify Storefront GraphQL API and Cart API.

### Requirements

- Node.js 18.17+ or 20.5+
- npm (or pnpm / yarn)
- A Shopify store with a Storefront API access token

### Environment variables

Create a `.env` file in the project root (never commit this) with:

```bash
SHOPIFY_STORE_DOMAIN=your-shop-name.myshopify.com
SHOPIFY_STOREFRONT_API_VERSION=2026-01
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_api_access_token

# Optional overrides
SHOPIFY_CART_COOKIE_NAME=cart_id
SHOPIFY_CART_COOKIE_MAX_AGE_DAYS=30
```

The Storefront client sends `X-Shopify-Storefront-Access-Token` and uses the version in the URL: `https://<domain>/api/<SHOPIFY_STOREFRONT_API_VERSION>/graphql.json`.

All Shopify configuration is read server-side from `$env/dynamic/private` in `src/lib/config/shopify.ts`; the Storefront token is **never** exposed to the client.

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
3. Ensure `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_VERSION`, and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` are present in the production environment.
4. Serve over HTTPS in production so the `cart_id` cookie can be marked `Secure`.

Sitemap and robots placeholders live under `static/robots.txt` and `static/sitemap.xml`; update the `Sitemap` URL and hostnames when deploying.
