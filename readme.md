#Suit-baze
> Suit-baze is a Front-end starter kit base on [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate) modified by developers from [Suitmedia](https://github.com/Suitmedia).

## Getting started

Recommended way to install suit-baze is via [yo generator](https://github.com/ImBobby/generator-suit-baze).
```
yo suit-baze
```
or download from the [latest zip file](https://github.com/ImBobby/suit-baze/releases) or clone this repo.

## What's included

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

### Available gulp task

| task      | description  |
|---        |---|
| [`gulp`](https://github.com/ImBobby/suit-baze/blob/master/gulpfile.js#L229)   | Run all main tasks such as SCSS compiling, image optimization, etc once.  |
| [`gulp watch`](https://github.com/ImBobby/suit-baze/blob/master/gulpfile.js#L239)   | Run default task while watching changed files.   |
| [`gulp build`](https://github.com/ImBobby/suit-baze/blob/master/gulpfile.js#L278)   | Clear assets folder and regenerate fresh pristine assets directory along with ready to production assets.  |
| [`gulp livereload`](https://github.com/ImBobby/suit-baze/blob/master/gulpfile.js#L268)   | Enable livereload development. Run separately with `gulp watch`  |