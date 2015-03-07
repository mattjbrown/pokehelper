/* global console */
/* global require */

function requireAndLog(name) {
  console.log('loading ' + name);
  return require(name);
}

var gulp = requireAndLog('gulp');
var concat = requireAndLog('gulp-concat');
var ngAnnotate = requireAndLog('gulp-ng-annotate');
var print = requireAndLog('gulp-print');
var uglify = requireAndLog('gulp-uglify');

var paths = {
  gulpfile: 'Gulpfile.js',
  html: {
    in: [
      'src/**/*.html'
    ],
    out: 'app'
  },
  js: {
    libraries: {
      in: [
        'src/scripts/bower_components/angular/angular.min.js',
        'src/scripts/bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'src/scripts/bower_components/jquery/dist/jquery.min.js'
      ]
    },
    pokehelper: {
      in: [
        'src/scripts/**/*.js',
        '!src/scripts/bower_components/**/*.js',
      ]
    },
    out: 'app/scripts'
  },
  css: {
    in: [
      'src/**/*.css'
    ],
    out: 'app/css'
  }
};


gulp.task('default', ['build']);

gulp.task('watch', ['build-watch']);

gulp.task('build', ['html', 'css', 'js']);

gulp.task('build-watch', ['build'], function () {
  gulp.watch(paths.html.in, ['html']);
  gulp.watch(paths.css.in, ['css']);
  gulp.watch(paths.js.libraries.in, ['js-libraries']);
  gulp.watch(paths.js.pokehelper.in, ['js-pokehelper']);
});

gulp.task('html', ['js', 'css'], function () {
  return gulp.src(paths.html.in)
    .pipe(logFileRead())
    .pipe(gulp.dest(paths.html.out))
    .pipe(logFileWrite());
});

gulp.task('css', function () {
  return gulp.src(paths.css.in)
    .pipe(logFileRead())
    .pipe(concat('global.css'))
    .pipe(gulp.dest(paths.css.out))
    .pipe(logFileWrite());
});

gulp.task('js', ['js-libraries', 'js-pokehelper']);

gulp.task('js-libraries', function () {
  return gulp.src(paths.js.libraries.in)
    .pipe(logFileRead())
    .pipe(concat('libraries.min.js'))
    .pipe(gulp.dest(paths.js.out))
    .pipe(logFileWrite());
});

gulp.task('js-pokehelper', function () {
  return gulp.src(paths.js.pokehelper.in)
    .pipe(logFileRead())
    .pipe(ngAnnotate())
    .on('error', printError)
    .pipe(concat('pokehelper.min.js'))
    .pipe(uglify())
    .on('error', printError)
    .pipe(gulp.dest(paths.js.out))
    .pipe(logFileWrite());
});

function printError(error) {
  console.error(error.message);

  this.emit('end');
}

function logFilenames(prefix) {
  return print(function (path) {
    return prefix + ' ' + path;
  });
}

function logFileRead() {
  return logFilenames("Read in:");
}

function logFileWrite() {
  return logFilenames("Created:"); 
}
