
/* Gulp set up
--------------------------------------------------------------------------------- */

var gulp                = require('gulp'),
    gutil               = require('gulp-util'),

    // css task
    task_sass           = require('gulp-ruby-sass'),
    task_minify_css     = require('gulp-minify-css'),
    task_prefixer       = require('gulp-autoprefixer'),

    // js task
    task_uglify         = require('gulp-uglify'),

    // image task
    task_imagemin       = require('gulp-imagemin'),
    task_webp           = require('gulp-webp'),
    
    // misc task
    task_livereload     = require('gulp-livereload'),
    task_changed        = require('gulp-changed'),
    task_watch          = require('gulp-watch'),
    task_rename         = require('gulp-rename'),
    task_clean          = require('gulp-clean');


var paths = {
    dev     : 'dev/',
    build   : 'assets/'
}



/* Task: Watch HTML
--------------------------------------------------------------------------------- */

gulp.task('html_watch', function () {
    return gulp
        .src('*.html')
        .pipe(task_watch())
        .pipe(task_livereload());
});



/* Task: Watch CSS
--------------------------------------------------------------------------------- */

gulp.task('css_watch', function () {
    return gulp
        .src(paths.build + 'css/*.css')
        .pipe(task_watch())
        .pipe(task_livereload());
});



/* Task: Watch JS
--------------------------------------------------------------------------------- */

gulp.task('js_watch', function () {
    return gulp
        .src(paths.build + 'js/*.js')
        .pipe(task_watch())
        .pipe(task_livereload());
});



/* Task: Compile SASS
--------------------------------------------------------------------------------- */

gulp.task('sass', function () {
    return gulp
        .src(paths.dev + 'sass/main.scss')
        .pipe(task_sass({ style: 'expanded' })
            .on('error', gutil.log)
            .on('error', gutil.beep)
        )
        .pipe(task_prefixer())
        .pipe(gulp.dest( paths.build + 'css'));
});




/* Task: Copy and minify CSS vendor
--------------------------------------------------------------------------------- */

gulp.task('copyCSS', function () {
    return gulp
        .src(paths.dev + 'css/*.css')
        .pipe(task_minify_css())
        .pipe(gulp.dest(paths.build + 'css/'));
});




/* Task: Copy JS
--------------------------------------------------------------------------------- */

gulp.task('copy-JS', function () {
    return gulp
        .src(paths.dev + 'js/**/*.js')
        .pipe( gulp.dest( paths.build + 'js'));
});




/* Task: Minify JS
--------------------------------------------------------------------------------- */

gulp.task('uglify', function () {
    return gulp
        .src(paths.dev + 'js/**/*.js')
        .pipe(task_changed(paths.build + 'js'))
        .pipe(task_uglify()) 
        .pipe(task_rename({
            suffix: '.min'
        }))
        .pipe( gulp.dest( paths.build + 'js'));
});




/* Task: Optimize image
--------------------------------------------------------------------------------- */

gulp.task('imagemin', function () {
    return gulp
        .src([paths.dev + 'img/*.png', paths.dev + 'img/*.jpg', paths.dev + 'img/*.gif'])
        .pipe(task_changed(paths.build + 'img'))
        .pipe(task_imagemin({ progressive: true })) 
        .pipe(gulp.dest( paths.build + 'img'));
});




/* Task: Convert image to WebP
--------------------------------------------------------------------------------- */

gulp.task('webp', function () {
    return gulp
        .src([paths.dev + 'img/webp/*.png', paths.dev + 'img/webp/*.jpg'])
        .pipe(task_changed(paths.build + 'img/webp/'))
        .pipe(task_webp({
            quality: 80
        }))
        .pipe(gulp.dest( paths.build + 'img/webp/'));
});




/* Task: Copy fonts
--------------------------------------------------------------------------------- */

gulp.task('fonts', function () {
    return gulp
        .src(paths.dev + 'fonts/*')
        .pipe(task_changed(paths.build + 'fonts'))
        .pipe(gulp.dest( paths.build + 'fonts'));
});





/* Task: Clean
--------------------------------------------------------------------------------- */

gulp.task('clean', function () {
    return gulp
        .src(paths.build, {read: false})
        .pipe(task_clean());    
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
    gulp.watch(paths.dev + 'img/webp/', ['webp']);

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
    gulp.start('sass', 'uglify', 'imagemin', 'webp', 'fonts', 'copyCSS');
});
























