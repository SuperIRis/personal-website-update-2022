export function slideImages(imagesContainer, projectContainer, images) {
	let currentImage = 0;
	imagesContainer.style.backgroundImage = "url(images/projects/" + images[currentImage] + ")";
	projectContainer.classList.add("transition");
	return setInterval(() => {
		currentImage++;
		if (currentImage === images.length) {
			currentImage = 0;
		}
		projectContainer.classList.add("dark");
		setTimeout(() => {
			projectContainer.classList.remove("dark");
			imagesContainer.style.backgroundImage = "url(images/projects/" + images[currentImage] + ")";
		}, 1000);
	}, 8000);
}

export function changeExtraBtnTxtToMinus(btn) {
	setTimeout(() => {
		btn.innerHTML = "MXTRA INFO";
	}, 500);
	setTimeout(() => {
		btn.innerHTML = "METRA INFO";
	}, 650);
	setTimeout(() => {
		btn.innerHTML = "MENRA INFO";
	}, 800);
	setTimeout(() => {
		btn.innerHTML = "MENOA INFO";
	}, 950);
	setTimeout(() => {
		btn.innerHTML = "MENOS INFO";
	}, 1100);
}
export function changeMinusBtnTxtToExtra(btn) {
	setTimeout(() => {
		btn.innerHTML = "EXTRA INFO";
	}, 1100);
	setTimeout(() => {
		btn.innerHTML = "MXTRA INFO";
	}, 950);
	setTimeout(() => {
		btn.innerHTML = "METRA INFO";
	}, 800);
	setTimeout(() => {
		btn.innerHTML = "MENRA INFO";
	}, 650);
	setTimeout(() => {
		btn.innerHTML = "MENOA INFO";
	}, 500);
}
