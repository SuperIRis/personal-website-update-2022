"use strict";

import ScrollMonitor from "../vendor/scrollMonitor.js";
import AnimatedNumber from "../lib/AnimatedNumber.js";
import EventfulClass from "../lib/EventfulClass.js";

const percentageColors = ["#9ac21e", "#ffd43d", "#00ccd3"];
const circles = [];
const graphsWatchers = [];
const animatedStats = [];
let svgInterval;

class Aboutme extends EventfulClass {
	init() {
		this.setAnimateStats();
		this.animateRandomFacts();
		this.setSVG();
		for (let i = 0; i < document.querySelectorAll("#programming-skills li").length; i++) {
			graphsWatchers.push(
				ScrollMonitor.create(document.querySelectorAll("#programming-skills li")[i], -10)
			);
			graphsWatchers[graphsWatchers.length - 1].enterViewport(this.graphEntering.bind(this));
		}
		//document.getElementById("#main-menu").on("click", "a", onOpenSection);
	}
	setAnimateStats() {
		const statsNumbers = document.querySelectorAll(".stats-number");
		for (var j = 0, limit = statsNumbers.length; j < limit; j++) {
			const animatedStat = new AnimatedNumber(statsNumbers[j]);
			animatedStats.push(animatedStat);
			animatedStat.init();
		}
	}
	animateRandomFacts() {
		let factToGo, factToAppear;
		this.randomFactsInterval = setInterval(function () {
			factToAppear =
				document.querySelector("#random-facts .active").nextElementSibling ??
				document.querySelector("#random-facts li:nth-child(1)");
			factToGo = document.querySelector("#random-facts .active");
			factToGo.classList.add("unshown");
			factToGo.classList.remove("active");
			factToAppear.classList.remove("hidden");
			factToAppear.classList.add("active", "unshown");
			setTimeout(function () {
				factToGo.classList.add("hidden");
				factToAppear.classList.remove("unshown");
			}, 400);
		}, 5000);
	}
	setSVG() {
		if (typeof Snap !== "function") {
			console.error("No se encuentra la librería de Snap.svg");
			return;
		}
		const svg = new Snap("#me-about");

		Snap.load("images/aboutme-me.svg", (f) => {
			if (!this.snapLoaded) {
				this.characterAnimateBlink(f);
				svg.append(f);
				this.snapLoaded = true;
			}
		});
	}
	characterAnimateBlink(f) {
		const leftEye = f.select("#left-eye");
		const rightEye = f.select("#right-eye");
		const leftEyeClosed = f.select("#left-eye-closed");
		const rightEyeClosed = f.select("#right-eye-closed");
		if (!leftEye || !rightEye || !leftEyeClosed || !rightEyeClosed) {
			return console.error(
				"No se encuentran los elementos en el svg\n",
				leftEye,
				rightEye,
				leftEyeClosed,
				rightEyeClosed
			);
		}
		leftEyeClosed.addClass("hidden");
		rightEyeClosed.addClass("hidden");
		svgInterval = setInterval(function () {
			leftEye.addClass("hidden");
			rightEye.addClass("hidden");
			leftEyeClosed.removeClass("hidden");
			rightEyeClosed.removeClass("hidden");
			setTimeout(function () {
				leftEye.removeClass("hidden");
				rightEye.removeClass("hidden");
				leftEyeClosed.addClass("hidden");
				rightEyeClosed.addClass("hidden");
			}, 300);
		}, 4000);
	}
	graphEntering(e, domElement) {
		this.createGraph(domElement.querySelector("figure"));
	}

	createGraph(jElement) {
		//for(var i = 0, limit = graphs.length; i<limit; i++){
		const config = {
			id: jElement.id,
			value: jElement.getAttribute("data-percentage"),
			radius: 25,
			duration: 1000,
			text: function (value) {
				return "";
			},
			textClass: "circle-graph-" + this.getIdByPercentage(jElement.getAttribute("data-percentage")),
			width: 5,
			colors: [
				"#e1e1e1",
				percentageColors[this.getIdByPercentage(jElement.getAttribute("data-percentage"))],
			],
		};

		circles.push(Circles.create(config));
	}
	getIdByPercentage(percentage) {
		if (percentage > 90) {
			return 0;
		} else if (percentage > 60) {
			return 1;
		} else {
			return 2;
		}
	}
	destroy() {
		for (let i = 0; i < graphsWatchers.length; i++) {
			graphsWatchers[i].destroy();
		}
		graphsWatchers.length = 0;
		this.snapLoaded = false;
		clearInterval(svgInterval);
		clearInterval(this.randomFactsInterval);
	}
}
/*










function onOpenSection(e) {
	e.preventDefault();
	AnimatedLoader.loadSection($(e.currentTarget).attr("href"));
}
*/
const aboutMeSingleton = new Aboutme();
export default aboutMeSingleton;
