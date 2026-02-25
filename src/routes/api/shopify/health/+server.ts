import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { shopifyQuery } from '$lib/server/shopify/client';
import { SHOP_HEALTH_QUERY } from '$lib/server/shopify/queries';
import { ShopifyGraphQLClientError } from '$lib/server/shopify/client';

type ShopHealthResponse = { shop: { name: string } };

export const GET: RequestHandler = async () => {
	if (env.SHOPIFY_DEBUG_ENDPOINT !== 'true') {
		return json(
			{ ok: false, error: { code: 'DISABLED', message: 'Debug endpoint is disabled. Set SHOPIFY_DEBUG_ENDPOINT=true to enable.' } },
			{ status: 404 }
		);
	}

	try {
		const res = await shopifyQuery<ShopHealthResponse>({
			query: SHOP_HEALTH_QUERY,
			operationName: 'ShopHealth'
		});

		if (!res.ok || !res.data?.shop) {
			return json(
				{ ok: false, error: { code: 'SHOPIFY_ERROR', message: 'Storefront API returned no shop data' } },
				{ status: 502 }
			);
		}

		return json({ ok: true });
	} catch (e) {
		if (e instanceof ShopifyGraphQLClientError) {
			return json(
				{
					ok: false,
					error: {
						code: 'SHOPIFY_ERROR',
						message: e.message,
						...(e.requestId && { requestId: e.requestId })
					}
				},
				{ status: e.status >= 400 && e.status < 500 ? e.status : 502 }
			);
		}
		const message = e instanceof Error ? e.message : 'Storefront health check failed';
		return json(
			{ ok: false, error: { code: 'SHOPIFY_ERROR', message } },
			{ status: 502 }
		);
	}
};
