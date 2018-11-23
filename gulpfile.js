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
var csso = require('gulp-csso');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

var input = './src/assets/scss/*.scss';
var output = './public/assets/css';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ['last 3 versions', 'IE 9', 'IE 10', 'IE 11']
};

gulp.task('serve', ['sass', 'sass:min', 'image', 'nunjucks', 'js', 'js:watch'], function() {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });

    gulp.watch("./src/assets/scss/**/*.scss", ['sass']).on('change', browserSync.reload);
    gulp.watch(["./src/assets/js/**/*.js", "./src/assets/js/*.js"]).on('change', browserSync.reload);
    gulp.watch("./src/assets/img/**", function() {
        gulp.run('image');
        browserSync.realod;
    })
    // gulp.watch("./public/*.html").on('change', browserSync.reload);
	gulp.watch('./src/app/**/*.html', ['nunjucks']).on('change', browserSync.reload);
});


gulp.task('js', () => {
    gulp.src('./src/assets/js/main.js')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('./public/assets/js'));
});

gulp.task('js:watch', function () {
    gulp.watch('./src/assets/js/**/*.js', ['js']);
});

gulp.task('image:prod', ['clean:image'], function () {
    return gulp.src('./src/assets/img/**')
        .pipe(image())
        .pipe(gulp.dest('./public/assets/img'));
});

gulp.task('image', ['clean:image'], function () {
    return gulp.src('./src/assets/img/**')
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

gulp.task('sass:min', function() {
    // return gulp
    //     .src(input)
    //     .pipe(sass({ outputStyle: 'nested' }))
    //     .pipe(autoprefixer(autoprefixerOptions))
    //     .pipe(csso())
    //     .pipe(gulp.dest(`${output}`));
});
gulp.task('nunjucks', () => {
    return gulp.src('./src/app/**/*.html')
        .pipe(prettify({
            indent_size : 4 // размер отступа - 4 пробела
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

gulp.task('prod', ['image:prod']);