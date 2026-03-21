<script lang="ts">
	import type { SizeGuide } from '$lib/size-guides/data';

	let { guide }: { guide: SizeGuide } = $props();
</script>

<section class="size-guide-content">
	<header class="intro">
		<h3>{guide.title}</h3>
		<p>{guide.fitNote}</p>
	</header>

	<div class="table-wrap" role="region" aria-label={`${guide.title} measurements`}>
		<table>
			<thead>
				<tr>
					{#each guide.columns as col}
						<th scope="col">{col}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each guide.rows as row}
					<tr>
						{#each row as cell, index}
							{#if index === 0}
								<th scope="row">{cell}</th>
							{:else}
								<td>{cell}</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<p class="tolerance">{guide.toleranceNote}</p>

	<section class="measure-help" aria-label="How to measure">
		<h4>How to Measure</h4>
		<ul>
			{#each guide.measurementHelp as item}
				<li>{item}</li>
			{/each}
		</ul>
		{#if guide.finalNote}
			<p class="final-note">{guide.finalNote}</p>
		{/if}
	</section>
</section>

<style>
	.size-guide-content {
		display: grid;
		gap: 1rem;
	}

	.intro h3 {
		margin: 0;
		font-size: clamp(1.1rem, 2.2vw, 1.35rem);
		letter-spacing: 0.01em;
		color: var(--color-brand-gold);
	}

	.intro p {
		margin: 0.45rem 0 0;
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	.table-wrap {
		overflow-x: auto;
		border: 1px solid #2c3138;
		border-radius: 8px;
	}

	table {
		width: 100%;
		min-width: 520px;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.62rem 0.78rem;
		text-align: left;
		border-bottom: 1px solid #2c3138;
	}

	thead th {
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #bcc4cb;
		font-weight: 600;
	}

	tbody th {
		font-weight: 600;
		color: #eef1f4;
	}

	tbody td {
		color: #d5dce2;
	}

	tbody tr:last-child th,
	tbody tr:last-child td {
		border-bottom: none;
	}

	.tolerance,
	.final-note {
		margin: 0;
		font-size: 0.84rem;
		color: #a8b2bc;
	}

	.measure-help h4 {
		margin: 0;
		font-size: 0.88rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: #d9e0e6;
	}

	.measure-help ul {
		margin: 0.55rem 0 0;
		padding-left: 1.05rem;
	}

	.measure-help li {
		margin: 0.3rem 0;
		color: #d0d8de;
		line-height: 1.55;
	}
</style>
