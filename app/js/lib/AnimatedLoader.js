"use strict";
//var WaitForImages = require("../vendor/jquery.waitforimages.min.js"); // jshint ignore:line

//var backendTries = 0;
import { onAllImagesLoaded } from "./Utils.js";
class AnimatedLoader {
	constructor() {
		//this.animation;
		this.nodes = {
			body: document.querySelector("body"),
			loader: document.getElementById("loader"),
			mainHeader: document.querySelector(".main-header"),
			mainFooter: document.querySelector(".main-footer"),
			mainWrapper: document.querySelector(".main-wrapper"),
			mainContainer: document.querySelector(".main-container"),
			pusher: document.getElementById("pusher"),
		};
	}
	init(animation) {
		/*if (!animation) {
			return console.error("AnimatedLoader needs an animation from AnimatedJsonSprite");
		}
		this.animation = animation;
		this.animation.start();*/
		console.log("init animated loader!");
	}
	showLoader() {
		this.nodes["loader"].classList.remove("unshown");
		this.nodes["body"].classList.add("scroll-block");
		setTimeout(function () {
			this.animation.start();
		}, 700);
	}
	hideLoader() {
		this.nodes["body"].classList.remove("scroll-block");
		this.animation.stop();
		setTimeout(function () {
			this.nodes["loader"].classList.add("unshown");
		}, 700);
	}
	cleanPageState() {
		document.querySelector(".selected").classList.remove("selected");
		this.nodes["body"].classList.remove("project-detail-body");
		this.nodes["mainHeader"].classList.remove("project-header");
		this.nodes["mainFooter"].classList.remove("project-footer");
		this.nodes["mainWrapper"].className = "";
		this.nodes["mainContainer"].className = "";
		this.nodes["mainHeader"].className = "";
		this.nodes["mainHeader"].classList.add("main-header");
		this.nodes["pusher"].classList.remove("push");
		this.nodes["mainContainer"].className = "";
	}
	loadSection(url) {
		/*if (!this.animation) {
			return console.error("AnimatedLoader hasn't been initiated");
		}*/
		this.url = url;
		this.loadData = "";
		this.loadReady = false;
		this.animationReady = false;
		this.showLoader();

		fetch(this.url).then(this.onSectionDOMReady.bind(this));

		setTimeout(function () {
			this.animationReady = true;
			if (this.loadReady) {
				this.onLoadReady();
			}
			cleanPageState();
			$("a[href='" + this.url + "']").addClass("selected");

			/*if (url === "acerca.html") {
				$("#main-container").removeClass().addClass("aboutme-container container");
			} else if (url.indexOf("proyecto.html") !== -1) {
				$("a[href='proyectos.html']").addClass("selected");
				$("#main-container").addClass("project-container").addClass("container");
				$("#main-wrapper").addClass("wrapper project-wrapper");
				$("body").addClass("project-detail-body");
				$(".main-header").addClass("project-header");
				$("#main-footer").addClass("project-footer");
			} else if (url === "/") {
				//$("#main-container").removeClass().addClass("main-container");
			} else if (url === "contacto.html") {
				$("#main-wrapper").removeClass().addClass("wrapper");
				$("#main-container").addClass("container contact-container");
				$("#pusher").addClass("push");
			}
			if ($("#mobile-menu").hasClass("active")) {
				$("#mobile-menu").click();
				$(".mobile-menu-on").removeClass("mobile-menu-on");
			}*/
		}, 1000);
	}
	onSectionDOMReady(data) {
		this.loadReady = true;
		this.loadData = data;
		if (this.animationReady) {
			this.onLoadReady(data);
		}
	}
	onLoadReady() {
		//cargar el contenido antes de quitar el loader, hasta ahorita sólo ha cargado el html como texto
		setTimeout(function () {
			const tempElement = document.createElement("div");
			tempElement.innerHTML = this.loadData;
			this.nodes["mainContainer"].innerHTML =
				tempElement.getElementById("main-container").innerHTML;
			onAllImagesLoaded(tempElement.getElementById("main-container")).then(() => {
				if (this.animationReady) {
					const title = this.url.substr(0, this.url.indexOf("."));
					const scripts = tempElement.querySelectorAll("script");
					let newTitle;

					AnimatedLoader.checkScripts(scripts, function () {
						switch (title) {
							case "acerca":
								newTitle = "SuperIRis :: Acerca de mí";
								break;
							case "proyecto":
							case "proyectos":
								newTitle = "SuperIRis :: Portafolios";
								break;
							case "contacto":
								newTitle = "SuperIRis :: Contacto";
								break;
							default:
								newTitle = "SuperIRis";
						}

						document.title = newTitle;
						if (window.history.pushState) {
							window.history.pushState(newTitle, newTitle, AnimatedLoader.url);
						}

						setTimeout(function () {
							tempElement.remove();
							AnimatedLoader.hideLoader();
							window.loadPage(title.toLowerCase(), true);
						}, 200);
					});
				}
			});
		}, 1000);
	}
}
const AnimatedLoaderSingleton = new AnimatedLoader();
export default AnimatedLoaderSingleton;

/*
AnimatedLoader.ajaxLoad = function (url, callback) {
	$.ajax({
		type: "GET",
		url: url,
		error: function (error, options, message) {
			console.log(error, "--->", message, options);
			backendTries++;
			if (backendTries <= 5) {
				setTimeout(function () {
					AnimatedLoader.ajaxLoad(url, callback);
				}, 200);
			} else {
				backendTries = 0;
				alert("Ha habido un error en el servidor, intenta de nuevo por favor");
			}
		},
		success: function (data) {
			//console.log(data);
			backendTries = 0;
			//if (data.status =="success"){

			//	}
			//	else{
			//	$(document).trigger("backend:save_error");
			//	}
			//if (typeof callback !== "undefined") {
			//	callback(data);
			//}
		},
	});
};


AnimatedLoader.checkScripts = function (scripts, callback) {
	var script,
		loadedScripts = 0,
		scriptsToLoad = 0;
	for (var i = 0, limit = scripts.length; i < limit; i++) {
		script = scripts[i].src.substr(scripts[i].src.lastIndexOf("/") + 1);
		switch (script) {
			case "jquery.min.js":
				if (typeof $ === "undefined") {
					scriptsToLoad++;
					AnimatedLoader.loadScript(scripts[i].src, onLoadedScript);
				}
				break;
			case "snap.svg-min.js":
				if (typeof Snap === "undefined") {
					scriptsToLoad++;
					AnimatedLoader.loadScript(scripts[i].src, onLoadedScript);
				}
				break;
			case "circles.min.js":
				if (typeof Circles === "undefined") {
					scriptsToLoad++;
					AnimatedLoader.loadScript(scripts[i].src, onLoadedScript);
				}
				break;
			case "js?v=3.exp&signed_in=true":
				if (typeof google === "undefined") {
					scriptsToLoad++;
					AnimatedLoader.loadScript(
						"https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initializeMap&key=AIzaSyBNAwmEPIfIlqyIh-2_7e9S2AfeXPnaYy4",
						onLoadedScript
					);
				}
				break;
			case "bundle.js":
			case "":
				break;
			default:
				console.warn("Se desconoce el script:", script);
		}
	}
	if (scriptsToLoad === 0) {
		callback();
	}
	function onLoadedScript() {
		loadedScripts++;
		if (loadedScripts === scriptsToLoad) {
			callback();
		}
	}
};
AnimatedLoader.loadScript = function (script, callback) {
	//console.log("cargar", script);
	$.getScript(script, callback);
};
AnimatedLoader.loadSection = function (url) {
	
};
AnimatedLoader.stop = function () {
	AnimatedLoader.animation.stop();
};
AnimatedLoader.init = function (animation) {
	AnimatedLoader.animation = animation;
	AnimatedLoader.animation.start();
	if (!AnimatedLoader.animation) {
		return console.error("AnimatedLoader needs an animation from AnimatedJsonSprite");
	}
};
*/
