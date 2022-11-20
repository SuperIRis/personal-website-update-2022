"use strict";

//import PROJECTS from "../../data/projects.js";
import { getProjects, preloadImage } from "../lib/Utils.js";
import ScrollMonitor from "../vendor/scrollMonitor.js";
import AnimatedJsonSprite from "../lib/AnimatedJsonSprite.js";
import EventfulClass from "../lib/EventfulClass.js";
import { trackEvent } from "../lib/Utils.js";

const PROJECTS = [];
class Home extends EventfulClass {
	init(language) {
		this.setHomeAnimation();
		getProjects(language).then((projects) => {
			this.projects = projects.filter((project) => project.images && project.images.home);
			this.setProjects();
		});
		document.getElementById("home-down-btn").addEventListener("click", this.onScrollToProjects);
	}

	onScrollToProjects() {
		const introHeight = document.getElementById("intro-container").offsetHeight + 86;
		window.scrollTo({ top: introHeight, behavior: "smooth" });
	}

	setHomeAnimation() {
		const homeSprites = ["libro", "normal", "ds"];
		const currentSprite = homeSprites[Math.floor(Math.random() * homeSprites.length)];
		this.homeMe = new AnimatedJsonSprite(
			"spritesheets/homes-" + currentSprite + ".png",
			document.getElementById("me"),
			{ loop: true, frameRate: 40 }
		);
		this.homeMe.start();
	}

	setProjects() {
		const allProjectNodes = document.querySelectorAll("#projects-preview-list li");
		this.loadedProjects = 0;
		allProjectNodes.forEach(this.populateProjectData.bind(this));
	}

	populateProjectData(projectNode, projectIndex) {
		projectNode.querySelector(".project-title").innerHTML = this.projects[projectIndex].name;
		projectNode.querySelector(".project-tech").innerHTML = this.projects[projectIndex].tech;
		projectNode
			.querySelector("a")
			.setAttribute("data-project", this.projects[projectIndex].stringID);
		projectNode.querySelector("a").addEventListener("click", this.onProjectClick.bind(this));

		preloadImage("images/projects/" + this.projects[projectIndex].images.home).then(() => {
			this.onProjectImageLoaded(projectNode, projectIndex);
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

	onProjectClick(e) {
		e.preventDefault();
		this.homeMe.stop();
		this.trigger("openProject", e.currentTarget.getAttribute("data-project"));
		//trackEvent("home-project", "click", e.currentTarget.querySelector(".project-title").innerHTML);
	}

	destroy() {
		this.homeMe = null;
		this.projectsWatcher.destroy();
		this.loadedProjects = 0;
	}
}

const homeSingleton = new Home();
export default homeSingleton;
