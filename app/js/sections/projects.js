"use strict";

import PROJECTS from "../../data/projects.js";
import EventfulClass from "../lib/EventfulClass.js";

class Projects extends EventfulClass {
	init() {
		this.list = [];
		this.orderDisplayByImportance();
		this.setProjects();
		//$("#main-menu").on("click", "a", onOpenSection);
		document
			.getElementById("projects-list")
			.addEventListener("click", this.onGoToProject.bind(this));
	}
	orderDisplayByImportance() {
		let inRow = 0;
		//console.log(PROJECTS.projects[0].importance);
		for (let i = 0; i < PROJECTS.projects.length; i++) {
			inRow += PROJECTS.projects[i].importance;
			if (inRow > 4) {
				inRow = 0;
				this.list.push(this.getProjectByImportance(1, i));
				i--;
			} else {
				if (inRow === 4) {
					inRow = 0;
				}
				this.list.push(PROJECTS.projects[i]);
			}
		}
	}
	getProjectByImportance(importance, startIndex) {
		for (let i = startIndex, limit = PROJECTS.projects.length; i < limit; i++) {
			if (importance === PROJECTS.projects[i].importance) {
				return PROJECTS.projects.splice(i, 1)[0];
			}
		}
	}
	setProjects() {
		const originalProject = document.querySelector(".project:first-child");
		originalProject.remove();
		const projectsList = document.getElementById("projects-list");
		projectsList.innerHTML = "";
		projectsList.remove();
		let project;

		for (let i = 0; i < this.list.length; i++) {
			project = originalProject.cloneNode(true);
			project.querySelector("h1").innerHTML = this.list[i].client;
			project.querySelector("h2").innerHTML = this.list[i].name;
			project.querySelector("h3").innerHTML = this.list[i].tech;
			project.querySelector(".extra-info").innerHTML = this.list[i].participation;
			console.log("set href to ", this.list[i].stringID);
			project.querySelector("a").setAttribute("href", "proyecto.html#" + this.list[i].stringID);
			project.querySelector("s2")?.classList.remove("s2");
			project.querySelector("s1")?.classList.remove("s1");
			project.classList.add("s" + this.list[i].importance);

			if (this.list[i].images.thumb) {
				project.style.backgroundImage = "url(images/projects/" + this.list[i].images.thumb + ")";
			}
			projectsList.append(project);
		}
		document.getElementById("main-container").prepend(projectsList);
		//$(".project:first-child").detach();
	}
	onGoToProject(e) {
		e.preventDefault();
		e.stopPropagation();
		const project = e.target.closest(".project");
		if (project) {
			this.trigger("unload", { url: project.querySelector("a").getAttribute("href") });
		}
	}
	destroy() {
		//$("#projects-list").off("click", "a");
		//$("#main-menu").off("click", "a");
	}
}

/*function onOpenSection(e) {
	e.preventDefault();
	AnimatedLoader.loadSection($(e.currentTarget).attr("href"));
}*/
const projectsSingleton = new Projects();
export default projectsSingleton;
