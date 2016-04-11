# Suit-baze
> Suit-baze is a Front-end starter kit base on [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate) modified by developers from [Suitmedia](https://github.com/Suitmedia).

## Getting started

Recommended way to install suit-baze is via [yo generator](https://github.com/ImBobby/generator-suit-baze).
```Bash
yo suit-baze
```
or download from the [latest zip file](https://github.com/ImBobby/suit-baze/releases) or clone this repo.

## What's included

* SCSS to CSS compilation using [gulp-sass](https://github.com/dlmanning/gulp-sass)
* Autoprefixer
* [Normalize](https://github.com/necolas/normalize.css/)
* [Baze Grid](https://github.com/ImBobby/Baze-Grid)
* [Modernizr](https://github.com/Modernizr/Modernizr)
* [jQuery](https://github.com/jquery/jquery)
* [Fastclick](https://github.com/ftlabs/fastclick)
* [Gulp](https://github.com/gulpjs/gulp) build system
* [Bower](https://github.com/bower/bower) manifest
* Vertical rhythm system
* [Facebook Open Graph meta tag](https://developers.facebook.com/docs/sharing/webmasters#basic)
* [Twitter Card meta tag](https://dev.twitter.com/cards/types/summary-large-image)

### Load additional scripts

In practice, most scripts are loaded via `Modernizr.load`. But in some cases, backend developers need to add additional scripts depending on jQuery. So that to load additional scripts, create script tag with 'data-src' attribute instead of 'src'.

```HTML
<script data-src="path/to/script.js"></script>
```

### Available gulp task

| task      | description  |
|---        |---|
| `gulp`   | Run all main tasks such as SCSS compiling, image optimization, etc once.  |
| `gulp watch`   | Run default task while watching changed files.   |
| `gulp build`   | Clear assets folder and regenerate fresh pristine assets directory along with ready to production assets.  |
| `gulp livereload`   | Enable livereload development. Run separately with `gulp watch`  |


## Browser support

Evergreen browsers and IE8+
