var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(); // Load all gulp plugins
                                              // automatically and attach
                                              // them to the `plugins` object

var runSequence = require('run-sequence');    // Temporary solution until gulp 4
                                              // https://github.com/gulpjs/gulp/issues/355

var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var pkg = require('./package.json');
var dirs = pkg['h5bp-configs'].directories;

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('archive:create_archive_dir', function () {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
});

gulp.task('archive:zip', function (done) {

    var archiveName = path.resolve(dirs.archive, pkg.name + '_v' + pkg.version + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {

        var filePath = path.resolve(dirs.dist, file);

        // `archiver.bulk` does not maintain the file
        // permissions, so we need to add files individually
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath)
        });

    });

    archiver.pipe(output);
    archiver.finalize();

});

gulp.task('clean', function (done) {
    require('del')([
        dirs.archive,
        dirs.dist
    ], done);
});

gulp.task('copy', [
    'copy:.htaccess',
    'copy:index.html',
    'copy:jquery',
    // 'copy:main.css', Commenting it out. We serve minified version of CSS file without comments anyway but it would be good to respect all the hard work that h5bp team did so maybe a good idea would be to put banner text in the minified version?
    'copy:misc',
    'copy:normalize'
]);

gulp.task('copy:.htaccess', function () {
    return gulp.src('node_modules/apache-server-configs/dist/.htaccess')
               .pipe(plugins.replace(/# ErrorDocument/g, 'ErrorDocument'))
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:index.html', function () {
    return gulp.src(dirs.src + '/index.html')
               .pipe(plugins.replace(/{{JQUERY_VERSION}}/g, pkg.devDependencies.jquery))
               .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:jquery', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
               .pipe(plugins.rename('jquery-' + pkg.devDependencies.jquery + '.min.js'))
               .pipe(gulp.dest(dirs.dist + '/js/vendor'));
});

gulp.task('copy:main.css', function () {
    var banner = '/*! HTML5 Boilerplate v' + pkg.version +
                    ' | ' + pkg.license.type + ' License' +
                    ' | ' + pkg.homepage + ' */\n\n';

    return gulp.src(dirs.src + '/css/main.css')
               .pipe(plugins.header(banner))
               .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        dirs.src + '/**/*',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/css/main.css',
        '!' + dirs.src + '/index.html',
        '!' + dirs.src + '/js/main.js'

    ], {

        // Include hidden files by default
        dot: true

    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:normalize', function () {
    return gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('lint:js', function () {
    return gulp.src([
        'gulpfile.js',
        dirs.src + '/js/*.js',
        dirs.test + '/*.js',
        // Exclude the following files
        '!' + dirs.src + '/js/main.min.js'
    ]).pipe(plugins.jscs())
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.jshint.reporter('fail'));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(dirs.src + '/js/**/main.js')
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dirs.src + '/js'))
        .pipe(plugins.notify({ message: 'Scripts task completed' }));
});

// Styles
gulp.task('styles', function() {
    return gulp.src(dirs.src + '/less/main.less')
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer())
        // .pipe(gulp.dest(dirs.src + '/css'))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(dirs.src + '/css'))
        .pipe(reload({ stream:true }))
        .pipe(plugins.notify({ message: 'Styles task completed' }));
});

// BrowserSync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync.init(['./dist/styles/*.css', './dist/scripts/*.js', './dist/*.html'], {
        server: {
            baseDir: './dist'
        }
    });
});

// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Remove main.css + min and main.min.js from the src folder
gulp.task('clean-src', function (done) {
    require('del')([
        dirs.src + '/css',
        dirs.src + '/js/main.min.js'
    ], done);
    // del(['tmp/*.js', '!tmp/unicorn.js'], function (err, deletedFiles) {
    // });
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

// Watch
gulp.task('watch', function () {
    // Watch .less files
    gulp.watch(dirs.src + '/less/**/*.less', ['styles']);

    // Watch .js files
    gulp.watch(dirs.src + '/js/**/*.js', ['scripts']);

    // Watch .html files
    gulp.watch(dirs.src + '/*.html', ['copy:index.html', 'bs-reload']);
});

// Archive
gulp.task('archive', function (done) {
    runSequence(
        'build',
        'archive:create_archive_dir',
        'archive:zip',
    done);
});

// Build
gulp.task('build', function (done) {
    runSequence(
        ['clean', 'lint:js', 'styles', 'scripts'],
        'copy', 'clean-src',
    done);
});

// Dev
gulp.task('dev', function (done) {
    runSequence(
        ['clean', 'lint:js', 'styles', 'scripts', 'browser-sync', 'watch'],
        'copy', 'clean-src',
    done);
});

// Default
gulp.task('default', ['build']);
