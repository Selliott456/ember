import { shopifyConfig } from '$lib/config/shopify';

const SHOPIFY_GRAPHQL_ENDPOINT = `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;

export type ShopifyGraphQLError = {
  message: string;
  extensions?: Record<string, unknown>;
};

export type ShopifyGraphQLResponse<Data> = {
  ok: boolean;
  status: number;
  data?: Data;
  errors?: ShopifyGraphQLError[];
  headers: Headers;
};

export type ShopifyGraphQLRequest<Variables> = {
  query: string;
  variables?: Variables;
  headers?: HeadersInit;
};

export async function shopifyGraphQL<Data, Variables = Record<string, unknown>>(
  params: ShopifyGraphQLRequest<Variables>
): Promise<ShopifyGraphQLResponse<Data>> {
  const { query, variables, headers: extraHeaders } = params;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontToken,
    ...extraHeaders
  };

  const res = await fetch(SHOPIFY_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables: variables ?? undefined
    })
  });

  const responseHeaders = new Headers(res.headers);
  let json: unknown;

  try {
    json = await res.json();
  } catch {
    return {
      ok: false,
      status: res.status,
      data: undefined,
      errors: [
        {
          message: 'Failed to parse Shopify response as JSON'
        }
      ],
      headers: responseHeaders
    };
  }

  const { data, errors } = (json ?? {}) as {
    data?: Data;
    errors?: ShopifyGraphQLError[];
  };

  const ok = res.ok && !errors?.length;

  return {
    ok,
    status: res.status,
    data,
    errors,
    headers: responseHeaders
  };
}

export function shopifyQuery<Data, Variables = Record<string, unknown>>(
  params: ShopifyGraphQLRequest<Variables>
) {
  return shopifyGraphQL<Data, Variables>(params);
}

export function shopifyMutation<Data, Variables = Record<string, unknown>>(
  params: ShopifyGraphQLRequest<Variables>
) {
  return shopifyGraphQL<Data, Variables>(params);
}

