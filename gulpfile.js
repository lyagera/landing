const callBind = require("call-bind");
const gulp = require("gulp");
const browserSync = require("browser-sync").create();

const { src, dest } = require("gulp");
const pug = require("gulp-pug");

// import dartSass from "sass";
// import gulpSass from "gulp-sass";
// const sass = gulpSass(dartSass);
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");

const spritesmith = require("gulp.spritesmith");

const rimraf = require("rimraf");

const autoprefixer = require("gulp-autoprefixer");

// var plugin1 = require("gulp-plugin1");
// var plugin2 = require("gulp-plugin2");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("server", function () {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build",
        },
    });
    gulp.watch("build/**/*").on("change", browserSync.reload);
});

gulp.task("templates:compile", function buildHTML() {
    return gulp
        .src("source/template/index.pug")
        .pipe(
            pug({
                pretty: true,
            })
        )
        .pipe(gulp.dest("build"));
});
gulp.task("styles:compile", function buildStyles() {
    return gulp
        .src("source/styles/main.scss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest("build/css"));
});
function buildStyles() {
    return gulp
        .src("source/styles/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("build/css"));
}
exports.buildStyles = buildStyles;
exports.watch = function () {
    gulp.watch("source/styles/main.scss", ["sass"]);
};

gulp.task("sprite", function (cb) {
    var spriteData = gulp.src("source/img/*.png").pipe(
        spritesmith({
            imgName: "sprite.png",
            imgPath: "./source/img/sprite.png",
            cssName: "sprite.css",
        })
    );
    spriteData.img.pipe(gulp.dest("build/img/"));
    spriteData.css.pipe(gulp.dest("source/styles/global/"));
    cb();
    // return spriteData.pipe(gulp.dest("path/to/output/"));
});

gulp.task("clean", function del(cb) {
    return rimraf("build", cb);
});

gulp.task("copy:img", function () {
    return gulp.src("source/img/**/*.*").pipe(gulp.dest("build/img"));
});
gulp.task("copy:fonts", function () {
    return gulp.src("source/fonts/**/*.*").pipe(gulp.dest("build/fonts"));
});
gulp.task("copy", gulp.parallel("copy:fonts", "copy:img"));

gulp.task("watch", function () {
    gulp.watch("source/template/**/*.pug", gulp.series("templates:compile"));
    gulp.watch("source/styles/**/*.scss", gulp.series("styles:compile"));
});
gulp.task(
    "default",
    gulp.series(
        "clean",
        gulp.parallel("templates:compile", "styles:compile", "sprite", "copy"),
        gulp.parallel("watch", "server")
    )
);
// exports.default = () =>
//     gulp
//         .src("source/styles/main.scss")
//         .pipe(
//             autoprefixer({
//                 cascade: false,
//             })
//         )
//         .pipe(gulp.dest("source/styles/"));
// function javascript() {
//     gulp.src("source/js/*.js")
//         .pipe(sourcemaps.init())
//         // .pipe(plugin1())
//         // .pipe(plugin2())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest("build/js/"));
// }

// exports.javascript = javascript;
