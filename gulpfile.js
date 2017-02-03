'use strict'

/* Gulp set up
--------------------------------------------------------------------------------- */

const gulp        = require('gulp')
const del         = require('del')
const prefixer    = require('autoprefixer')
const beep        = require('beepbeep')
const plugins     = require('gulp-load-plugins')()

const paths = {
    dev     : 'dev/',
    build   : 'assets/'
}

const autoprefixOpts = {
    browsers: ['> 1%', 'last 10 versions', 'Firefox ESR', 'Opera 12.1']
}

const renameOpts = {
    suffix: '.min'
}



/* Task: Watch HTML
--------------------------------------------------------------------------------- */

gulp.task('watch:html', () => {
    let srcToWatch = ['**/*.html', '**/*.php']

    return gulp
        .src(srcToWatch)
        .pipe(plugins.watch(srcToWatch))
        .pipe(plugins.livereload())
})



/* Task: Watch CSS
--------------------------------------------------------------------------------- */

gulp.task('watch:stylesheet', () => {
    let srcToWatch = `${paths.build}css/*.css`

    return gulp
        .src(srcToWatch)
        .pipe(plugins.watch(srcToWatch))
        .pipe(plugins.livereload())
})



/* Task: Watch JS
--------------------------------------------------------------------------------- */

gulp.task('watch:js', () => {
    let srcToWatch = `${paths.build}js/*.js`

    return gulp
        .src(srcToWatch)
        .pipe(plugins.watch(srcToWatch))
        .pipe(plugins.livereload())
})



/* Task: Compile SASS
--------------------------------------------------------------------------------- */

gulp.task('stylesheet:compile', () => {
    let options = {
        outputStyle: 'expanded'
    }

    return gulp
        .src(`${paths.dev}sass/main.scss`)
        .pipe(plugins.sass(options).on('error', plugins.sass.logError))
        .pipe(plugins.postcss([
            prefixer(autoprefixOpts),
            require('postcss-object-fit-images')
        ]))
        .pipe(gulp.dest(`${paths.build}css`))
})



/* Task: Style
--------------------------------------------------------------------------------- */

gulp.task('stylesheet:compile_and_minify', () => {
    let options = {
        outputStyle: 'compressed'
    }

    return gulp
        .src(`${paths.dev}sass/main.scss`)
        .pipe(plugins.sass(options))
        .pipe(plugins.postcss([
            prefixer(autoprefixOpts),
            require('postcss-object-fit-images')
        ]))
        .pipe(gulp.dest(`${paths.build}css`))
})




/* Task: Copy and minify CSS vendor
--------------------------------------------------------------------------------- */

gulp.task('stylesheet:copy_vendor_css', () => {
    return gulp
        .src(`${paths.dev}css/*.css`)
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(`${paths.build}css/`))
})




/* Task: Ecmascript next
--------------------------------------------------------------------------------- */

gulp.task('javascript:compile', () => {
    return gulp
        .src(`${paths.dev}js/*.js`)
        .pipe(plugins.babel({
            presets: ['es2015', 'react']
        }))
        .on('error', function (err) {
            console.log('>>> Error', err)
            beep(2)
            this.emit('end')
        })
        .pipe(plugins.rename(renameOpts))
        .pipe(gulp.dest(`${paths.build}js`))
})

gulp.task('javascript:compile_and_minify', () => {
    return gulp
        .src(`${paths.dev}js/*.js`)
        .pipe(plugins.babel({
            presets: ['es2015']
        }))
        .on('error', function (err) {
            console.log('>>> Error', err)
            beep(2)
            this.emit('end')
        })
        .pipe(plugins.uglify())
        .pipe(plugins.rename(renameOpts))
        .pipe(gulp.dest(`${paths.build}js`))
})




/* Task: Copy JS
--------------------------------------------------------------------------------- */

gulp.task('javascript:copy_vendor_js', () => {
    return gulp
        .src(`${paths.dev}js/vendor/*.js`)
        .pipe(plugins.rename(renameOpts))
        .pipe(gulp.dest(`${paths.build}js/vendor/`))
})




/* Task: Minify JS
--------------------------------------------------------------------------------- */

gulp.task('javascript:minify_vendor_js', () => {
    return gulp
        .src(`${paths.dev}js/vendor/*.js`)
        .pipe(plugins.changed(`${paths.build}js`))
        .pipe(plugins.uglify())
        .pipe(plugins.rename(renameOpts))
        .pipe(gulp.dest(`${paths.build}js/vendor/`))
})




/* Task: Optimize image
--------------------------------------------------------------------------------- */

gulp.task('image:compress', () => {
    let imageFormats = [
        `${paths.dev}img/*.png`,
        `${paths.dev}img/*.jpg`,
        `${paths.dev}img/*.gif`,
        `${paths.dev}img/*.svg`
    ]

    return gulp
        .src(imageFormats)
        .pipe(plugins.changed(`${paths.build}img`))
        .pipe(plugins.imagemin([
            plugins.imagemin.gifsicle(),
            plugins.imagemin.jpegtran({ progressive: true }),
            plugins.imagemin.optipng(),
            plugins.imagemin.svgo()
        ]))
        .pipe(gulp.dest(`${paths.build}img`))
})




/* Task: Convert image to WebP
--------------------------------------------------------------------------------- */

gulp.task('image:convert_to_webp', () => {
    let imageFormats = [
        `${paths.dev}img/webp/*.png`,
        `${paths.dev}img/webp/*.jpg`
    ]

    let options = {
        quality: 80
    }

    return gulp
        .src(imageFormats)
        .pipe(plugins.changed(`${paths.build}img/webp/`))
        .pipe(plugins.webp(options))
        .pipe(gulp.dest(`${paths.build}img/webp/`))
})




/* Task: Copy fonts
--------------------------------------------------------------------------------- */

gulp.task('fonts', () => {
    return gulp
        .src(`${paths.dev}fonts/*`)
        .pipe(plugins.changed(`${paths.build}fonts`))
        .pipe(gulp.dest(`${paths.build}fonts`))
})





/* Task: Clean
--------------------------------------------------------------------------------- */

gulp.task('clean', () => {
    return del(paths.build).then(() => {
        console.log('Assets directory cleaned')
    })
})




/* Task: Default
--------------------------------------------------------------------------------- */

gulp.task('default', [
    'stylesheet:copy_vendor_css',
    'stylesheet:compile',
    'javascript:compile',
    'javascript:copy_vendor_js',
    'image:compress',
    'image:convert_to_webp',
    'fonts'
])




/* Task: Watch
--------------------------------------------------------------------------------- */

gulp.task('watch', ['default'], () => {
    // SASS
    gulp.watch(`${paths.dev}sass/**/*.scss`, ['stylesheet:compile'])

    // esNext
    gulp.watch(`${paths.dev}js/*.js`, ['javascript:compile'])

    // Uglify
    gulp.watch(`${paths.dev}js/vendor/*.js`, ['javascript:copy_vendor_js'])

    // Imagemin
    gulp.watch(`${paths.dev}img/*`, ['image:compress'])

    // WebP
    gulp.watch(`${paths.dev}img/webp/*`, ['image:convert_to_webp'])

    // Fonts
    gulp.watch(`${paths.dev}fonts/*`, ['fonts'])

    // Copy CSS
    gulp.watch(`${paths.dev}css/*`, ['stylesheet:copy_vendor_css'])
})




/* Task: Livereload
--------------------------------------------------------------------------------- */

gulp.task('livereload', () => {
    gulp.start('watch:html', 'watch:stylesheet', 'watch:js')
})




/* Task: Build
--------------------------------------------------------------------------------- */

gulp.task('production', [
    'stylesheet:compile_and_minify',
    'stylesheet:copy_vendor_css',
    'javascript:compile_and_minify',
    'javascript:minify_vendor_js',
    'image:compress',
    'image:convert_to_webp',
    'fonts'
])

gulp.task('build', ['clean'], () => {
    gulp.start('production')
})
