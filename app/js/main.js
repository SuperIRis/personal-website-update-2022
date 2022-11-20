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
	{ enPath: ["index", ""], esPath: ["index-es"], classObject: Home },
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
let currentLanguage;

AnimatedLoader.init(loaderAnimation, scriptLibraries);
AnimatedLoader.addEventListener("done", initPage);
initPage(window.location.href);
window.addEventListener("load", setLoads);
window.addEventListener("popstate", handleBrowserNav);
setNavigation();
//setTracking();

function initPage(url) {
	const path = url.substring(0, url.indexOf(".html")).substring(url.lastIndexOf("/") + 1);
	let ajaxLoaded = false;
	if (currentSection) {
		currentSection.destroy();
		//resetTracking();
		ajaxLoaded = true;
	}
	let language;
	const section = sections.find((section) => {
		if (section.enPath.indexOf(path) !== -1) {
			language = "en";
		} else if (section.esPath.indexOf(path) !== -1) {
			language = "es";
		}
		return !!language;
	});
	currentLanguage = language;
	selectCurrentSectionMenuItem(section[`${currentLanguage}Path`]);
	selectCurrentLanguageMenuItem(currentLanguage);
	section.classObject.init(currentLanguage);
	currentSection = section.classObject;
}

function selectCurrentLanguageMenuItem(language) {
	document.querySelector("[data-url-lang]").classList.remove("selected");
	document.querySelector(`[data-url-lang="${language}"]`).classList.add("selected");
}

function selectCurrentSectionMenuItem(path) {
	document.querySelector(".main-header").classList.remove("selected");
	path !== "" &&
		document.querySelector(`.main-header [href*="${path[0]}"]`).classList.add("selected");
}

function setLoads() {
	removeClassFromAll(document.querySelectorAll(".preload"), "preload");
	document.getElementById("loader").classList.add("unshown");
}

function handleBrowserNav() {
	AnimatedLoader.loadSection(window.location.href, { browserNav: true });
}

function setNavigation() {
	document.getElementById("mobile-menu").addEventListener("click", onToggleMobileMenu);
	document.getElementById("main-menu").addEventListener("click", (e) => {
		const target = e.target.closest("a");
		e.preventDefault();
		if (target && !target.classList.contains("selected")) {
			//If data-url-lang exists then it is a language change
			const newLanguage = target.getAttribute("data-url-lang");
			const url = newLanguage ? getCurrentURLByLanguage(newLanguage) : target.getAttribute("href");
			AnimatedLoader.loadSection(url, { changeLanguage: !!newLanguage });
		}
	});
	Projects.addEventListener("openProject", onOpenProject);
	Project.addEventListener("openProject", onOpenProject);
	Project.addEventListener("openProjects", onOpenProjects);
	Home.addEventListener("openProject", onOpenProject);
}

function onOpenProject(project) {
	const section = sections.find((section) => section.classObject === Project);
	const url = `${section[`${currentLanguage}Path`]}.html#${project}`;
	AnimatedLoader.loadSection(url);
}
function onOpenProjects() {
	const section = sections.find((section) => section.classObject === Projects);
	const url = `${section[`${currentLanguage}Path`]}.html`;
	AnimatedLoader.loadSection(url);
}

function getCurrentURLByLanguage(language) {
	const section = sections.find((section) => {
		return section.classObject === currentSection;
	});
	if (!section) {
		return console.warn("Cannot find current section");
	}
	const newPath = section[`${language}Path`][0];
	return `${newPath}.html${window.location.hash}`;
}

/*
GA4 already does external link tracking by default
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
*/
function onToggleMobileMenu(e) {
	toggleClass(e.currentTarget, "active");
	toggleClass(document.getElementById("main-container"), "mobile-menu-on");
	toggleClass(document.getElementById("main-footer"), "mobile-menu-on");
}
