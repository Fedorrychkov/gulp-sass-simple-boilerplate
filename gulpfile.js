var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
const image = require('gulp-image');
const del = require('del');

var input = './src/assets/scss/*.scss';
var output = './public/assets/css';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ['last 3 versions', 'IE 9', 'IE 10', 'IE 11']
};

gulp.task('serve', ['sass', 'image'], function() {
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
    gulp.watch("./public/*.html").on('change', browserSync.reload);
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
