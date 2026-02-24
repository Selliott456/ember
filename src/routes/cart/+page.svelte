<script lang="ts">
	import { cart } from '$lib/stores/cart';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';

	// Load cart state on mount; do not create a cart until an add happens.
	onMount(() => {
		cart.loadCart();
	});

	const state = cart;

	const subtotal = derived(state, ($state) => $state.cart?.cost.subtotalAmount ?? null);

	async function handleQuantityChange(lineId: string, quantity: number) {
		if (!Number.isInteger(quantity) || quantity <= 0) return;
		await cart.updateLine(lineId, quantity);
	}

	async function handleRemove(lineId: string) {
		await cart.removeLine(lineId);
	}

	async function handleClear() {
		await cart.clearCart();
	}
</script>

<main class="page">
	<h1>Cart</h1>

	<a class="back" href="/">← Continue shopping</a>

	{#if $state.loading && !$state.cart}
		<p>Loading cart…</p>
	{/if}

	{#if $state.error}
		<p class="error">{$state.error}</p>
	{/if}

	{#if $state.cart && $state.cart.lines.length > 0}
		<table class="cart-table">
			<thead>
				<tr>
					<th>Item</th>
					<th>Price</th>
					<th>Quantity</th>
					<th>Subtotal</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each $state.cart.lines as line}
					<tr>
						<td>
							<div class="item">
								<div class="item-title">{line.merchandise.product.title}</div>
								<div class="item-variant">{line.merchandise.title}</div>
							</div>
						</td>
						<td>
							{line.merchandise.price.amount}
							{' '}
							{line.merchandise.price.currencyCode}
						</td>
						<td>
							<input
								type="number"
								min="1"
								step="1"
								value={line.quantity}
								on:change={(event) =>
									handleQuantityChange(line.id, Number((event.currentTarget as HTMLInputElement).value))}
							/>
						</td>
						<td>
							{line.cost.subtotalAmount.amount}
							{' '}
							{line.cost.subtotalAmount.currencyCode}
						</td>
						<td>
							<button type="button" on:click={() => handleRemove(line.id)}>Remove</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="summary">
			{#if $subtotal}
				<p class="subtotal">
					Subtotal:
					<strong>
						{$subtotal.amount}
						{' '}
						{$subtotal.currencyCode}
					</strong>
				</p>
			{/if}

			<div class="actions">
				<button type="button" on:click={handleClear}>Clear cart</button>
				{#if $state.cart.checkoutUrl}
					<a class="checkout" href={$state.cart.checkoutUrl}>Checkout</a>
				{/if}
			</div>
		</div>
	{:else}
		<p>Your cart is empty.</p>
	{/if}
</main>

<style>
	.page {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1rem 3rem;
	}

	h1 {
		margin-bottom: 1rem;
	}

	.back {
		display: inline-block;
		margin-bottom: 1.5rem;
		text-decoration: none;
		color: #444;
	}

	.cart-table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
	}

	th,
	td {
		border-bottom: 1px solid #e2e2e2;
		padding: 0.5rem 0.25rem;
		text-align: left;
	}

	.item-title {
		font-weight: 600;
	}

	.item-variant {
		font-size: 0.85rem;
		color: #555;
	}

	input[type='number'] {
		width: 4rem;
		padding: 0.25rem 0.3rem;
	}

	button {
		padding: 0.4rem 0.7rem;
		border-radius: 0.25rem;
		border: 1px solid #ccc;
		background: #f9fafb;
		cursor: pointer;
	}

	.summary {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.subtotal {
		font-size: 1rem;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.checkout {
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		background: #111827;
		color: white;
		text-decoration: none;
	}

	.error {
		color: #b00020;
		margin-bottom: 1rem;
	}

	@media (max-width: 640px) {
		.cart-table thead {
			display: none;
		}

		.cart-table,
		.cart-table tbody,
		.cart-table tr,
		.cart-table td {
			display: block;
			width: 100%;
		}

		.cart-table tr {
			margin-bottom: 1rem;
		}

		td {
			border: none;
		}
	}
</style>

