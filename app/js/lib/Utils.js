"use strict";
export function shuffle(array) {
	var counter = array.length,
		temp,
		index;

	while (counter > 0) {
		index = Math.floor(Math.random() * counter);
		counter--;
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}
export function randomBoolean() {
	return Math.random() < 0.5;
}
export function randomFromArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}
export function getProjectByStringID(stringID, projects) {
	for (var i = 0, limit = projects.length; i < limit; i++) {
		if (projects[i].stringID === stringID) {
			if (i > 0) {
				projects[i].lastProject = projects[i - 1];
			} else {
				projects[i].lastProject = projects[projects.length - 1];
			}
			if (i === projects.length - 1) {
				projects[i].nextProject = projects[0];
			} else {
				projects[i].nextProject = projects[i + 1];
			}

			return projects[i];
		}
	}
	return false;
}
export function trackView(page) {
	if (typeof ga !== "undefined") {
		ga("send", "pageview", page);
	}
}
export function trackEvent(cat, action, label) {
	if (typeof ga !== "undefined") {
		ga("send", "event", cat, action, label);
	}
}

export function toggleClass(element, className) {
	if (element.classList.contains(className)) {
		element.classList.remove(className);
	} else {
		element.classList.add(className);
	}
}

export function removeClassFromAll(elementCollection, className) {
	elementCollection.forEach((element) => {
		element.classList.remove(className);
	});
}

export function preloadImage(imageURL) {
	return new Promise((resolve, reject) => {
		const imageContainer = document.createElement("img");
		imageContainer.onload = resolve;
		imageContainer.onerror = reject;
		imageContainer.src = imageURL;
	});
}

export function onAllImagesLoaded(node) {
	return Promise.all(
		Array.from(node.querySelectorAll("img") ?? document.images)
			.filter((img) => !img.complete)
			.map(
				(img) =>
					new Promise((resolve) => {
						img.onload = img.onerror = resolve;
					})
			)
	).then(() => {
		console.log("images finished loading");
	});
}

export function bulkNodeAction(actionFn, nodes) {
	nodes.forEach((node) => {
		node[actionFn]();
	});
}

export function onOpenPopup(e) {
	e.preventDefault();
	const url = $(e.currentTarget).attr("href");
	const popup = e.currentTarget.getAttribute("data-popup");
	const width = popup === "twitter" ? 550 : 500;
	const height = popup === "twitter" ? 400 : 320;
	const top = window.innerHeight / 2 - height / 2;
	const left = window.innerWidth / 2 - width / 2;

	window.open(
		url,
		popup,
		"width=" + width + ", height=" + height + ", left=" + left + ", top=" + top
	);
}
