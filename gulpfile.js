"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgstore = require("gulp-svgstore");
var cheerio = require("gulp-cheerio");
var rename = require("gulp-rename");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("svg-sprite", function () {
  return gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(cheerio({
      run: function ($) {
        $('svg').attr('style', 'display: none;');
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest("source/img"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/icon-*.svg", gulp.series("svg-sprite"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("css", "svg-sprite", "server"));
