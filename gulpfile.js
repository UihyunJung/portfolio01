"use strict";

// Load plugins
const {task, src, dest, watch, series, parallel} = require("gulp");
const browserSync = require("browser-sync").create();
const del = require("del");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-image");
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const eslint = require("gulp-eslint");
const includer = require("gulp-html-ssi");
const rev = require("gulp-rev");
const revReplace = require("gulp-rev-replace");
const revNapkin = require("gulp-rev-napkin");
const gulpSeo = require('gulp-seo');

// paths setting
var paths = {
  build: "./dist/",
  scss: {
    src: "./markup/assets/css/scss/**/*",
    ignore: "!./markup/assets/css/scss/import",
    dest: "./dist/assets/css"
  },
  csscopy: {
    src: "./markup/assets/css/plugin/**/*",
    dest: "./dist/assets/css/plugin"
  },
  img: {
    src: "./markup/assets/img/**/*",
    dest: "./dist/assets/img"
  },
  js: {
    src: "./markup/assets/js/**/*",
    dest: "./dist/assets/js"
  },
  fonts: {
    src: "./markup/assets/fonts/**/*",
    dest: "./dist/assets/fonts"
  },
  html: {
    src: "./markup/html/**/*",
    ignore: "!./markup/html/include",
    dest: "./dist"
  },
  json: {
    src: "./markup/assets/data/**/*",
    dest: "./dist/assets/data"
  }
}

// A simple task to reload the page
async function reload(done) {
  browserSync.reload();
  done();
}

// Clean assets
async function clean(cb) {
  return del(paths.build, cb);
}

// Copying fonts
async function fonts() {
  return src(paths.fonts.src)
    .pipe(dest(paths.fonts.dest))
}

// Copying json
async function json() {
  return src(paths.json.src)
    .pipe(dest(paths.json.dest))
}

// Optimize Images
async function images() {
  return src(paths.img.src)
    .pipe(dest(paths.img.dest))
}

// Optimize Images
async function optImg() {
  return src([paths.img.src, "!./markup/assets/img/**/*.svg"])
    .pipe(imagemin())
    .pipe(dest(paths.img.dest))
}

// SCSS task
var sassOptions = {
  outputStyle: "compact",
  indentType: "tab",
  indentWidth: 1,
  precision: 2,
  sourceComments: false
};
async function scss() {
  return src([paths.scss.src, paths.scss.ignore])
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass(sassOptions).on("error", sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(sourcemaps.write("./maps"))
  .pipe(dest(paths.scss.dest))
  .pipe(browserSync.reload({stream: true}))
}

// Plug-in CSS copy
async function csscopy() {
  return src(paths.csscopy.src)
    .pipe(dest(paths.csscopy.dest))
    .pipe(browserSync.reload({stream: true}))
}

// Transpile, concatenate and minify scripts
var lintOptions = {
  fix:true,
  globals:["jQuery", "$"],
  rules:{
    quotes: [1, "double"],
    semi: [1, "always"],
    indent:[1, "tab"]
  },
  extends: "eslint:recommended",
  env: {
    commonjs: true,
    es6: true,
    node: true,
    browser: true,
    jquery:true
  }
}
async function scripts() {
  return src(paths.js.src)
    .pipe(plumber())
    .pipe(eslint(lintOptions))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(dest(paths.js.dest))
}

// HTML SSI(Server Side Include) & SEO
async function htmlssi() {
  return src([paths.html.src, paths.html.ignore])
    .pipe(includer())
    // .pipe(gulpSeo({
    //   list: ['og', 'se', 'schema', 'twitter'],
    //   meta: {
    //       title: 'Title website',
    //       description: 'Description website',
    //       author: 'Lorem Ipsum',
    //       keywords: ['website', 'with', 'meta', 'tags'],
    //       robots: {
    //           index: false, // true
    //           follow: true // true
    //       },
    //       revisitAfter: '5 month', // 3 month
    //       image: '/assets/img/sample.jpg',
    //       site_name: 'My Website',
    //       type: 'website'
    //   }
    // }))
    .pipe(dest(paths.html.dest))
}

// server
async function server() {
  browserSync.init({
    server: {
      baseDir: paths.build,
      index: "/index.html"
    },
    port: 3000
  });
}

// watch files
async function watchFiles() {
  watch(paths.fonts.src, series(fonts, reload));
  watch(paths.img.src, series(images, reload));
  watch(paths.scss.src, scss);
  watch(paths.csscopy.src, csscopy);
  watch(paths.js.src, series(scripts, reload));
  watch(paths.html.src, series(htmlssi, reload));
  watch(paths.json.src, series(json, reload));
}

// revision css
async function revCss() {
  setTimeout(() => {
    return src(paths.scss.dest + "/*.css")
    .pipe(rev())
    .pipe(dest(paths.scss.dest))
    .pipe(revNapkin({verbose: false}))
    .pipe(rev.manifest())
    .pipe(dest(paths.scss.dest))
  }, 3000);
}

// revision update css
async function updateCss() {
  setTimeout(() => {
    var manifest = src(paths.scss.dest + "/rev-manifest.json", {allowEmpty:true});
    return src(paths.html.dest + "/**/*.html")
    .pipe(revReplace({manifest: manifest}))
    .pipe(dest(paths.html.dest))
  }, 10000);
}

// revision assets
async function revAssets() {
  setTimeout(() => {
    return src(paths.img.dest + "/**/*")
    .pipe(rev())
    .pipe(dest(paths.img.dest))
    .pipe(revNapkin({verbose: false}))
    .pipe(rev.manifest())
    .pipe(dest(paths.img.dest))
  }, 20000);
}

// revision update assets
async function updateAssets() {
  setTimeout(() => {
    var manifest = src(paths.img.dest + "/rev-manifest.json", {allowEmpty:true});
    return src(paths.build + "/**/*")
    .pipe(revReplace({manifest: manifest}))
    .pipe(dest(paths.build))
  }, 25000);
}

// define complex tasks
const revAll = series(revCss, updateCss, revAssets, updateAssets);
const web = parallel(fonts, json, images, scss, csscopy, scripts, htmlssi);
const build = series(clean, web);
const buildRev = series(clean, web, revAll);

// export tasks
exports.reload = reload;
exports.clean = clean;
exports.fonts = fonts;
exports.json = json;
exports.images = images;
exports.optImg = optImg;
exports.scss = scss;
exports.csscopy = csscopy;
exports.scripts = scripts;
exports.htmlssi = htmlssi;
exports.server = server;
exports.watchFiles = watchFiles;
exports.web = web;
exports.revCss = revCss;
exports.updateCss = updateCss;
exports.revAssets = revAssets;
exports.updateAssets = updateAssets;
exports.revAll = revAll;
exports.build = build;
exports.buildRev = buildRev;
exports.default = series(clean, web, parallel(server, watchFiles));
