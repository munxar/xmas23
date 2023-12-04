<script lang="ts">
	import { flip } from 'svelte/animate';

	type Vec = { x: number; y: number };
	const cols = 4;
	const bgUrl = `/bg${Math.floor(Math.random() * 2)}.jpeg`;
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
	const shift = (offset: number, repeat: number) => {
		for (let i = 0; i < repeat; i++) {
			const gapIdx = getGapIdx();
			swap(cells, gapIdx, gapIdx + offset);
		}
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
	const getGapIdx = () => cells.findIndex((c) => c.id === gapId)!;
	const move = (idx: number) => {
		const gapIdx = getGapIdx();
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
		shift(offset, repeat);

		cells = cells;
	};
	let helpText = false;

	const isShuffled = () => cells.every((cell, i) => cell.id !== i);
	$: isSolved = () => cells.every((cell, i) => cell.id === i);

	const shuffle = async (debug = false) => {
		cells.sort((a, b) => a.id - b.id);
		while (!isShuffled()) {
			const gapIdx = getGapIdx();
			let { x, y } = indexToVec(gapIdx);
			if (Math.random() > 0.5) {
				x = (x + Math.floor(1 + Math.random() * (cols - 1))) % cols;
			} else {
				y = (y + Math.floor(1 + Math.random() * (cols - 1))) % cols;
			}
			const idx = x + y * cols;
			move(idx);
			if (debug) {
				break;
			}
		}
	};
	shuffle();
</script>

<div
	class="grid grid-cols-4 mx-auto overflow-clip duration-1000 {isSolved()
		? 'gap-0 p-0'
		: 'gap-1 p-1'}"
>
	{#each cells as cell, i (cell)}
		<button
			animate:flip={{ duration: 250 }}
			class:gap={cell.id === gapId && !isSolved()}
			class:isCorrect={cell.id === i}
			on:click={() => move(i)}
			class="grayscale flex items-center justify-center text-xl aspect-square bg-no-repeat"
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
	.isCorrect {
		@apply grayscale-0 !important;
	}
</style>
