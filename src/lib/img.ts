export const convertImg = async (img: string | null) => {
	const makeImg = (src: string | null) =>
		new Promise<HTMLImageElement>((resolve) => {
			const img = new Image();
			img.src = src!;
			img.onload = () => {
				resolve(img);
			};
		});

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d')!;
	const image = await makeImg(img);
	ctx.drawImage(image, 0, 0, 300, 300);

	// Show resized image in preview element
	//const dataurl = canvas.toDataURL();
};
