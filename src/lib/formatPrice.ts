/**
 * Format a price for display: currency symbol and two decimal places
 * (e.g. "$19.99" for USD).
 */
export function formatPrice(amount: string, currencyCode: string): string {
	const value = Number(amount);
	if (Number.isNaN(value)) return amount;
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currencyCode,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value);
}
