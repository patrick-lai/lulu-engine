var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var babel = require('gulp-babel');
var loadPlugins = require('gulp-load-plugins');
var del = require('del');
var webpack = require('webpack-stream');

// Load all of our Gulp plugins
var $ = loadPlugins();

gulp.task('build', ['clean','build-server','build-public']);

gulp.task('build-server', function () {

  // Copy static
  gulp.src('./src/**/*.json')
  .pipe(gulp.dest("dist"));

  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015','stage-2']
    }))
    .pipe(gulp.dest("dist"));
});

gulp.task('build-public', function () {

  // Copy non *.js public into dist
  gulp.src(['./public/**/*.*','!./public/**/*.js'])
    .pipe(gulp.dest("dist/public"));

  return gulp.src('./public/**/*.js')
      .pipe(webpack(require('./public/build/webpack.dev.config.js')))
      .pipe(gulp.dest('dist/public'));

  // Copy and babel js public into dist
  // return gulp.src('./public/**/*.js')
  //   .pipe(babel({
  //     presets: ['es2015','stage-2','react']
  //   }))
  //   .pipe(gulp.dest("dist/public"));
});

gulp.task('clean', function(){
  del.sync(['./dist','./dist.zip']);
});

gulp.task('webpack', function(){
  return gulp.src('src/entry.js')
    .pipe(webpack())
    .pipe(gulp.dest('dist/'));
})

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
