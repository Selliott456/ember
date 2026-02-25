import { env as privateEnv } from '$env/dynamic/private';

type ShopifyConfig = {
  storeDomain: string;
  apiVersion: string;
  storefrontToken: string;
  cartCookieName: string;
  cartCookieMaxAgeSeconds: number;
};

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const DAYS_TO_SECONDS = 24 * 60 * 60;

export const shopifyConfig: ShopifyConfig = (() => {
  const storeDomain = required(
    'SHOPIFY_STORE_DOMAIN',
    privateEnv.SHOPIFY_STORE_DOMAIN
  ).replace(/^https?:\/\//, '');

  const apiVersion = required(
    'SHOPIFY_STOREFRONT_API_VERSION',
    privateEnv.SHOPIFY_STOREFRONT_API_VERSION
  );

  // Storefront API access token (header: X-Shopify-Storefront-Access-Token). Accept multiple env names for compatibility.
  const storefrontToken = required(
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN (or SHOPIFY_STOREFRONT_PRIVATE_TOKEN / SHOPIFY_STOREFRONT_API_TOKEN)',
    privateEnv.SHOPIFY_STOREFRONT_ACCESS_TOKEN ??
      privateEnv.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ??
      privateEnv.SHOPIFY_STOREFRONT_API_TOKEN
  );

  const cartCookieName =
    privateEnv.SHOPIFY_CART_COOKIE_NAME?.trim() || 'cartId';

  const cartCookieMaxAgeDays = Number(
    privateEnv.SHOPIFY_CART_COOKIE_MAX_AGE_DAYS ?? '30'
  );
  const cartCookieMaxAgeSeconds =
    Number.isFinite(cartCookieMaxAgeDays) && cartCookieMaxAgeDays > 0
      ? Math.round(cartCookieMaxAgeDays * DAYS_TO_SECONDS)
      : 30 * DAYS_TO_SECONDS;

  return Object.freeze({
    storeDomain,
    apiVersion,
    storefrontToken,
    cartCookieName,
    cartCookieMaxAgeSeconds
  });
})();

