import { shopifyConfig } from '$lib/config/shopify';
import { logShopify } from './logger';

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
  /** Optional operation name for logging (e.g. "getProducts", "cartCreate"). */
  operationName?: string;
};

/** Thrown when the Storefront API returns HTTP or GraphQL errors. */
export class ShopifyGraphQLClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: ShopifyGraphQLError[],
    public readonly requestId: string,
    public readonly operationName?: string,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'ShopifyGraphQLClientError';
  }
}

function generateRequestId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : `req-${Date.now().toString(36)}`;
}

export async function shopifyGraphQL<Data, Variables = Record<string, unknown>>(
  params: ShopifyGraphQLRequest<Variables>
): Promise<ShopifyGraphQLResponse<Data>> {
  const { query, variables, headers: extraHeaders, operationName = 'graphql' } = params;
  const requestId = generateRequestId();

  logShopify('info', requestId, operationName, 'request start');

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

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    logShopify('error', requestId, operationName, 'Failed to parse response as JSON', {
      status: res.status
    });
    throw new ShopifyGraphQLClientError(
      'Failed to parse Shopify response as JSON',
      res.status,
      [{ message: 'Failed to parse Shopify response as JSON' }],
      requestId,
      operationName
    );
  }

  const { data, errors } = (json ?? {}) as {
    data?: Data;
    errors?: ShopifyGraphQLError[];
  };

  if (!res.ok) {
    const message =
      errors?.map((e) => e.message).join('; ') ||
      `Shopify API returned ${res.status}`;
    logShopify('error', requestId, operationName, message, {
      status: res.status,
      errors: errors ?? []
    });
    throw new ShopifyGraphQLClientError(
      message,
      res.status,
      errors ?? [{ message }],
      requestId,
      operationName,
      data
    );
  }

  if (errors?.length) {
    const message = errors.map((e) => e.message).join('; ');
    logShopify('error', requestId, operationName, message, { errors });
    throw new ShopifyGraphQLClientError(
      message,
      res.status,
      errors,
      requestId,
      operationName,
      data
    );
  }

  logShopify('info', requestId, operationName, 'request ok');
  return {
    ok: true,
    status: res.status,
    data,
    errors: undefined,
    headers: new Headers(res.headers)
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

