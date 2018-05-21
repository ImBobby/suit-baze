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
        browsers: ['last 2 versions']
    }

    return gulp.src(`${paths.dev}sass/main.scss`)
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
        .src(`${paths.dev}fonts/*`)
        .pipe(plugins.changed(`${paths.build}fonts`))
        .pipe(gulp.dest(`${paths.build}fonts`))
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

gulp.task('default', [
    'stylesheet:copy_vendor_css',
    'stylesheet:compile',
    'javascript:compile',
    'javascript:copy_vendor_js',
    'image:compress',
    'fonts',
    'watch:htmlPHP'
])




/* Task: Watch
--------------------------------------------------------------------------------- */

gulp.task('watch', ['default'], () => {
    plugins.livereload.listen()
    // SASS
    gulp.watch(`${paths.dev}sass/**/*.scss`, ['stylesheet:compile'])

    // esNext
    gulp.watch(`${paths.dev}js/*.js`, ['javascript:compile'])

    // Uglify
    gulp.watch(`${paths.dev}js/vendor/*.js`, ['javascript:copy_vendor_js'])

    // Imagemin
    gulp.watch(`${paths.dev}img/*`, ['image:compress'])

    // Fonts
    gulp.watch(`${paths.dev}fonts/*`, ['fonts'])

    // Copy CSS
    gulp.watch(`${paths.dev}css/*`, ['stylesheet:copy_vendor_css'])

    gulp.watch(['*.html', '*.php', '**/*.php'], ['watch:htmlPHP'])
})




/* Task: Build
--------------------------------------------------------------------------------- */

gulp.task('production', [
    'stylesheet:compile_and_minify',
    'stylesheet:copy_vendor_css',
    'javascript:compile_and_minify',
    'javascript:minify_vendor_js',
    'image:compress',
    'fonts'
])

gulp.task('build', ['clean'], () => {
    gulp.start('production')
})
