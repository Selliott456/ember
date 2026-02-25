import { env as privateEnv } from '$env/dynamic/private';

export type StorefrontTokenMode = 'public' | 'private';

type ShopifyConfig = {
  storeDomain: string;
  apiVersion: string;
  storefrontToken: string;
  storefrontTokenMode: StorefrontTokenMode;
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
  )
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');

  const apiVersionRaw = required(
    'SHOPIFY_STOREFRONT_API_VERSION',
    privateEnv.SHOPIFY_STOREFRONT_API_VERSION
  ).trim();
  const isValidVersion =
    apiVersionRaw === 'unstable' || /^\d{4}-\d{2}$/.test(apiVersionRaw);
  if (!isValidVersion) {
    throw new Error(
      `SHOPIFY_STOREFRONT_API_VERSION must be "unstable" or a date in YYYY-MM format (e.g. 2026-01). Got: ${JSON.stringify(apiVersionRaw)}`
    );
  }
  const apiVersion = apiVersionRaw;

  const publicToken = privateEnv.SHOPIFY_STOREFRONT_PUBLIC_TOKEN?.trim() || undefined;
  const privateToken = privateEnv.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim() || undefined;
  const hasPublic = Boolean(publicToken);
  const hasPrivate = Boolean(privateToken);

  if (hasPublic === hasPrivate) {
    throw new Error(
      'Exactly one of SHOPIFY_STOREFRONT_PUBLIC_TOKEN or SHOPIFY_STOREFRONT_PRIVATE_TOKEN must be set. ' +
        (hasPublic && hasPrivate
          ? 'Both are set; use only one. For server-side routes we recommend SHOPIFY_STOREFRONT_PRIVATE_TOKEN (unset SHOPIFY_STOREFRONT_PUBLIC_TOKEN).'
          : 'Neither is set. Set SHOPIFY_STOREFRONT_PRIVATE_TOKEN for server-side Storefront API calls (recommended for this app).')
    );
  }

  const storefrontTokenMode: StorefrontTokenMode = hasPrivate ? 'private' : 'public';
  const storefrontToken = required(
    storefrontTokenMode === 'private'
      ? 'SHOPIFY_STOREFRONT_PRIVATE_TOKEN'
      : 'SHOPIFY_STOREFRONT_PUBLIC_TOKEN',
    storefrontTokenMode === 'private' ? privateToken : publicToken
  );

  const cartCookieName =
    privateEnv.SHOPIFY_CART_COOKIE_NAME?.trim() || 'cart_id';

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
    storefrontTokenMode,
    cartCookieName,
    cartCookieMaxAgeSeconds
  });
})();
