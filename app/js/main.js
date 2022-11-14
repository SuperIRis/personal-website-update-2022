"use strict";
import Aboutme from "./sections/Aboutme.js";
import AnimatedJsonSprite from "./lib/AnimatedJsonSprite.js";
import AnimatedLoader from "./lib/AnimatedLoader.js";
import Contact from "./sections/Contact.js";
import Home from "./sections/Home.js";
import Project from "./sections/project/Project.js";
import Projects from "./sections/Projects.js";
import { removeClassFromAll, toggleClass, trackEvent } from "./lib/Utils.js";

const sections = [
	{ enPath: ["aboutme"], esPath: ["acerca"], classObject: Aboutme },
	{ enPath: [""], esPath: ["", "index"], classObject: Home },
	{ enPath: ["contact"], esPath: ["contacto"], classObject: Contact },
	{ enPath: ["projects"], esPath: ["proyectos"], classObject: Projects },
	{ enPath: ["project"], esPath: ["proyecto"], classObject: Project },
];

const scriptLibraries = [
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

AnimatedLoader.init(loaderAnimation, scriptLibraries);
AnimatedLoader.addEventListener("done", initPage);
initPage(window.location.href);
window.addEventListener("load", setLoads);
setNavigation();
setTracking();

function initPage(url) {
	const path = url.substring(0, url.indexOf(".html")).substring(url.lastIndexOf("/") + 1);
	let ajaxLoaded = false;
	if (currentSection) {
		currentSection.destroy();
		resetTracking();
		ajaxLoaded = true;
	}
	const section = sections.find((section) => {
		return section.esPath.indexOf(path) !== -1;
	});
	section.classObject.init();
	currentSection = section.classObject;
}

function setLoads() {
	removeClassFromAll(document.querySelectorAll(".preload"), "preload");
	document.getElementById("loader").classList.add("unshown");
}

function setNavigation() {
	document.getElementById("mobile-menu").addEventListener("click", onToggleMobileMenu);
	document.getElementById("main-menu").addEventListener("click", (e) => {
		const target = e.target.closest("a");
		if (target) {
			e.preventDefault();
			const url = target.getAttribute("href");
			AnimatedLoader.loadSection(url);
		}
	});
	Projects.addEventListener("openProject", (url) => AnimatedLoader.loadSection(url));
	Project.addEventListener("openProject", (url) => AnimatedLoader.loadSection(url));
	Project.addEventListener("openSection", (url) => AnimatedLoader.loadSection(url));
	Home.addEventListener("openSection", (url) => AnimatedLoader.loadSection(url));
}

function setTracking() {
	document.querySelector("body").addEventListener("click", track);
}

function track(e) {
	const trackingElement = e.target.getAttribute("data-track") || e.target.closest("[data-track]");
	if (trackingElement) {
		trackEvent("external-link", "click", trackingElement.getAttribute("data-track"));
	}
}

function resetTracking() {
	document.querySelector("body").removeEventListener("click", track);
	setTracking();
}

function onToggleMobileMenu(e) {
	toggleClass(e.currentTarget, "active");
	toggleClass(document.getElementById("main-container"), "mobile-menu-on");
	toggleClass(document.getElementById("main-footer"), "mobile-menu-on");
}
