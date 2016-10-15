var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var babel = require('gulp-babel');
var loadPlugins = require('gulp-load-plugins');
var del = require('del');

// Load all of our Gulp plugins
var $ = loadPlugins();

gulp.task('build', ['clean'], function () {

  // Copy static
  gulp.src('./src/**/*.json')
  .pipe(gulp.dest("dist"));

  // Copy public into dist
  gulp.src('./public/**/*.*')
  .pipe(gulp.dest("dist/public"));

  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015','stage-2']
    }))
    .pipe(gulp.dest("dist"));
});

gulp.task('clean', function(){
  del.sync(['./dist','./dist.zip']);
});

// Watch files
gulp.task('watch', ['build'], function() {
  nodemon({
    script: './dist/index.js',
    ext: 'js html',
    ignore: ["dist/*"],
    tasks:  ['build'],
    env: { 'NODE_ENV': 'local'}
  });
});

gulp.task('default', ['watch']);
