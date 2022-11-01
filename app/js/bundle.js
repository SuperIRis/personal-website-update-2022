"use strict";

import Aboutme from "./sections/aboutme.js";
import AnimatedJsonSprite from "./lib/AnimatedJsonSprite.js";
import AnimatedLoader from "./lib/AnimatedLoader.js";
import Contact from "./sections/contact.js";
import Home from "./sections/home.js";
import Project from "./sections/project.js";
import Projects from "./sections/projects.js";
import { toggleClass } from "./lib/Utils.js";
const page = window.location.pathname.substring(1).replace(/.html/g, "");
let current;
function onToggleMobileMenu(e) {
  toggleClass(e.currentTarget, "active");
  toggleClass(document.getElementById("main-container"), "mobile-menu-on");
  toggleClass(document.getElementById("main-footer"), "mobile-menu-on");
}
function onOpenPopup(e) {
  e.preventDefault();
  const url = $(e.currentTarget).attr("href");
  const popup = e.currentTarget.getAttribute("data-popup");
  const width = popup === "twitter" ? 550 : 500;
  const height = popup === "twitter" ? 400 : 320;
  const top = window.innerHeight / 2 - height / 2;
  const left = window.innerWidth / 2 - width / 2;
  window.open(url, popup, "width=" + width + ", height=" + height + ", left=" + left + ", top=" + top);
}
window.loadPage = function (page) {
  let ajaxLoaded = false;
  if (current) {
    current.destroy();
    ajaxLoaded = true;
  }
  console.log(page);
  /*switch (page) {
  	case "index":
  	case "/":
  	case "":
  		Home.init(ajaxLoaded);
  		current = Home;
  		break;
  	case "acerca":
  		Aboutme.init(ajaxLoaded);
  		current = Aboutme;
  		break;
  	case "contacto":
  		Contact.init(ajaxLoaded);
  		current = Contact;
  		break;
  	case "proyectos":
  		Projects.init(ajaxLoaded);
  		current = Projects;
  		break;
  	case "proyecto":
  		Project.init(ajaxLoaded);
  		current = Project;
  		break;
  	default:
  		if (page.indexOf("proyecto#") !== -1) {
  			Project.init();
  			current = Project;
  		} else {
  			console.warn("Se desconoce el html:", page);
  		}
  }*/
};

AnimatedLoader.init(new AnimatedJsonSprite("spritesheets/loader.png", document.getElementById("loader-me"), {
  loop: true,
  frameRate: 40,
  loopStartStep: 4,
  loopEndStep: 22
}));
window.initializeMap = function () {
  /*needed for async load of gm, not used*/
};
window.loadPage(page);
document.getElementById("mobile-menu").addEventListener("click", onToggleMobileMenu);
document.querySelector("[data-popup]").addEventListener("click", onOpenPopup);
document.querySelector(".preload").classList.remove("preload");
document.querySelector("[data-track]").addEventListener("click", function (e) {
  Utils.trackEvent("external-link", "click", e.target.getAttribute("data-track"));
});
window.addEventListener("load", function () {
  document.getElementById("loader").classList.add("unshown");
  AnimatedLoader.stop();
});