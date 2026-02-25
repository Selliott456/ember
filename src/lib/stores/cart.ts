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

/** Accept API error as { code, message } or legacy string. */
function errorMessage(err: unknown): string {
	if (err && typeof err === 'object' && 'message' in err) {
		const m = (err as { message: unknown }).message;
		if (typeof m === 'string') return m;
	}
	return typeof err === 'string' ? err : 'Request failed';
}

/** True if API error indicates cart was not found (stale); client should clear cart state. */
function isCartNotFoundError(data: { ok: false; error?: { code?: string } }): boolean {
	return data.error?.code === 'CART_NOT_FOUND';
}

function createCartStore() {
	const { subscribe, update, set } = writable<CartState>(initialState);

	async function loadCart() {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const res = await fetch('/api/cart');
			const data = await res.json();

			if (!data.ok) {
				set({ cart: null, loading: false, error: errorMessage(data.error) });
				return;
			}

			set({ cart: data.cart ?? null, loading: false, error: null });
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
				update((state) => ({
					...state,
					loading: false,
					error: errorMessage(data.error),
					...(isCartNotFoundError(data) && { cart: null })
				}));
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
					error: errorMessage(data.error),
					...(isCartNotFoundError(data) && { cart: null })
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
					error: errorMessage(data.error),
					...(isCartNotFoundError(data) && { cart: null })
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
					error: errorMessage(data.error)
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

