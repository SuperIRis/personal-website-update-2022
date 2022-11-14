"use strict";
import Aboutme from "./sections/aboutme.js";
import AnimatedJsonSprite from "./lib/AnimatedJsonSprite.js";
import AnimatedLoader from "./lib/AnimatedLoader.js";
import Contact from "./sections/contact.js";
import Home from "./sections/home.js";
import Project from "./sections/project/Project.js";
import Projects from "./sections/projects.js";
import { removeClassFromAll, toggleClass, trackEvent } from "./lib/Utils.js";

const sections = [
	{ enPath: ["aboutme"], esPath: ["acerca"], classObject: Aboutme },
	{ enPath: [""], esPath: ["", "index"], classObject: Home },
	{ enPath: ["contact"], esPath: ["contacto"], classObject: Contact },
	{ enPath: ["projects"], esPath: ["proyectos"], classObject: Projects },
	{ enPath: ["project"], esPath: ["proyecto"], classObject: Project },
];

const libraries = [
	{ script: "snap.svg-min.js", globalName: "Snap" },
	{ script: "circles.min.js", globalName: "Circles" },
	{ script: "js?v=3.exp&signed_in=true", globalName: "google" },
];
const loaderAnimation = new AnimatedJsonSprite(
	"spritesheets/loader.png",
	document.getElementById("loader-me"),
	{
		loop: true,
		frameRate: 40,
		loopStartStep: 4,
		loopEndStep: 22,
	}
);

let currentSection;

AnimatedLoader.init(loaderAnimation, libraries);
AnimatedLoader.addEventListener("done", initPage);
setNavigation();
setTracking();
//setLoads();
window.addEventListener("load", setLoads);
initPage(window.location.href);

function initPage(url) {
	const path = url.substring(0, url.indexOf(".html")).substring(url.lastIndexOf("/") + 1);
	console.log("path", path, url);
	let ajaxLoaded = false;
	if (currentSection) {
		currentSection.destroy();
		ajaxLoaded = true;
	}
	const section = sections.find((section) => {
		return section.esPath.indexOf(path) !== -1;
	});
	section.classObject.init();
	currentSection = section.classObject;
}

//document.querySelector("[data-popup]").addEventListener("click", onOpenPopup);

function setNavigation() {
	document.getElementById("mobile-menu").addEventListener("click", onToggleMobileMenu);
	document.getElementById("main-menu").addEventListener("click", (e) => {
		e.preventDefault();
		const url = e.target.getAttribute("href");
		AnimatedLoader.loadSection(url);
	});
	Projects.addEventListener("openProject", (url) => {
		AnimatedLoader.loadSection(url);

		//loadPage(url);
	});
}

function setTracking() {
	document.querySelector("body").addEventListener("click", (e) => {
		const trackingElement = e.target.getAttribute("data-track") || e.target.closest("[data-track]");
		if (trackingElement) {
			console.log("track");
			trackEvent("external-link", "click", trackingElement.getAttribute("data-track"));
		}
	});
}

function setLoads() {
	removeClassFromAll(document.querySelectorAll(".preload"), "preload");
	document.getElementById("loader").classList.add("unshown");
	//AnimatedLoader.stop();
}
function onToggleMobileMenu(e) {
	toggleClass(e.currentTarget, "active");
	toggleClass(document.getElementById("main-container"), "mobile-menu-on");
	toggleClass(document.getElementById("main-footer"), "mobile-menu-on");
}
/*
Home.addEventListener("unload", (data) => {
	console.log("unloaded");
	AnimatedLoader.loadSection(data.url);
});
*/
