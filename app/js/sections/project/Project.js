"use strict";
import PROJECTS from "../../../data/projects.js";
import EventfulClass from "../../lib/EventfulClass.js";
import { bulkNodeAction, getProjectByStringID, trackView } from "../../lib/Utils.js";
import {
	slideImages,
	changeExtraBtnTxtToMinus,
	changeMinusBtnTxtToExtra,
} from "./ProjectVisualEffectsUtils.js";
import VideoHandler from "./VideoHandler.js";
class Project extends EventfulClass {
	init() {
		this.id = window.location.hash;
		this.nodes = this.getNodes();
		this.info = getProjectByStringID(this.id.substring(1), PROJECTS.projects);
		this.removeSetupNodes();
		this.addSetupEvents();

		if (!this.info) {
			window.location = "/";
		} else {
			this.populateData();
			trackView("Proyecto-" + this.info.client + "-" + this.info.name);
		}
	}
	getNodes() {
		const nodes = {};
		nodes.container = document.getElementById("main-container");
		nodes.name = document.getElementById("project-name");
		nodes.type = document.getElementById("project-type");
		nodes.typeLink = nodes.type.querySelector("a");
		nodes.listContainer = document.getElementById("project-list-container");
		nodes.list = document.getElementById("project-list");
		nodes.listItem = nodes.list.querySelector("li");
		nodes.gallery = document.getElementById("project-gallery");
		nodes.galleryItem = nodes.gallery.querySelector("li");
		nodes.extraInfo = document.getElementById("extra-info-sec");
		nodes.extraInfoBtn = document.getElementById("extra-info-sec-btn");
		nodes.nextBtn = document.getElementById("next-btn");
		nodes.lastBtn = document.getElementById("last-btn");
		nodes.closeBtn = document.getElementById("close-btn");
		nodes.year = document.getElementById("project-year");
		nodes.via = document.getElementById("project-via");
		nodes.participation = document.getElementById("project-participation");
		nodes.about = document.getElementById("project-about");
		nodes.technically = document.getElementById("project-technically");
		nodes.curious = document.getElementById("project-curious");
		nodes.galleryContainer = document.getElementById("project-gallery-container");
		nodes.fakeVideoContainer = document.getElementById("fake-video-container");
		nodes.video = document.getElementById("project-video");
		nodes.videoContainer = document.getElementById("video-container");
		nodes.overlay = document.getElementById("info-overlay");
		return nodes;
	}

	removeSetupNodes() {
		bulkNodeAction("remove", [
			this.nodes.type,
			this.nodes.list,
			this.nodes.listItem,
			this.nodes.gallery,
			this.nodes.galleryItem,
		]);
	}
	addSetupEvents() {
		this.nodes.extraInfoBtn.addEventListener("click", this.onExtraInfoClick.bind(this));
		this.nodes.nextBtn.addEventListener("click", this.onGoToProject.bind(this));
		this.nodes.lastBtn.addEventListener("click", this.onGoToProject.bind(this));
		this.nodes.closeBtn.addEventListener("click", this.onCloseProjects.bind(this));
	}

	populateData() {
		this.populateMainInfo();
		this.populateNavButtons();
		this.populateExtrainfo();
		this.populateFactsList();
		if (window.innerWidth < 770) {
			this.populateImages();
		}

		if (this.info.video && this.info.video.length > 5) {
			this.populateVideo();
		} else {
			this.populateVideoAlternative();
		}
	}

	populateMainInfo() {
		this.nodes.name.innerHTML = this.info.name;
		this.nodes.type.innerHTML = this.info.type;
		if (this.info.urls[0]) {
			this.nodes.typeLink.setAttribute("href", this.info.urls[0]);
			this.nodes.type.append(this.nodes.typeLink);
		}
		this.nodes.videoContainer.style.backgroundImage =
			"url(images/projects/" + this.info.images.detail[0] + ")";
	}

	populateNavButtons() {
		this.nodes.lastBtn.setAttribute("data-id", this.info.lastProject.stringID);
		this.nodes.lastBtn.querySelector(".title").innerHTML = this.info.lastProject.name;
		this.nodes.nextBtn.setAttribute("data-id", this.info.nextProject.stringID);
		this.nodes.nextBtn.querySelector(".title").innerHTML = this.info.nextProject.name;
	}

	populateExtrainfo() {
		this.nodes.year.innerHTML = "Año: " + this.info.year;
		this.nodes.via.innerHTML = "Vía: " + this.info.via;
		this.nodes.participation.innerHTML = "Lo que yo hice: " + this.info.participation;
		this.nodes.about.innerHTML = this.info.about.replace(/\n/g, "</p><p>");
		this.nodes.technically.innerHTML = this.info.technically;
		this.nodes.curious.innerHTML = this.info.curious;
	}

	populateFactsList() {
		let dataListItemTemp;
		for (let i = 0; i < this.info.list.length; i++) {
			dataListItemTemp = this.nodes.listItem.cloneNode(true);
			dataListItemTemp.querySelector("i").classList.add("fa-" + this.info.list[i].icon);
			dataListItemTemp.append(this.info.list[i].info);
			this.nodes.list.append(dataListItemTemp);
		}
		this.nodes.listContainer.append(this.nodes.list);
	}

	populateImages() {
		let imageListItemTemp;
		for (let i = 0; i < this.info.images.detail.length; i++) {
			imageListItemTemp = this.nodes.galleryItem.cloneNode(true);
			imageListItemTemp
				.querySelector("img")
				.setAttribute("src", "images/projects/" + this.info.images.detail[i]);
			this.nodes.gallery.append(imageListItemTemp);
		}
		this.nodes.galleryContainer.append(this.nodes.gallery);
	}

	populateVideo() {
		this.videoId = this.info.video.substr(this.info.video.indexOf("embed/") + 6);
		this.videoHandler = new VideoHandler(this.nodes.videoContainer, this.videoId);
		this.nodes.fakeVideoContainer.setAttribute(
			"src",
			"images/projects/" + this.info.images.detail[0] + ""
		);
		this.nodes.fakeVideoContainer.classList.remove("hidden");
	}

	populateVideoAlternative() {
		this.nodes.fakeVideoContainer.classList.add("hidden");
		this.nodes.videoContainer.classList.add("video-container");
		if (window.innerWidth >= 770) {
			slideImages(this.nodes.videoContainer, this.nodes.container, this.info.images.detail);
		}
	}

	onExtraInfoClick(e) {
		const button = e.currentTarget;
		if (button.disabled) {
			return;
		}

		button.disabled = true;
		if (this.nodes.extraInfo.classList.contains("unshown")) {
			this.nodes.overlay.classList.remove("hidden");
			changeExtraBtnTxtToMinus(this.nodes.extraInfoBtn);
			setTimeout(() => {
				this.nodes.overlay.classList.remove("unshown");
			}, 100);
			//if($(window).width()>700){
			setTimeout(() => {
				this.nodes.extraInfo.classList.remove("unshown");
				button.disabled = false;
			}, 500);
			//}
			//else{
			//	$("#extra-info-sec").removeClass("unshown");
			//}
		} else {
			this.nodes.extraInfo.classList.add("unshown");

			changeMinusBtnTxtToExtra(this.nodes.extraInfoBtn);
			setTimeout(() => {
				this.nodes.overlay.classList.add("unshown");
			}, 500);
			setTimeout(() => {
				this.nodes.overlay.classList.add("hidden");
				button.disabled = false;
			}, 1000);
		}
	}

	onGoToProject(e) {
		this.trigger("load", "proyecto.html#" + e.currentTarget.getAttribute("data-id"));
	}
	onCloseProjects(e) {
		e.currentTarget.setAttribute("href", "proyectos.html");
		this.trigger("unload");
		//onOpenSection(e);
	}
	destroy() {
		/*$("#next-btn, #last-btn").off();
		this.nodes.extraInfoBtn.off();
		$("#close-btn").off();
		$("#main-menu").off("click", "a");*/
		clearInterval(this.sliderInterval);
	}
}

const projectSingleton = new Project();
export default projectSingleton;
