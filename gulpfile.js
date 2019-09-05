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
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var del = require("del");
var minify = require("gulp-minify");
var webp = require("gulp-webp");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("js", function () {
  return gulp.src("source/js/**/*.js")
    .pipe(minify({
      ext:{
        min:'.min.js'
      },
      ignoreFiles: ['picturefill.min.js', 'svgxuse.min.js']
    }))
    .pipe(gulp.dest("build/js"))
    .pipe(server.stream());
});

gulp.task("sprite", function () {
  return gulp.src("source/img/icons/*.svg")
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
    .pipe(gulp.dest("build/img"));
});

gulp.task("images", function () {
  return gulp.src("source/img/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("fonts", function () {
  return gulp.src("source/fonts/*.{woff,woff2}")
    .pipe(gulp.dest("build/fonts"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/js/**/*.js", gulp.series("js"));
  gulp.watch("source/img/*.{png,jpg,svg}", gulp.series("images"));
  gulp.watch("source/img/*.{png,jpg}", gulp.series("webp"));
  gulp.watch("source/img/icons/*.svg", gulp.series("sprite"));
  gulp.watch("source/*.html").on("change", gulp.series("html", "refresh"));
});

gulp.task("clean", function () {
  return del("build")
})

gulp.task("refresh", function () {
  server.reload();
})

gulp.task("build", gulp.series("clean", "css", "js", "images", "webp", "sprite", "fonts", "html"));
gulp.task("start", gulp.series("build", "server"));
