"use strict";

// Include Gulp & Tools We'll Use
const uglify = require("gulp-uglify");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
const { series, dest, src, parallel, watch } = require("gulp");

function browserSyncServe() {
	browserSync.init({
		server: {
			baseDir: "./app",
		},
	});
	watch("app/**/!(bundle)*.js").on("change", () => {
		processJSDev();
		browserSync.reload();
	});
	watch("./app/sass/**/*.scss").on("change", processCSSDev);
}

const processJSDev = () => {
	return src("./app/js/main.js")
		.pipe(babel())
		.pipe(rename("bundle2.js"))
		.pipe(dest("./app/js/", { overwrite: true }));
};

const processJSProd = () => {
	return src("./app/js/main.js")
		.pipe(babel())
		.pipe(rename("bundle2.js"))
		.pipe(uglify())
		.pipe(dest("./dist/js/", { overwrite: true }));
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
		.pipe(dest("./dist/css/"), { overwrite: true })
		.pipe(browserSync.stream({ match: "**/*.css" }));
};

const copyHTML = () => src("./app/*.html").pipe(dest("./dist/"));
const copyData = () => src("./app/data/*").pipe(dest("./dist/data/"));
const copyDocs = () => src("./app/docs/*").pipe(dest("./dist/docs/"));
const copyIcon = () => src("./app/*.{ico,txt}").pipe(dest("./dist/"));
const copyServerCode = () => src("./app/process/*").pipe(dest("./dist/process/"));
const copySpritesheets = () => src("./app/spritesheets/*").pipe(dest("./dist/spritesheets/"));
const optimizeImages = () => src("./app/images/**/*").pipe(imagemin()).pipe(dest("./dist/images"));

exports.serve = series(processJSDev, processCSSDev, browserSyncServe);

exports.build = parallel(
	copyHTML,
	copyData,
	copyDocs,
	copySpritesheets,
	copyIcon,
	copyServerCode,
	optimizeImages,
	processCSSProd,
	processJSProd
);
