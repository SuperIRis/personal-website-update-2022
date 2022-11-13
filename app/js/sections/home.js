"use strict";

import PROJECTS from "../../data/projects.js";
import { preloadImage } from "../lib/Utils.js";
import ScrollMonitor from "../vendor/scrollMonitor.js";
import AnimatedJsonSprite from "../lib/AnimatedJsonSprite.js";
import EventfulClass from "../lib/EventfulClass.js";
import { trackEvent } from "../lib/Utils.js";
class Home extends EventfulClass {
	init() {
		console.log("init home");
		const homeSprites = ["libro", "normal", "ds"];
		const currentSprite = homeSprites[Math.floor(Math.random() * homeSprites.length)];
		this.homeMe = new AnimatedJsonSprite(
			"spritesheets/homes-" + currentSprite + ".png",
			document.getElementById("me"),
			{ loop: true, frameRate: 40 }
		);
		this.homeMe.start();
		document.getElementById("main-container").classList.add("main-container");
		document.getElementById("home-down-btn").addEventListener("click", this.onScrollToProjects);
		document.getElementById("intro-container").style.height = `${window.innerHeight - 86}px`;
		this.parseProjects();
		this.setProjects();
	}

	onScrollToProjects() {
		const introHeight = document.getElementById("intro-container").offsetHeight + 86;
		window.scrollTo({ top: introHeight, behavior: "smooth" });
	}

	parseProjects() {
		//find home projects
		const projects = PROJECTS.projects;
		this.projects = [];
		for (var i = 0; i < projects.length; i++) {
			if (projects[i].images && projects[i].images.home) {
				this.projects.push(projects[i]);
			}
		}
	}

	fillProjectData(projectNode, projectIndex) {
		projectNode.querySelector(".project-title").innerHTML = this.projects[projectIndex].name;
		projectNode.querySelector(".project-tech").innerHTML = this.projects[projectIndex].tech;
		projectNode.querySelector("a").setAttribute("href", this.projects[projectIndex].stringID);
		projectNode.querySelector("a").addEventListener("click", this.onProjectClick.bind(this));
		preloadImage("images/projects/" + this.projects[projectIndex].images.home).then(() => {
			this.onProjectImageLoaded(projectNode, projectIndex);
		});
	}

	setProjects() {
		const allProjectNodes = document.querySelectorAll("#projects-preview-list li");
		this.loadedProjects = 0;
		allProjectNodes.forEach(this.fillProjectData.bind(this));
	}

	setScrollMonitor() {
		this.projectsWatcher = ScrollMonitor.create(
			document.querySelectorAll("#projects-preview-list li")[0],
			-10
		);
		this.projectsWatcher.enterViewport(function () {
			document.getElementById("projects-preview-list").classList.remove("unshown");
		});
		this.projectsWatcher.exitViewport(function () {
			document.getElementById("projects-preview-list").classList.add("unshown");
		});
	}

	onProjectImageLoaded(projectNode, projectIndex) {
		projectNode.querySelector(
			".project-preview-item"
		).style.backgroundImage = `url(images/projects/${this.projects[projectIndex].images.home})`;

		projectNode.classList.remove("loading");
		this.loadedProjects++;
		if (this.loadedProjects === this.projects.length) {
			this.setScrollMonitor();
		}
	}

	onProjectClick(e) {
		e.preventDefault();
		this.homeMe.stop();
		this.trigger("openSection", { url: e.currentTarget.getAttribute("href") });
		trackEvent("home-project", "click", e.currentTarget.querySelector(".project-title").innerHTML);
	}

	destroy() {
		this.homeMe = null;
		this.projectsWatcher.destroy();
		//this.removeAllEventListeners();
	}
}

const homeSingleton = new Home();
export default homeSingleton;
