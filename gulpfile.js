var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
const image = require('gulp-image');
const del = require('del');
const nunjucks = require('gulp-nunjucks');
const njkRender = require('gulp-nunjucks-render');
const prettify = require('gulp-html-prettify');

var input = './src/assets/scss/*.scss';
var output = './public/assets/css';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ['last 3 versions', 'IE 9', 'IE 10', 'IE 11']
};

gulp.task('serve', ['sass', 'image', 'nunjucks'], function() {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });

    gulp.watch("./src/assets/scss/**/*.scss", ['sass']);
    gulp.watch("./src/assets/img/**", function() {
        gulp.run('image');
        browserSync.realod;
    })
	gulp.watch('./src/app/**/*.html', ['nunjucks']).on('change', browserSync.reload);
});

gulp.task('image', ['clean:image'], function () {
    return gulp.src('./src/assets/img/**')
        .pipe(image())
        .pipe(gulp.dest('./public/assets/img'));
});

gulp.task('clean:image', function() {
    return del(['./public/assets/img/**', '!public/assets/img'], {force:true})
});

gulp.task('sass', function() {
    return gulp
        .src(input)
        // .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        // .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(output))
        .pipe(browserSync.stream());
});

gulp.task('nunjucks', () => {
    return gulp.src('./src/app/**/*.html')
        .pipe(prettify({
            indent_size : 4
        }))
        .pipe(njkRender({
            path: ['./src/app/']
        }))
        .pipe(gulp.dest('./public'));
});

gulp.task('watch', function() {
  return gulp
    .watch(input, ['sass'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['serve']);

gulp.task('prod', function () {
  return gulp
    .src(input)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(output));
});
