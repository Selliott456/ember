<script lang="ts">
	import { tick } from 'svelte';
	import SizeGuideTable from '$lib/components/size-guide/SizeGuideTable.svelte';
	import type { SizeGuide } from '$lib/size-guides/data';

	let {
		open = false,
		guide,
		onClose = () => {},
		labelledBy = 'size-guide-title'
	}: {
		open?: boolean;
		guide: SizeGuide;
		onClose?: () => void;
		labelledBy?: string;
	} = $props();

	let panelEl = $state<HTMLElement | null>(null);
	let closeBtnEl = $state<HTMLButtonElement | null>(null);
	let lastFocusedEl: HTMLElement | null = null;

	function getFocusable(container: HTMLElement) {
		return Array.from(
			container.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
			)
		).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			onClose();
			return;
		}
		if (event.key !== 'Tab' || !panelEl) return;

		const focusable = getFocusable(panelEl);
		if (!focusable.length) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement as HTMLElement | null;

		if (event.shiftKey && active === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	}

	$effect(() => {
		if (!open) {
			document.body.style.overflow = '';
			if (lastFocusedEl) lastFocusedEl.focus();
			return;
		}

		lastFocusedEl = document.activeElement as HTMLElement;
		document.body.style.overflow = 'hidden';
		tick().then(() => closeBtnEl?.focus());

		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if open}
	<div class="backdrop" onclick={onClose} aria-hidden="true"></div>
	<div class="modal-wrap" role="presentation" onkeydown={handleKeydown}>
		<div
			class="panel"
			role="dialog"
			aria-modal="true"
			aria-labelledby={labelledBy}
			bind:this={panelEl}
		>
			<header class="panel-header">
				<h2 id={labelledBy}>Size Guide</h2>
				<button
					type="button"
					class="close-btn"
					aria-label="Close size guide"
					onclick={onClose}
					bind:this={closeBtnEl}
				>
					×
				</button>
			</header>

			<SizeGuideTable {guide} />
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(2, 5, 9, 0.7);
		z-index: 40;
	}

	.modal-wrap {
		position: fixed;
		inset: 0;
		padding: 1.25rem;
		display: grid;
		place-items: center;
		z-index: 41;
	}

	.panel {
		width: min(860px, 100%);
		max-height: min(86vh, 900px);
		overflow: auto;
		background: #101419;
		border: 1px solid #2e343d;
		border-radius: 14px;
		padding: 1rem 1rem 1.15rem;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.panel-header h2 {
		margin: 0;
		font-size: clamp(1.15rem, 2.4vw, 1.45rem);
		color: var(--color-brand-gold);
	}

	.close-btn {
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		border: 1px solid #3b424b;
		background: transparent;
		color: #d9e0e6;
		font-size: 1.15rem;
		line-height: 1;
		cursor: pointer;
	}

	.close-btn:hover {
		background: #171d24;
	}

	.close-btn:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}

	@media (max-width: 720px) {
		.modal-wrap {
			align-items: end;
			padding: 0;
		}

		.panel {
			width: 100%;
			max-height: 90vh;
			border-radius: 16px 16px 0 0;
			border-left: none;
			border-right: none;
			border-bottom: none;
			padding: 0.95rem 0.85rem 1rem;
		}
	}
</style>
