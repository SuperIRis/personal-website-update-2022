"use strict";
import { trackEvent } from "../lib/Utils.js";
//var AnimatedLoader = require("../lib/AnimatedLoader.js");

class Contact {
	init(ajaxLoaded) {
		this.obfuscateMailTo();
		this.setFreelanceStatusSVG();
		if (!ajaxLoaded) {
			google.maps.event.addDomListener(window, "load", this.setMap.bind(this));
		} else {
			document.getElementById("main-container").prepend(this.mapContainer);
			this.setMap();
		}
		google.maps.event.addDomListener(window, "resize", this.resizeMap.bind(this));
		//document.getElementById("main-menu").addEventListener("click", "a", onOpenSection);
	}

	obfuscateMailTo() {
		const coded = "MbyS@JOtlGQGQJ.ZbL";
		const key = "stZ5MUTquSkAXVl2Q4J7RxnPF3OgBmdfyWrHjEIoDN1CzpcLhv80Ga9Y6beKiw";
		const shift = coded.length;
		let link = "";
		let ltr;
		for (let i = 0; i < coded.length; i++) {
			if (key.indexOf(coded.charAt(i)) === -1) {
				ltr = coded.charAt(i);
				link += ltr;
			} else {
				ltr = (key.indexOf(coded.charAt(i)) - shift + key.length) % key.length;
				link += key.charAt(ltr);
			}
		}
		document.getElementById("contact-mail").setAttribute("href", "mailto:" + link);
	}

	setFreelanceStatusSVG() {
		if (typeof Snap !== "function") {
			console.error("No se encuentra la librería de Snap.svg");
			return;
		}
		const s = new Snap("#me-working-status");
		Snap.load("images/freelance-status.svg", (f) => {
			if (!this.snapLoaded) {
				this.svgAnimate(f);
				this.setAvailability(f);
				s.append(f);
				this.snapLoaded = true;
			}
		});
	}
	svgAnimate(f) {
		const computerScreen = f.select("#svg-screen"),
			arms = f.select("#svg-arms"),
			initialScreenColor = "#fff",
			alternateScreenColor = "#ccc";
		let i = 0;

		setInterval(function () {
			i++;
			computerScreen.animate(
				{ fill: i % 2 === 0 ? initialScreenColor : alternateScreenColor },
				200
			);
			if (i % 7 === 0) {
				arms.removeClass("arms-down");
				arms.addClass("arms-up");
			} else {
				arms.removeClass("arms-up");
				arms.addClass("arms-down");
			}
		}, 700);
	}
	setAvailability(f) {
		const defaultAvailability = Number(
			document.getElementById("availability-percentage")?.getAttribute("value") ?? 0
		);
		const availability = 10 - Math.round(defaultAvailability / 10);
		const papers = f.select("#papers");

		let i = 1;
		while (papers.select("rect:nth-child(" + i + ")")) {
			papers.select("rect:nth-child(" + i + ")").addClass("paper-out");
			i++;
		}
		i = 1;
		const papersInterval = setInterval(function () {
			if (!papers.select("rect:nth-child(" + (i + 10) + ")") || i > availability) {
				clearInterval(papersInterval);
				return;
			}
			papers.select("rect:nth-child(" + i + ")").removeClass("paper-out");
			papers.select("rect:nth-child(" + i + ")").addClass("paper-in");
			papers.select("rect:nth-child(" + (i + 10) + ")").removeClass("paper-out");
			papers.select("rect:nth-child(" + (i + 10) + ")").addClass("paper-in");
			i++;
		}, 200);
	}

	setMap() {
		if (typeof this.map !== "undefined") {
			console.warn("Map already created");
		}
		this.whereIAm = new google.maps.LatLng(37.6852183, -122.1817252);
		const mapTypeId = "custom_style";
		const whereMarkerIs = new google.maps.LatLng(37.4592183, -122.1817252);
		const mapOptions = this.getMapOptions();
		//
		this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
		setTimeout(() => {
			this.addMarker(whereMarkerIs);
		}, 2000);
	}

	getMapOptions(mapTypeId) {
		return {
			zoom: 9,
			center: this.whereIAm,
			mapTypeId,
			disableDefaultUI: true,
			draggable: false,
			backgroundColor: "#fff",
			disableDoubleClickZoom: true,
			scrollwheel: false,
			maxZoom: 15,
		};
	}
	addMarker(whereMarkerIs) {
		const icon = new google.maps.MarkerImage(
			"images/marker-silicon.png",
			null,
			null,
			null,
			new google.maps.Size(144, 192)
		);
		this.marker = new google.maps.Marker({
			position: whereMarkerIs,
			map: this.map,
			flat: true,
			title: "SuperIRis",
			icon: icon,
			optimized: false,
			animation: google.maps.Animation.DROP,
		});
	}
	resizeMap() {
		this.map.setCenter(this.whereIAm);
	}

	destroy() {
		google.maps.event.clearListeners(window, "resize");
		google.maps.event.clearListeners(window, "load");
		//document.getElementById("main-menu").removeEventListener("click", "a");
		this.mapContainer = document.getElementById("map").remove();
		this.snapLoaded = false;
	}
}
/*
function onOpenSection(e) {
	console.log("open section!");
	e.preventDefault();
	AnimatedLoader.loadSection($(e.currentTarget).attr("href"));
}
*/
const contactSingleton = new Contact();
export default contactSingleton;
