'use strict'

/* Gulp set up
--------------------------------------------------------------------------------- */

const gulp        = require('gulp')
const del         = require('del')
const prefixer    = require('autoprefixer')
const beep        = require('beepbeep')
const rollupBabel = require('rollup-plugin-babel')
const rUglify     = require('rollup-plugin-uglify')
const plugins     = require('gulp-load-plugins')()
const rollup      = require('rollup-stream')
const source      = require('vinyl-source-stream')
const emailBuild  = require('gulp-inline-css')

const paths = {
    dev     : 'dev/',
    build   : 'assets/'
}

/* Task: Compile SASS
--------------------------------------------------------------------------------- */

const sassTask = (isMinified = false) => () => {
    const outputStyle = isMinified ? 'compressed' : 'expanded'
    const options = { outputStyle }
    const autoprefixOpts = {
        overrideBrowserslist: ['last 2 versions']
    }

    return gulp.src(`${paths.dev}sass/*.scss`)
        .pipe(plugins.sass(options).on('error', plugins.sass.logError))
        .pipe(plugins.postcss([
            prefixer(autoprefixOpts),
            require('postcss-object-fit-images')
        ]))
        .pipe(gulp.dest(`${paths.build}css`))
        .pipe(plugins.livereload())
}

gulp.task('stylesheet:compile', sassTask())
gulp.task('stylesheet:compile_and_minify', sassTask(true))




/* Task: Copy and minify CSS vendor
--------------------------------------------------------------------------------- */

gulp.task('stylesheet:copy_vendor_css', () => {
    return gulp
        .src(`${paths.dev}css/*.css`)
        .pipe(plugins.cleanCss({ compatibility: 'ie9' }))
        .pipe(gulp.dest(`${paths.build}css/`))
        .pipe(plugins.livereload())
})




/* Task: Ecmascript next
--------------------------------------------------------------------------------- */

const jsTask = (isMinified = false) => () => {
    const rollupPlugins = [
        rollupBabel({
            exclude: 'node_modules/**',
            presets: [
                ['env', { modules: false }]
            ],
            plugins: [
                'transform-object-rest-spread'
            ]
        })
    ]

    if ( isMinified ) {
        rollupPlugins.push(rUglify())
    }

    return rollup({
        input: './dev/js/main.js',
        format: 'iife',
        name: 'Site',
        plugins: rollupPlugins
    })
    .on('error', function (e) {
        console.log(e)
        this.emit('end')
    })
    .pipe(source('main.min.js'))
    .pipe(gulp.dest('./assets/js'))
    .pipe(plugins.livereload())
}

gulp.task('javascript:compile', jsTask())
gulp.task('javascript:compile_and_minify', jsTask(true))




/* Task: Copy JS
--------------------------------------------------------------------------------- */

const renameOpts = {
    suffix: '.min'
}

gulp.task('javascript:copy_vendor_js', () => {
    return gulp
        .src(`${paths.dev}js/vendor/*.js`)
        .pipe(plugins.rename(renameOpts))
        .pipe(gulp.dest(`${paths.build}js/vendor/`))
        .pipe(plugins.livereload())
})

gulp.task('javascript:minify_vendor_js', () => {
    return gulp
        .src(`${paths.dev}js/vendor/*.js`)
        .pipe(plugins.uglify())
        .pipe(plugins.rename(renameOpts))
        .pipe(gulp.dest(`${paths.build}js/vendor/`))
        .pipe(plugins.livereload())
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
        .pipe(plugins.livereload())
})




/* Task: Copy fonts
--------------------------------------------------------------------------------- */

gulp.task('fonts', () => {
    return gulp
        .src(`${paths.dev}webfonts/*`)
        .pipe(plugins.changed(`${paths.build}webfonts`))
        .pipe(gulp.dest(`${paths.build}webfonts`))
        .pipe(plugins.livereload())
})




/* Task: Inline css email template
--------------------------------------------------------------------------------- */

// gulp.task('email:build', () => {
//     return gulp.src('email_dev/*.html')
//         .pipe(emailBuild().build())
//         .pipe(gulp.dest('email_build/'))
//         .pipe(plugins.livereload())
// })
gulp.task('email:build', () => {
    return gulp.src('email_dev/*.html')
        .pipe(emailBuild({
            removeLinkTags: true
        }))
        .pipe(gulp.dest('email_build/'))
        .pipe(plugins.livereload())
})




/* Task: Watch HTLM and PHP files
--------------------------------------------------------------------------------- */

gulp.task('watch:htmlPHP', () => {
    return gulp
        .src(['*.html', '*.php', '**/*.php'])
        .pipe(plugins.livereload())
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

gulp.task('default', gulp.series(
    'stylesheet:copy_vendor_css',
    'stylesheet:compile',
    'javascript:compile',
    'javascript:copy_vendor_js',
    'image:compress',
    'fonts',
    'email:build',
    'watch:htmlPHP'
))


/* Task: Watch
--------------------------------------------------------------------------------- */

gulp.task('stream', () => {
    plugins.livereload.listen()
    // SASS
    gulp.watch(`${paths.dev}sass/**/*.scss`, gulp.series('stylesheet:compile'))

    // esNext
    gulp.watch(`${paths.dev}js/*.js`, gulp.series('javascript:compile'))

    // Uglify
    gulp.watch(`${paths.dev}js/vendor/*.js`, gulp.series('javascript:copy_vendor_js'))

    // // Imagemin
    gulp.watch(`${paths.dev}img/*`, gulp.series('image:compress'))

    // Fonts
    gulp.watch(`${paths.dev}webfonts/*`,gulp.series( 'fonts'))

    // Copy CSS
    gulp.watch(`${paths.dev}css/*`, gulp.series('stylesheet:copy_vendor_css'))

    // watch html
    gulp.watch(['*.html', '*.php', '**/*.php'], gulp.series('watch:htmlPHP'))
})


gulp.task('watch', gulp.series('default', 'stream'))

gulp.task('watch:email_build', () => {
    plugins.livereload.listen()

    // SASS
    gulp.watch(`${paths.dev}sass/**/*.scss`, gulp.series('stylesheet:compile'))

    // Compile email template
    gulp.watch(`email_dev/*.html`, gulp.series('email:build'))
})

/* Task: Build
--------------------------------------------------------------------------------- */

gulp.task('production', gulp.series(
    'stylesheet:compile_and_minify',
    'stylesheet:copy_vendor_css',
    'javascript:compile_and_minify',
    'javascript:minify_vendor_js',
    'image:compress',
    'email:build',
    'fonts'
))

gulp.task('build', gulp.series('clean'), () => {
    gulp.start('production')
})
