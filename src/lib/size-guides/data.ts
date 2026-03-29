export type SizeGuideKey = 'hoodie' | 'tee' | 'cropped_tee' | 'jeans_trousers';

export type SizeGuideTableSection = {
	title: string;
	columns: string[];
	rows: string[][];
};

export type SizeGuide = {
	key: SizeGuideKey;
	title: string;
	fitNote: string;
	toleranceNote: string;
	columns: string[];
	rows: string[][];
	/** When non-empty, these replace the single `columns` / `rows` table. */
	tableSections?: SizeGuideTableSection[];
	measurementHelp: string[];
	finalNote?: string;
	/** Optional list shown after “How to Measure” (same styling as measurement help). */
	fitNotes?: string[];
};

export const SIZE_GUIDES: Record<SizeGuideKey, SizeGuide> = {
	hoodie: {
		key: 'hoodie',
		title: 'Hoodies',
		fitNote:
			'Most Ember hoodies are designed with a relaxed, slightly oversized fit. If you prefer a closer fit, consider sizing down.',
		toleranceNote: 'All measurements are taken flat and may vary by +-1-3 cm.',
		columns: ['Size', 'Length', 'Shoulder', 'Chest', 'Sleeve'],
		rows: [
			['S', '70 cm', '64 cm', '65 cm', '53 cm'],
			['M', '72 cm', '66 cm', '67 cm', '54 cm'],
			['L', '74 cm', '68 cm', '69 cm', '55 cm'],
			['XL', '76 cm', '70 cm', '71 cm', '56 cm'],
			['2XL', '78 cm', '72 cm', '73 cm', '57 cm']
		],
		measurementHelp: [
			'Length - from shoulder seam to hem',
			'Shoulder - seam to seam across the back',
			'Chest - pit to pit (flat measurement)',
			'Sleeve - shoulder seam to cuff'
		],
		finalNote: 'Measurements are taken flat, not circumference.'
	},
	tee: {
		key: 'tee',
		title: 'T-Shirts',
		fitNote:
			'Most Ember tees are designed with a relaxed, slightly oversized fit. If you prefer a more fitted look, consider sizing down.',
		toleranceNote: 'All measurements are taken flat and may vary by +-1-3 cm.',
		columns: ['Size', 'Length', 'Shoulder', 'Chest', 'Sleeve'],
		rows: [
			['S', '67 cm', '50 cm', '53 cm', '18 cm'],
			['M', '69 cm', '52 cm', '55 cm', '19 cm'],
			['L', '71 cm', '54 cm', '57 cm', '20 cm'],
			['XL', '73 cm', '56 cm', '59 cm', '21 cm'],
			['2XL', '75 cm', '58 cm', '61 cm', '22 cm']
		],
		measurementHelp: [
			'Length - from shoulder seam to hem',
			'Shoulder - seam to seam across the back',
			'Chest - pit to pit (flat measurement)',
			'Sleeve - shoulder seam to cuff'
		],
		finalNote: 'Measurements are taken flat, not circumference.'
	},
	cropped_tee: {
		key: 'cropped_tee',
		title: 'Cropped T-Shirts',
		fitNote:
			'Ember cropped tees are cut shorter with a fitted, boxy shape. Check measurements carefully before ordering.',
		toleranceNote: 'All measurements are taken flat and may vary by +-1-3 cm.',
		columns: ['Size', 'Length', 'Shoulder', 'Chest', 'Sleeve'],
		rows: [
			['XS', '37 cm', '34 cm', '35 cm', '14.5 cm'],
			['S', '38 cm', '35 cm', '37 cm', '15 cm'],
			['M', '40 cm', '36 cm', '40 cm', '15.5 cm'],
			['L', '42 cm', '38 cm', '43 cm', '16 cm'],
			['XL', '44 cm', '39 cm', '46 cm', '16.5 cm'],
			['2XL', '46 cm', '40 cm', '49 cm', '17 cm']
		],
		measurementHelp: [
			'Length - from shoulder seam to hem',
			'Shoulder - seam to seam across the back',
			'Chest - pit to pit (flat measurement)',
			'Sleeve - shoulder seam to cuff'
		],
		finalNote: 'Measurements are taken flat, not circumference.'
	},
	jeans_trousers: {
		key: 'jeans_trousers',
		title: 'Jeans & Trousers Size Chart',
		fitNote:
			'Body measurements in cm / in. Use the table that matches how the piece is labeled (men’s / unisex vs women’s).',
		toleranceNote: 'Ranges are body measurements; finished garment may vary slightly by style.',
		columns: [],
		rows: [],
		tableSections: [
			{
				title: 'Men’s / Unisex Bottoms',
				columns: ['Size', 'Waist', 'Hip', 'Length'],
				rows: [
					['S', '72–78 cm / 28–30 in', '88–94 cm / 34.5–37 in', '100 cm / 39.4 in'],
					['M', '78–84 cm / 30–33 in', '94–100 cm / 37–39.5 in', '102 cm / 40.2 in'],
					['L', '84–90 cm / 33–35 in', '100–106 cm / 39.5–41.7 in', '104 cm / 41.0 in'],
					['XL', '90–96 cm / 35–38 in', '106–112 cm / 41.7–44 in', '106 cm / 41.7 in'],
					['2XL', '96–102 cm / 38–40 in', '112–118 cm / 44–46.5 in', '108 cm / 42.5 in']
				]
			},
			{
				title: 'Women’s Bottoms',
				columns: ['Size', 'Waist', 'Hip', 'Length'],
				rows: [
					['XS', '60–66 cm / 24–26 in', '84–90 cm / 33–35.5 in', '96 cm / 37.8 in'],
					['S', '66–72 cm / 26–28 in', '90–96 cm / 35.5–37.8 in', '98 cm / 38.6 in'],
					['M', '72–78 cm / 28–30 in', '96–102 cm / 37.8–40.2 in', '100 cm / 39.4 in'],
					['L', '78–84 cm / 30–33 in', '102–108 cm / 40.2–42.5 in', '102 cm / 40.2 in'],
					['XL', '84–90 cm / 33–35 in', '108–114 cm / 42.5–44.9 in', '104 cm / 41.0 in']
				]
			}
		],
		measurementHelp: [
			'Waist: Measure around your natural waistline',
			'Hips: Measure around the fullest part of your hips',
			'Length: Measure from waistband to ankle hem'
		],
		fitNotes: [
			'Relaxed / loose fit depending on style',
			'Mid to high rise depending on piece',
			'Slight variations may occur due to fabric, wash, and production batches',
			'If between sizes, size up for a looser fit'
		]
	}
};
