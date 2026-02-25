/**
 * Strip HTML tags and truncate for meta description. No dependencies.
 */
export function excerpt(htmlOrText: string | undefined | null, maxLength = 160): string {
	if (htmlOrText == null || htmlOrText === '') return '';
	const stripped = htmlOrText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	if (stripped.length <= maxLength) return stripped;
	return stripped.slice(0, maxLength - 1).trimEnd() + '…';
}
