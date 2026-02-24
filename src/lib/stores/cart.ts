import { writable } from 'svelte/store';

export type Money = {
	amount: string;
	currencyCode: string;
};

export type CartLine = {
	id: string;
	quantity: number;
	cost: {
		subtotalAmount: Money;
	};
	merchandise: {
		id: string;
		title: string;
		product: {
			id: string;
			handle: string;
			title: string;
		};
		price: Money;
	};
};

export type Cart = {
	id: string;
	checkoutUrl: string;
	totalQuantity: number;
	cost: {
		subtotalAmount: Money;
		totalAmount: Money;
	};
	lines: CartLine[];
};

type CartState = {
	cart: Cart | null;
	loading: boolean;
	error: string | null;
};

const initialState: CartState = {
	cart: null,
	loading: false,
	error: null
};

function createCartStore() {
	const { subscribe, update, set } = writable<CartState>(initialState);

	async function loadCart() {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const res = await fetch('/api/cart');
			const data = await res.json();

			if (!data.ok) {
				set({ cart: null, loading: false, error: data.error ?? 'Failed to load cart' });
				return;
			}

			set({ cart: data.cart, loading: false, error: null });
		} catch (e) {
			set({
				cart: null,
				loading: false,
				error: e instanceof Error ? e.message : 'Failed to load cart'
			});
		}
	}

	async function addToCart(merchandiseId: string, quantity: number) {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const res = await fetch('/api/cart/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ merchandiseId, quantity })
			});

			const data = await res.json();

			if (!data.ok) {
				update((state) => ({ ...state, loading: false, error: data.error ?? 'Add failed' }));
				return;
			}

			set({ cart: data.cart, loading: false, error: null });
		} catch (e) {
			update((state) => ({
				...state,
				loading: false,
				error: e instanceof Error ? e.message : 'Add failed'
			}));
		}
	}

	async function updateLine(lineId: string, quantity: number) {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const res = await fetch('/api/cart/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lineId, quantity })
			});

			const data = await res.json();

			if (!data.ok) {
				update((state) => ({
					...state,
					loading: false,
					error: data.error ?? 'Update failed'
				}));
				return;
			}

			set({ cart: data.cart, loading: false, error: null });
		} catch (e) {
			update((state) => ({
				...state,
				loading: false,
				error: e instanceof Error ? e.message : 'Update failed'
			}));
		}
	}

	async function removeLine(lineId: string) {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const res = await fetch('/api/cart/remove', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lineId })
			});

			const data = await res.json();

			if (!data.ok) {
				update((state) => ({
					...state,
					loading: false,
					error: data.error ?? 'Remove failed'
				}));
				return;
			}

			set({ cart: data.cart, loading: false, error: null });
		} catch (e) {
			update((state) => ({
				...state,
				loading: false,
				error: e instanceof Error ? e.message : 'Remove failed'
			}));
		}
	}

	async function clearCart() {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const res = await fetch('/api/cart/clear', {
				method: 'POST'
			});

			const data = await res.json();

			if (!data.ok) {
				update((state) => ({
					...state,
					loading: false,
					error: data.error ?? 'Clear failed'
				}));
				return;
			}

			set({ cart: data.cart, loading: false, error: null });
		} catch (e) {
			update((state) => ({
				...state,
				loading: false,
				error: e instanceof Error ? e.message : 'Clear failed'
			}));
		}
	}

	return {
		subscribe,
		loadCart,
		addToCart,
		updateLine,
		removeLine,
		clearCart
	};
}

export const cart = createCartStore();

