<script lang="ts">
	import { flip } from 'svelte/animate';

	type Vec = { x: number; y: number };
	const cols = 4;
	const bgUrl = '/bg.jpg';
	const indexToVec = (i: number) => ({
		x: i % cols,
		y: Math.floor(i / cols)
	});
	const vec = (a: Vec, b: Vec) => {
		return { x: b.x - a.x, y: b.y - a.y };
	};
	const swap = <T,>(arr: T[], i: number, j: number) => {
		[arr[i], arr[j]] = [arr[j], arr[i]];
	};
	let cells = Array.from({ length: cols * cols }).map((_, i) => {
		const { x, y } = indexToVec(i);
		return {
			id: i,
			offsetX: (x * 100) / (cols - 1),
			offsetY: (y * 100) / (cols - 1)
		};
	});

	const gapId = cells.length - 1;

	const move = (idx: number) => {
		const gapIdx = cells.findIndex((c) => c.id === gapId)!;
		const gap = indexToVec(gapIdx);
		const cell = indexToVec(idx);
		const v = vec(gap, cell);
		let offset = 0;
		let repeat = 0;
		if (v.y === 0) {
			offset = Math.sign(v.x);
			repeat = Math.abs(v.x);
		}
		if (v.x === 0) {
			offset = Math.sign(v.y) * cols;
			repeat = Math.abs(v.y);
		}
		for (let i = 0; i < repeat; i++) {
			const gapIdx = cells.findIndex((c) => c.id === gapId)!;
			swap(cells, gapIdx, gapIdx + offset);
		}

		cells = cells;
	};
	let helpText = false;
</script>

<div class="grid grid-cols-4 gap-1 p-1 mx-auto overflow-clip">
	{#each cells as cell, i (cell)}
		<button
			animate:flip={{ duration: 250 }}
			class:gap={cell.id === gapId}
			on:click={() => move(i)}
			class="shadow flex items-center justify-center text-xl aspect-square bg-no-repeat"
			style="background-image: url({bgUrl}); background-size: {cols *
				100}%; background-position: {cell.offsetX}% {cell.offsetY}%;"
		>
			{#if helpText}
				{cell.id}
			{/if}
		</button>
	{/each}
</div>

<style lang="postcss">
	.gap {
		@apply bg-none shadow-none -z-10 !important;
	}
</style>
