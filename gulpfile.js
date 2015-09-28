
/* Gulp set up
--------------------------------------------------------------------------------- */

var gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    del     = require('del'),
    path    = require('path'),

    // load all plugins with prefix 'gulp'
    plugins = require('gulp-load-plugins')();


var paths = {
    dev     : 'dev/',
    build   : 'assets/'
};

var autoprefixOpts = {
    browsers: ['> 1%', 'last 10 versions', 'Firefox ESR', 'Opera 12.1']
};



/* Task: Watch HTML
--------------------------------------------------------------------------------- */

gulp.task('html_watch', function () {
    var srcToWatch = ['**/*.html', '**/*.php'];

    return gulp
        .src( srcToWatch )
        .pipe(plugins.watch( srcToWatch ))
        .pipe(plugins.livereload());
});



/* Task: Watch CSS
--------------------------------------------------------------------------------- */

gulp.task('css_watch', function () {
    var srcToWatch = paths.build + 'css/*.css';

    return gulp
        .src( srcToWatch )
        .pipe(plugins.watch( srcToWatch ))
        .pipe(plugins.livereload());
});



/* Task: Watch JS
--------------------------------------------------------------------------------- */

gulp.task('js_watch', function () {
    var srcToWatch = paths.build + 'js/*.js';

    return gulp
        .src( srcToWatch )
        .pipe(plugins.watch( srcToWatch ))
        .pipe(plugins.livereload());
});



/* Task: Compile SASS
--------------------------------------------------------------------------------- */

gulp.task('sass', function () {
    var options = {
        outputStyle: 'expanded',
        onError: function ( err ) {
            var errMsg  = gutil.colors.red( 'ERROR: ', err.message );
            var errFile = gutil.colors.green(path.basename(err.file) + ':' + err.line);

            console.log();
            console.log(errMsg + ' - ' + errFile);
            console.log();
            gutil.beep();
        }
    };

    return gulp
        .src(paths.dev + 'sass/main.scss')
        .pipe(plugins.sass(options).on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer(autoprefixOpts))
        .pipe(gulp.dest(paths.build + 'css'));
});



/* Task: Style
--------------------------------------------------------------------------------- */

gulp.task('style', function () {
    var options = {
        outputStyle: 'compressed'
    };

    return gulp
        .src(paths.dev + 'sass/main.scss')
        .pipe(plugins.sass(options))
        .pipe(plugins.autoprefixer(autoprefixOpts))
        .pipe(gulp.dest(paths.build + 'css'));
});




/* Task: Copy and minify CSS vendor
--------------------------------------------------------------------------------- */

gulp.task('copyCSS', function () {
    return gulp
        .src(paths.dev + 'css/*.css')
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(paths.build + 'css/'));
});




/* Task: Copy JS
--------------------------------------------------------------------------------- */

gulp.task('copy-JS', function () {
    var options = {
        suffix: '.min'
    };

    return gulp
        .src(paths.dev + 'js/**/*.js')
        .pipe(plugins.rename(options))
        .pipe(gulp.dest( paths.build + 'js'));
});




/* Task: Minify JS
--------------------------------------------------------------------------------- */

gulp.task('uglify', function () {
    var options = {
        suffix: '.min'
    };

    return gulp
        .src(paths.dev + 'js/**/*.js')
        .pipe(plugins.changed(paths.build + 'js'))
        .pipe(plugins.uglify()) 
        .pipe(plugins.rename(options))
        .pipe(gulp.dest( paths.build + 'js'));
});




/* Task: Optimize image
--------------------------------------------------------------------------------- */

gulp.task('imagemin', function () {
    var imageFormats = [
        paths.dev + 'img/*.png',
        paths.dev + 'img/*.jpg',
        paths.dev + 'img/*.gif'
    ];

    return gulp
        .src(imageFormats)
        .pipe(plugins.changed(paths.build + 'img'))
        .pipe(plugins.imagemin({ progressive: true })) 
        .pipe(gulp.dest(paths.build + 'img'));
});




/* Task: Convert image to WebP
--------------------------------------------------------------------------------- */

gulp.task('webp', function () {
    var imageFormats = [
        paths.dev + 'img/webp/*.png',
        paths.dev + 'img/webp/*.jpg'
    ];

    var options = {
        quality: 80
    };

    return gulp
        .src(imageFormats)
        .pipe(plugins.changed(paths.build + 'img/webp/'))
        .pipe(plugins.webp(options))
        .pipe(gulp.dest(paths.build + 'img/webp/'));
});




/* Task: Copy fonts
--------------------------------------------------------------------------------- */

gulp.task('fonts', function () {
    return gulp
        .src(paths.dev + 'fonts/*')
        .pipe(plugins.changed(paths.build + 'fonts'))
        .pipe(gulp.dest(paths.build + 'fonts'));
});





/* Task: Clean
--------------------------------------------------------------------------------- */

gulp.task('clean', function () {
    del(paths.build, function (err) {
        console.log('Assets directory cleaned');
    });
});




/* Task: Default
--------------------------------------------------------------------------------- */

gulp.task('default', ['imagemin', 'sass', 'copy-JS', 'fonts', 'copyCSS', 'webp']);




/* Task: Watch
--------------------------------------------------------------------------------- */

gulp.task('watch', ['default'], function () {
    // SASS 
    gulp.watch(paths.dev + 'sass/**/*.scss', ['sass']);

    // Uglify
    gulp.watch(paths.dev + 'js/**/*.js', ['copy-JS']);

    // Imagemin
    gulp.watch(paths.dev + 'img/*', ['imagemin']);

    // WebP
    gulp.watch(paths.dev + 'img/webp/*', ['webp']);

    // Fonts
    gulp.watch(paths.dev + 'fonts/*', ['fonts']);

    // Copy CSS
    gulp.watch(paths.dev + 'css/*', ['copyCSS']);
});




/* Task: Livereload
--------------------------------------------------------------------------------- */

gulp.task('livereload', function () {
    gulp.start('html_watch', 'css_watch', 'js_watch');
});




/* Task: Build
--------------------------------------------------------------------------------- */

gulp.task('production', ['style', 'uglify', 'imagemin', 'webp', 'fonts', 'copyCSS']);

gulp.task('build', ['clean'], function () {
    gulp.start('production');
});