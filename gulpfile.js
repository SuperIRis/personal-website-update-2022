"use strict";

// Include Gulp & Tools We'll Use
const uglify = require("gulp-uglify");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
const { series, dest, src, parallel, watch } = require("gulp");

const buildDir = "../superiris.github.io";

function browserSyncServe() {
	browserSync.init({
		server: {
			baseDir: "./app",
		},
	});
	watch("app/**/!(bundle2)*.js").on("change", () => {
		processJSDev();
		browserSync.reload();
	});
	watch("./app/sass/**/*.scss").on("change", processCSSDev);
}

const processJSDev = () => {
	console.log("process JS");
	return src("./app/js/main.js")
		.pipe(babel())
		.pipe(rename("bundle2.js"))
		.pipe(dest("./app/js/", { overwrite: true }));
};

const processJSProd = () => {
	return src("./app/js/main.js")
		.pipe(babel())
		.pipe(uglify())
		.pipe(rename("bundle2.js"))
		.pipe(dest(buildDir + "/js/", { overwrite: true }));
};

const processCSSDev = () => {
	console.log("css");
	return src("./app/sass/main.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(dest("./app/css/"), { overwrite: true })
		.pipe(browserSync.stream({ match: "**/*.css" }));
};

const processCSSProd = () => {
	return src("./app/sass/**/*.scss")
		.pipe(sass.sync({ outputStyle: "compressed" }).on("error", sass.logError))
		.pipe(dest(buildDir + "/css/"), { overwrite: true })
		.pipe(browserSync.stream({ match: "**/*.css" }));
};

const copyHTML = () => src("./app/*.html").pipe(dest(buildDir + "/"));
const copyData = () => src("./app/data/*").pipe(dest(buildDir + "/data/"));
const copyJSVendor = () => src("./app/js/vendor/*.js").pipe(dest(buildDir + "/js/vendor/"));
const copyJSLib = () =>
	src("./app/js/lib/*.js")
		.pipe(uglify())
		.pipe(dest(buildDir + "/js/lib/"));
const copyJSSections = () =>
	src("./app/js/sections/**/*.js")
		.pipe(uglify())
		.pipe(dest(buildDir + "/js/sections/"));
const copyDocs = () => src("./app/docs/*").pipe(dest(buildDir + "/docs/"));
const copyIcon = () => src("./app/*.{ico,txt}").pipe(dest(buildDir + "/"));
const copySpritesheets = () => src("./app/spritesheets/*").pipe(dest(buildDir + "/spritesheets/"));
const optimizeImages = () =>
	src("./app/images/**/*.(png|jpg")
		.pipe(imagemin())
		.pipe(dest(buildDir + "/images"));
const copySVG = () => src("./app/images/*.svg").pipe(dest(buildDir + "/images/"));

exports.serve = series(processJSDev, processCSSDev, browserSyncServe);

exports.build = parallel(
	copyHTML,
	copyData,
	copyDocs,
	copySpritesheets,
	copyIcon,
	optimizeImages,
	copySVG,
	processCSSProd,
	processJSProd,
	copyJSVendor,
	copyJSLib,
	copyJSSections
);
