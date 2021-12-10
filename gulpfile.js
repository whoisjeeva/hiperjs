"use strict"

const gulp        = require("gulp")
const uglify      = require("gulp-uglify")
const babel       = require("gulp-babel")
const maps        = require("gulp-sourcemaps")
const rename      = require("gulp-rename")
const include     = require('gulp-include')
const browserify  = require("browserify")
const Babelify    = require("babelify")
const source      = require("vinyl-source-stream")
const buffer      = require('vinyl-buffer')
const rollupify   = require('rollupify')
const server      = require('gulp-webserver')



const dirs = {
    src: "./src/hiper.js",
    dest: "./dist"
}


gulp.task("transpile", () => {
    let pipeLine = browserify({
        entries: [dirs.src]
    })
    .transform(rollupify, {config: {}}) 
    .transform(Babelify, {presets: ["@babel/preset-env"]})
    .bundle()
    .pipe(source(dirs.src))
    .pipe(buffer())
    .pipe(maps.init())
    .pipe(rename("hiper.min.js"))
    .pipe(uglify())
    .pipe(maps.write(".maps"))
    
    pipeLine.pipe(gulp.dest(dirs.dest));
    return pipeLine
})

gulp.task('server', function() {
    gulp.src('.')
      .pipe(server({
        livereload: false,
        open: true,
        port: 3000
      }));
});


gulp.task("watch", gulp.parallel("transpile", "server", function() {
    gulp.watch(["src/*", "src/**/*"], gulp.series("transpile"));
}));

gulp.task("default", gulp.series("transpile"));