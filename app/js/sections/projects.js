"use strict";

import PROJECTS from "../../data/projects.js";
import EventfulClass from "../lib/EventfulClass.js";

class Projects extends EventfulClass {
	init() {
		this.list = [];
		this.orderDisplayByImportance();
		this.setProjects();
		document
			.getElementById("projects-list")
			.addEventListener("click", this.onGoToProject.bind(this));
	}
	orderDisplayByImportance() {
		let inRow = 0;
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
		this.originalProject = document.querySelector(".project:first-child");
		this.originalProject.remove();
		const projectsList = document.getElementById("projects-list");
		projectsList.innerHTML = "";
		projectsList.remove();

		for (let i = 0; i < this.list.length; i++) {
			projectsList.append(this.createProject(this.list[i]));
		}
		document.getElementById("main-container").prepend(projectsList);
	}
	createProject(projectData) {
		const project = this.originalProject.cloneNode(true);
		project.querySelector("h1").innerHTML = projectData.client;
		project.querySelector("h2").innerHTML = projectData.name;
		project.querySelector("h3").innerHTML = projectData.tech;
		project.querySelector(".extra-info").innerHTML = projectData.participation;
		project.querySelector("a").setAttribute("href", "proyecto.html#" + projectData.stringID);
		project.querySelector("s2")?.classList.remove("s2");
		project.querySelector("s1")?.classList.remove("s1");
		project.classList.add("s" + projectData.importance);

		if (projectData.images.thumb) {
			project.style.backgroundImage = "url(images/projects/" + projectData.images.thumb + ")";
		}
		return project;
	}

	onGoToProject(e) {
		e.preventDefault();
		const project = e.target.closest(".project");
		if (project) {
			this.trigger("openProject", project.querySelector("a").getAttribute("href"));
		}
	}
	destroy() {}
}

const projectsSingleton = new Projects();
export default projectsSingleton;
