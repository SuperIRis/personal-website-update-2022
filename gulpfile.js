"use strict";

// Include Gulp & Tools We'll Use
/*var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var sass = require("gulp-ruby-sass");
//var del = require('del');
var runSequence = require("run-sequence");
var browserSync = require("browser-sync");
var pagespeed = require("psi");
var reload = browserSync.reload;
var fs = require("fs");
const browserify = require("gulp-browserify");
const buffer = require("vinyl-buffer");
const source = require("vinyl-source-stream");
*/
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
const { series, dest, src, parallel, watch } = require("gulp");

var AUTOPREFIXER_BROWSERS = [
	"ie >= 10",
	"ie_mob >= 10",
	"ff >= 30",
	"chrome >= 34",
	"safari >= 7",
	"opera >= 23",
	"ios >= 7",
	"android >= 4.4",
	"bb >= 10",
];

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
}

const processJSDev = () => {
	console.log("process JS");
	return src("./app/js/main.js")
		.pipe(babel())
		.pipe(rename("bundle2.js"))
		.pipe(dest("./app/js/", { overwrite: true }));
};

const copyHTML = () => src("./app/*.html").pipe(dest("./dist/"));

const copyData = () => src("./app/data/*").pipe(dest("./dist/data/"));
const copyDocs = () => src("./app/docs/*").pipe(dest("./dist/docs/"));
const copyIcon = () => src("./app/*.{ico,txt}").pipe(dest("./dist/"));
const copyServerCode = () => src("./app/process/*").pipe(dest("./dist/process/"));
const copySpritesheets = () => src("./app/spritesheets/*").pipe(dest("./dist/spritesheets/"));
const optimizeImages = () => src("./app/images/**/*").pipe(imagemin()).pipe(dest("./dist/images"));

exports.serve = series(processJSDev, browserSyncServe);

exports.build = series(
	copyHTML,
	copyData,
	copyDocs,
	copySpritesheets,
	copyIcon,
	copyServerCode,
	optimizeImages
);
