"use strict";
import EventfulClass from "../../lib/EventfulClass.js";
import { getProjects } from "../../lib/Utils.js";
import {
	bulkNodeAction,
	getProjectByStringID,
	isDesktop,
	throttle,
	appearOutphased,
} from "../../lib/Utils.js";
import {
	slideImages,
	changeExtraBtnTxtToMinus,
	changeMinusBtnTxtToExtra,
} from "./ProjectVisualEffectsUtils.js";
import VideoHandler from "./VideoHandler.js";
class Project extends EventfulClass {
	init(language) {
		this.id = window.location.hash;
		getProjects(language).then((projects) => {
			this.info = getProjectByStringID(this.id.substring(1), projects);
			if (!this.info) {
				window.location = "/";
				return;
			}
			this.populateData();
		});
		this.isDesktop = isDesktop();
		this.nodes = this.getNodes();
		this.removeSetupNodes();
		this.addSetupEvents();

		//trackView("Proyecto-" + this.info.client + "-" + this.info.name);
	}
	getNodes() {
		const nodes = {};
		nodes.container = document.querySelector(".project-container");
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
			this.nodes.typeLink,
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

	hasVideo() {
		return this.info.video && this.info.video.length > 5;
	}

	shouldShowVideo() {
		return isDesktop();
	}

	populateData() {
		this.populateMainInfo();
		this.populateNavButtons();
		this.populateExtrainfo();
		this.populateFactsList();
		this.populateImagesOrVideo();

		this.throttledResize = throttle(this.onResize.bind(this));
		window.addEventListener("resize", this.throttledResize);
	}

	populateMainInfo() {
		this.nodes.name.innerHTML = this.info.name;
		this.nodes.type.innerHTML = this.info.type;

		if (this.info.urls[0]) {
			this.nodes.typeLink.setAttribute("href", this.info.urls[0]);
			this.nodes.type.append(this.nodes.typeLink);
		}
	}

	populateNavButtons() {
		this.nodes.lastBtn.setAttribute("data-id", this.info.lastProject.stringID);
		this.nodes.lastBtn.querySelector(".title").innerHTML = this.info.lastProject.name;
		this.nodes.nextBtn.setAttribute("data-id", this.info.nextProject.stringID);
		this.nodes.nextBtn.querySelector(".title").innerHTML = this.info.nextProject.name;
	}

	populateExtrainfo() {
		this.nodes.year.innerHTML = this.info.year;
		this.nodes.via.innerHTML = this.info.via;
		this.nodes.participation.innerHTML = this.info.participation;
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
			imageListItemTemp.classList.add("unshown");
			imageListItemTemp
				.querySelector("img")
				.setAttribute("src", "images/projects/" + this.info.images.detail[i]);
			this.nodes.gallery.append(imageListItemTemp);
		}
		appearOutphased(this.nodes.gallery.children, 1000);
		this.nodes.galleryContainer.append(this.nodes.gallery);
	}

	populateImageBackground() {
		this.nodes.fakeVideoContainer.setAttribute(
			"src",
			"images/projects/" + this.info.images.detail[0] + ""
		);
		this.nodes.fakeVideoContainer.classList.add("unshown");
		this.nodes.fakeVideoContainer.classList.remove("hidden");
		setTimeout(() => {
			this.nodes.fakeVideoContainer.classList.remove("unshown");
		}, 100);
	}

	populateVideo() {
		this.videoId = this.info.video.substr(this.info.video.indexOf("embed/") + 6);
		this.videoHandler = new VideoHandler(this.nodes.videoContainer, this.videoId);
	}

	populateVideoAlternative() {
		this.nodes.fakeVideoContainer.classList.add("hidden");
		this.nodes.videoContainer.classList.add("video-container");
		this.sliderInterval = slideImages(
			this.nodes.videoContainer,
			this.nodes.container,
			this.info.images.detail
		);
	}

	populateImagesOrVideo() {
		if (this.hasVideo() && this.shouldShowVideo()) {
			this.populateVideo();
		} else if (this.shouldShowVideo()) {
			this.populateVideoAlternative();
		} else {
			this.populateImages();
			this.populateImageBackground();
		}
	}

	onResize() {
		if (this.isDesktop !== isDesktop()) {
			this.destroyVideo();
			this.destroyImageSlider();
			this.nodes.gallery.innerHTML = "";
			this.populateImagesOrVideo();
			this.isDesktop = isDesktop();
		}
	}

	onExtraInfoClick(e) {
		const button = e.currentTarget;
		if (button.disabled) {
			return;
		}

		button.disabled = true;
		if (this.nodes.extraInfo.classList.contains("unshown")) {
			this.showExtraInfo(button);
		} else {
			this.hideExtraInfo(button);
		}
	}

	showExtraInfo(button) {
		this.nodes.overlay.classList.remove("hidden");
		this.nodes.extraInfo.classList.remove("hidden");
		const extraInfoTop = this.nodes.extraInfo.offsetTop;

		changeExtraBtnTxtToMinus(this.nodes.extraInfoBtn);
		setTimeout(() => {
			this.nodes.overlay.classList.remove("unshown");
			window.scrollTo({ top: extraInfoTop, behavior: "smooth" });
		}, 100);
		setTimeout(() => {
			this.nodes.extraInfo.classList.remove("unshown");
			button.disabled = false;
		}, 500);
	}

	hideExtraInfo(button) {
		this.nodes.extraInfo.classList.add("unshown");
		window.scrollTo({ top: 0, behavior: "smooth" });
		changeMinusBtnTxtToExtra(this.nodes.extraInfoBtn);
		setTimeout(() => {
			this.nodes.overlay.classList.add("unshown");
		}, 500);
		setTimeout(() => {
			isDesktop() && this.nodes.overlay.classList.add("hidden");
			this.nodes.extraInfo.classList.add("hidden");
			button.disabled = false;
		}, 1000);
	}

	onGoToProject(e) {
		this.trigger("openProject", e.currentTarget.getAttribute("data-id"));
	}
	onCloseProjects(e) {
		e.currentTarget.setAttribute("href", "proyectos.html");
		this.trigger("openProjects");
	}
	destroy() {
		this.destroyVideo();
		this.destroyImageSlider();
		window.removeEventListener("resize", this.throttledResize);
	}
	destroyVideo() {
		this.videoHandler?.destroy();
	}
	destroyImageSlider() {
		clearInterval(this.sliderInterval);
	}
}

const projectSingleton = new Project();
export default projectSingleton;
