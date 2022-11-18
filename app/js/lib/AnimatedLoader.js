"use strict";

import EventfulClass from "./EventfulClass.js";
import { onAllImagesLoaded } from "./Utils.js";
class AnimatedLoader extends EventfulClass {
	getNodes() {
		return {
			body: document.querySelector("body"),
			loader: document.getElementById("loader"),
			mainHeader: document.querySelector(".main-header"),
			mainFooter: document.querySelector(".main-footer"),
			mainWrapper: document.getElementById("main-wrapper"),
			mainContainer: document.querySelector("#main-container"),
			pusher: document.getElementById("pusher"),
		};
	}
	init(animation, libraries) {
		if (!animation) {
			return console.error("AnimatedLoader needs an animation from AnimatedJsonSprite");
		}
		this.animation = animation;
		this.libraries = libraries;
		this.animation.start();
	}
	showLoader() {
		this.nodes["loader"].classList.remove("unshown");
		this.nodes["body"].classList.add("scroll-block");
		setTimeout(() => {
			this.animation.start();
		}, 700);
	}
	hideLoader() {
		this.nodes["body"].classList.remove("scroll-block");
		this.animation.stop();
		setTimeout(() => {
			this.nodes["loader"].classList.add("unshown");
		}, 700);
	}
	cleanPageState() {
		document.querySelector(".selected")?.classList.remove("selected");
	}
	loadSection(url, browserNav = false) {
		if (!this.animation) {
			return console.error("AnimatedLoader hasn't been initiated");
		}
		this.browserNav = browserNav;
		this.nodes = this.getNodes();
		this.url = url;
		this.loadReady = false;
		this.animationReady = false;
		this.showLoader();

		fetch(this.url)
			.then((res) => res.text())
			.then(this.onSectionDOMReady.bind(this));

		setTimeout(() => {
			this.animationReady = true;
			if (this.loadReady) {
				this.onLoadReady();
			}
			this.cleanPageState();
			document.querySelector("a[href='" + this.url + "']")?.classList.add("selected");
		}, 1000);
	}
	onSectionDOMReady(data) {
		this.loadReady = true;
		this.htmlData = data;
		if (this.animationReady) {
			this.onLoadReady();
		}
	}
	onLoadReady() {
		//cargar el contenido antes de quitar el loader, hasta ahorita sólo ha cargado el html como texto
		setTimeout(() => {
			const tempElement = document.createElement("div");
			tempElement.innerHTML = this.htmlData;
			const title = tempElement.querySelector("title").innerHTML;
			this.nodes["mainContainer"].innerHTML =
				tempElement.querySelector("#main-container").innerHTML;
			onAllImagesLoaded(tempElement.querySelector("#main-container")).then(() => {
				if (this.animationReady) {
					const scripts = tempElement.querySelectorAll("script");

					document.title = title;
					if (window.history.pushState && !this.browserNav) {
						window.history.pushState(title, title, this.url);
					}
					this.loadScriptsIfNeeded(scripts).then(() => {
						//tempElement.remove();
						this.trigger("done", this.url);
						this.hideLoader();
					});
				}
			});
		}, 1000);
	}
	loadScriptsIfNeeded(scripts) {
		const allScriptsPromises = [];
		scripts.forEach((scriptURL) => {
			const script = this.libraries.find((library) => scriptURL.src.indexOf(library.script) !== -1);
			if (script && !window[script.globalName]) {
				allScriptsPromises.push(this.loadScript(scriptURL.src));
			}
		});
		return Promise.all(allScriptsPromises);
	}
	loadScript(url) {
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			document.body.appendChild(script);
			script.onload = resolve;
			script.onerror = reject;
			script.async = true;
			script.src = url;
		});
	}
}
const AnimatedLoaderSingleton = new AnimatedLoader();
export default AnimatedLoaderSingleton;
