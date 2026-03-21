export type SizeGuideKey = 'hoodie' | 'tee' | 'cropped_tee';

export type SizeGuide = {
	key: SizeGuideKey;
	title: string;
	fitNote: string;
	toleranceNote: string;
	columns: string[];
	rows: string[][];
	measurementHelp: string[];
	finalNote?: string;
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
	}
};
