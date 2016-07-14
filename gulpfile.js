'use strict'

/* Gulp set up
--------------------------------------------------------------------------------- */

const gulp        = require('gulp')
const del         = require('del')
const prefixer    = require('autoprefixer')
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

gulp.task('html_watch', () => {
    let srcToWatch = ['**/*.html', '**/*.php']

    return gulp
        .src(srcToWatch)
        .pipe(plugins.watch(srcToWatch))
        .pipe(plugins.livereload())
})



/* Task: Watch CSS
--------------------------------------------------------------------------------- */

gulp.task('css_watch', () => {
    let srcToWatch = `${paths.build}css/*.css`

    return gulp
        .src(srcToWatch)
        .pipe(plugins.watch(srcToWatch))
        .pipe(plugins.livereload())
})



/* Task: Watch JS
--------------------------------------------------------------------------------- */

gulp.task('js_watch', () => {
    let srcToWatch = `${paths.build}js/*.js`

    return gulp
        .src(srcToWatch)
        .pipe(plugins.watch(srcToWatch))
        .pipe(plugins.livereload())
})



/* Task: Compile SASS
--------------------------------------------------------------------------------- */

gulp.task('sass', () => {
    let options = {
        outputStyle: 'expanded'
    }

    return gulp
        .src(`${paths.dev}sass/main.scss`)
        .pipe(plugins.sass(options).on('error', plugins.sass.logError))
        .pipe(plugins.postcss([
            prefixer(autoprefixOpts)
        ]))
        .pipe(gulp.dest(`${paths.build}css`))
})



/* Task: Style
--------------------------------------------------------------------------------- */

gulp.task('style', () => {
    let options = {
        outputStyle: 'compressed'
    }

    return gulp
        .src(`${paths.dev}sass/main.scss`)
        .pipe(plugins.sass(options))
        .pipe(plugins.postcss([
            prefixer(autoprefixOpts)
        ]))
        .pipe(gulp.dest(`${paths.build}css`))
})




/* Task: Copy and minify CSS vendor
--------------------------------------------------------------------------------- */

gulp.task('copyCSS', () => {
    return gulp
        .src(`${paths.dev}css/*.css`)
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(`${paths.build}css/`))
})




/* Task: Ecmascript next
--------------------------------------------------------------------------------- */

gulp.task('esnext', () => {
    return gulp
        .src(`${paths.dev}js/main.js`)
        .pipe(plugins.babel({
            presets: ['es2015', 'react']
        }))
        .on('error', (err) => {
            console.log('>>> Error', e)

            this.emit('end')
        })
        .pipe(plugins.rename(renameOpts))
        .pipe(gulp.dest(`${paths.build}js`))
})

gulp.task('esnext:uglify', () => {
    return gulp
        .src(`${paths.dev}js/main.js`)
        .pipe(plugins.babel({
            presets: ['es2015']
        }))
        .on('error', (err) => {
            console.log('>>> Error', e)

            this.emit('end')
        })
        .pipe(plugins.uglify())
        .pipe(plugins.rename(renameOpts))
        .pipe(gulp.dest(`${paths.build}js`))
})




/* Task: Copy JS
--------------------------------------------------------------------------------- */

gulp.task('copy-JS', () => {
    return gulp
        .src(`${paths.dev}js/vendor/*.js`)
        .pipe(plugins.rename(renameOpts))
        .pipe(gulp.dest(`${paths.build}js/vendor/`))
})




/* Task: Minify JS
--------------------------------------------------------------------------------- */

gulp.task('uglify', () => {
    return gulp
        .src(`${paths.dev}js/vendor/*.js`)
        .pipe(plugins.changed(`${paths.build}js`))
        .pipe(plugins.uglify())
        .pipe(plugins.rename(renameOpts))
        .pipe(gulp.dest(`${paths.build}js/vendor/`))
})




/* Task: Optimize image
--------------------------------------------------------------------------------- */

gulp.task('imagemin', () => {
    let imageFormats = [
        `${paths.dev}img/*.png`,
        `${paths.dev}img/*.jpg`,
        `${paths.dev}img/*.gif`
    ]

    return gulp
        .src(imageFormats)
        .pipe(plugins.changed(`${paths.build}img`))
        .pipe(plugins.imagemin({ progressive: true }))
        .pipe(gulp.dest(`${paths.build}img`))
})




/* Task: Convert image to WebP
--------------------------------------------------------------------------------- */

gulp.task('webp', () => {
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
    del(paths.build, (err) => {
        console.log('Assets directory cleaned')
    })
})




/* Task: Default
--------------------------------------------------------------------------------- */

gulp.task('default', ['imagemin', 'sass', 'esnext', 'copy-JS', 'fonts', 'copyCSS', 'webp'])




/* Task: Watch
--------------------------------------------------------------------------------- */

gulp.task('watch', ['default'], () => {
    // SASS
    gulp.watch(`${paths.dev}sass/**/*.scss`, ['sass'])

    // esNext
    gulp.watch(`${paths.dev}js/main.js`, ['esnext'])

    // Uglify
    gulp.watch(`${paths.dev}js/vendor/*.js`, ['copy-JS'])

    // Imagemin
    gulp.watch(`${paths.dev}img/*`, ['imagemin'])

    // WebP
    gulp.watch(`${paths.dev}img/webp/*`, ['webp'])

    // Fonts
    gulp.watch(`${paths.dev}fonts/*`, ['fonts'])

    // Copy CSS
    gulp.watch(`${paths.dev}css/*`, ['copyCSS'])
})




/* Task: Livereload
--------------------------------------------------------------------------------- */

gulp.task('livereload', () => {
    gulp.start('html_watch', 'css_watch', 'js_watch')
})




/* Task: Build
--------------------------------------------------------------------------------- */

gulp.task('production', ['style', 'esnext:uglify', 'uglify', 'imagemin', 'webp', 'fonts', 'copyCSS'])

gulp.task('build', ['clean'], () => {
    gulp.start('production')
})
