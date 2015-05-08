// load the plugins
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var copy = require('gulp-copy');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var mainBowerFiles = require('main-bower-files');
var imagemin = require('gulp-imagemin');
	var jpegtran = require('imagemin-jpegtran');
	var optipng = require('imagemin-optipng');
	var gifsicle = require('imagemin-gifsicle');
	var svgo = require('imagemin-svgo');

// var jshint = require('gulp-jshint');

// task for compiling less, minifying css, and creating .min file
gulp.task('css', function() {

	return gulp.src(['src/less/main.less'])
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(minifyCSS({
			keepSpecialComments: 0
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/css'));

});

// task to lint, minify, and concat frontend files
gulp.task('js', function() {
	return gulp.src([
			'src/vendor/jquery/dist/jquery.js',
			'src/vendor/bootstrap/dist/js/bootstrap.js',
			'src/vendor/slabText/js/jquery.slabtext.js',
			'src/js/**/*.js'
		])
		// .pipe(jshint())
		// .pipe(jshint.reporter('default'))
		.pipe(sourcemaps.init())
		.pipe(concat('all.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('js-ie', function() {
	return gulp.src([
			'src/vendor/respond/dest/respond.src.js',
			'src/vendor/html5shiv/dist/html5shiv.js'
		])
		.pipe(sourcemaps.init())
		.pipe(concat('ie.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/js'));
});

// task for linting js files
// gulp.task('js-lint', function() {
	// return gulp.src(['src/js/**/*.js'])
		// .pipe(jshint())
		// .pipe(jshint.reporter('default'));
// });

// Minify images and copy from src to dist
gulp.task('images', function () {
	return gulp.src('src/images/**/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [jpegtran(), optipng(), gifsicle(), svgo()]
		}))
		.pipe(gulp.dest('dist/images'));
});

// Minify favicons and copy from src to dist
gulp.task('favicons', function () {
	return gulp.src('src/favicons/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [optipng()]
		}))
		.pipe(gulp.dest('dist/favicons'));
});

// Copy Fonts from src to dist
gulp.task('fonts', ['fonts-custom', 'fonts-bootstrap']);

	gulp.task('fonts-custom', function() {
		gulp.src(['src/fonts/*'])
			.pipe(copy('dist/fonts', {
				prefix: 2
			}));
	});

	gulp.task('fonts-bootstrap', function() {
		gulp.src(['src/vendor/bootstrap/fonts/*'])
			.pipe(copy('dist/fonts', {
				prefix: 4
			}));
	});

// Copy main Bower files from src to dist
gulp.task('mainBowerFiles', function moveBowerDeps() {
  return gulp.src(mainBowerFiles(), { base: 'src/vendor' })
	  .pipe(gulp.dest('dist/vendor'));
});

// Watch for js & css file changes
gulp.task('watch', function() {

	// watch the less
	gulp.watch(['src/**/*.less', 'src/**/*.css'], ['css']);

	// watch js files
	gulp.watch(['src/js/*.js', 'src/js/**/*.js'], ['js']);
});

// defining the main gulp task
gulp.task('default', ['css', 'js']);