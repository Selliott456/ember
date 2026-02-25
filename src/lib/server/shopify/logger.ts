/**
 * Minimal server-only logger for Shopify operations.
 * Prefixes with [shopify] and includes requestId + operation for tracing.
 */
const PREFIX = '[shopify]';

export function logShopify(
  level: 'info' | 'warn' | 'error',
  requestId: string,
  operation: string,
  message: string,
  meta?: Record<string, unknown>
) {
  const payload = { requestId, operation, message, ...meta };
  const line = `${PREFIX} ${JSON.stringify(payload)}`;
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.info(line);
  }
}
