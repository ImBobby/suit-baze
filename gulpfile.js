
/* Gulp set up
--------------------------------------------------------------------------------- */

var gulp            = require('gulp'),
    gutil           = require('gulp-util'),

    // css task
    rubySass        = require('gulp-ruby-sass'),
    minifyCSS       = require('gulp-minify-css'),
    autoprefixer    = require('gulp-autoprefixer'),

    // js task
    uglify          = require('gulp-uglify'),

    // image task
    imagemin        = require('gulp-imagemin'),
    webp            = require('gulp-webp'),
    
    // misc task
    livereload      = require('gulp-livereload'),
    changed         = require('gulp-changed'),
    watch           = require('gulp-watch'),
    rename          = require('gulp-rename'),
    del             = require('del');


var paths = {
    dev     : 'dev/',
    build   : 'assets/'
};



/* Task: Watch HTML
--------------------------------------------------------------------------------- */

gulp.task('html_watch', function () {
    return gulp
        .src('*.html')
        .pipe(watch())
        .pipe(livereload());
});



/* Task: Watch CSS
--------------------------------------------------------------------------------- */

gulp.task('css_watch', function () {
    return gulp
        .src(paths.build + 'css/*.css')
        .pipe(watch())
        .pipe(livereload());
});



/* Task: Watch JS
--------------------------------------------------------------------------------- */

gulp.task('js_watch', function () {
    return gulp
        .src(paths.build + 'js/*.js')
        .pipe(watch())
        .pipe(livereload());
});



/* Task: Compile SASS
--------------------------------------------------------------------------------- */

gulp.task('sass', function () {
    return gulp
        .src(paths.dev + 'sass/main.scss')
        .pipe(rubySass({ style: 'expanded' })
            .on('error', gutil.log)
            .on('error', gutil.beep)
        )
        .pipe(gulp.dest( paths.build + 'css'));
});



/* Task: Autoprefix
--------------------------------------------------------------------------------- */

gulp.task('autoprefix', function () {
    return gulp
        .src(paths.build + 'css/main.css')
        .pipe(autoprefixer())
        .pipe(gulp.dest( paths.build + 'css'));
});



/* Task: Style
--------------------------------------------------------------------------------- */

gulp.task('style', function () {
    return gulp
        .src(paths.dev + 'sass/main.scss')
        .pipe(rubySass({ style: 'compressed' })
            .on('error', gutil.log)
            .on('error', gutil.beep)
        )
        .pipe( autoprefixer() )
        .pipe(gulp.dest( paths.build + 'css'));
});




/* Task: Copy and minify CSS vendor
--------------------------------------------------------------------------------- */

gulp.task('copyCSS', function () {
    return gulp
        .src(paths.dev + 'css/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.build + 'css/'));
});




/* Task: Copy JS
--------------------------------------------------------------------------------- */

gulp.task('copy-JS', function () {
    return gulp
        .src(paths.dev + 'js/**/*.js')
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe( gulp.dest( paths.build + 'js'));
});




/* Task: Minify JS
--------------------------------------------------------------------------------- */

gulp.task('uglify', function () {
    return gulp
        .src(paths.dev + 'js/**/*.js')
        .pipe(changed(paths.build + 'js'))
        .pipe(uglify()) 
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe( gulp.dest( paths.build + 'js'));
});




/* Task: Optimize image
--------------------------------------------------------------------------------- */

gulp.task('imagemin', function () {
    return gulp
        .src([paths.dev + 'img/*.png', paths.dev + 'img/*.jpg', paths.dev + 'img/*.gif'])
        .pipe(changed(paths.build + 'img'))
        .pipe(imagemin({ progressive: true })) 
        .pipe(gulp.dest( paths.build + 'img'));
});




/* Task: Convert image to WebP
--------------------------------------------------------------------------------- */

gulp.task('webp', function () {
    return gulp
        .src([paths.dev + 'img/webp/*.png', paths.dev + 'img/webp/*.jpg'])
        .pipe(changed(paths.build + 'img/webp/'))
        .pipe(webp({
            quality: 80
        }))
        .pipe(gulp.dest( paths.build + 'img/webp/'));
});




/* Task: Copy fonts
--------------------------------------------------------------------------------- */

gulp.task('fonts', function () {
    return gulp
        .src(paths.dev + 'fonts/*')
        .pipe(changed(paths.build + 'fonts'))
        .pipe(gulp.dest( paths.build + 'fonts'));
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

gulp.task('default', ['imagemin', 'sass', 'copy-JS', 'fonts', 'copyCSS', 'webp'], function () {
    gulp.start('autoprefix');
});




/* Task: Watch
--------------------------------------------------------------------------------- */

gulp.task('watch', ['default'], function () {
    // SASS 
    gulp.watch(paths.dev + 'sass/**/*.scss', ['sass']);

    // Autoprefix 
    gulp.watch(paths.build + 'css/main.css', ['autoprefix']);

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

gulp.task('build', ['clean'], function () {
    gulp.start('style', 'uglify', 'imagemin', 'webp', 'fonts', 'copyCSS');
});
























