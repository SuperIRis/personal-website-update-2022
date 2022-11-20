"use strict";

import EventfulClass from "../lib/EventfulClass.js";
import { getProjects } from "../lib/Utils.js";

class Projects extends EventfulClass {
	init(language) {
		this.list = [];
		this.language = language;
		this.projects = getProjects(language).then((projects) => {
			this.projects = projects;
			this.orderDisplayByImportance();
			this.setProjects();
		});
		document
			.getElementById("projects-list")
			.addEventListener("click", this.onGoToProject.bind(this));
	}
	orderDisplayByImportance() {
		let inRow = 0;
		for (let i = 0; i < this.projects.length; i++) {
			inRow += this.projects[i].importance;
			if (inRow > 4) {
				inRow = 0;
				this.list.push(this.getProjectByImportance(1, i));
				i--;
			} else {
				if (inRow === 4) {
					inRow = 0;
				}
				this.list.push(this.projects[i]);
			}
		}
	}
	getProjectByImportance(importance, startIndex) {
		for (let i = startIndex, limit = this.projects.length; i < limit; i++) {
			if (importance === this.projects[i].importance) {
				return this.projects.splice(i, 1)[0];
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
		project.setAttribute("data-project", projectData.stringID);
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
			console.log(project);
			this.trigger("openProject", project.getAttribute("data-project"));
		}
	}
	destroy() {}
}

const projectsSingleton = new Projects();
export default projectsSingleton;
