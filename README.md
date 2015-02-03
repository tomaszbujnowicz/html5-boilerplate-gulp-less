# HTML5 Boilerplate enhanced with LESS and Gulp.js including BrowserSync plugin.

Project based on amazing [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate)

HTML5 Boilerplate enhanced with [LESS](http://www.lesscss.org/) and [Gulp.js](http://gulpjs.com/) including [BrowserSync](http://www.browsersync.io) plugin. 

## Quick start

Clone the git repo
```sh
git clone https://github.com/tomaszbujnowicz/h5bp-less-gulp.git
```
Download all the project dependencies
```sh
npm install
```
For debug purposes. Watch and develop. Recompile JS and LESS on each change and refresh the browser using BrowserSync after an HTML file is compiled. Please note that you should run `gulp` for the first time 
```sh
gulp dev
```
Building out files for deployment and clean up source folder
```sh
gulp
```
## Installation requirements

Not familiar with Gulp? [Getting started with gulp](http://markgoodyear.com/2014/01/getting-started-with-gulp/)
* Install [node.js](http://nodejs.org/)
* Install gulp.js from the command line: `npm install gulp -g`
* Install gulp.js in your project folder: `npm install --save-dev gulp`
* Install the node modules: `npm install`

## Features

* [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate)
* Default HTML5 Boilerplate Gulp Plugins
* Gulp.js [Less for Gulp](https://www.npmjs.org/package/gulp-less)
* Gulp.js [BrowserSync](http://www.browsersync.io/)
* Gulp.js [Minify files with UglifyJS](https://www.npmjs.org/package/gulp-uglify)
* Gulp.js [Minify CSS](https://www.npmjs.org/package/gulp-minify-css)
* Gulp.js [Notify](https://www.npmjs.org/package/gulp-notify)
* Gulp.js [Autoprefixer](https://www.npmjs.org/package/gulp-autoprefixer)
* Gulp.js [Concat](https://www.npmjs.org/package/gulp-concat)
* Gulp.js [Utility functions](https://www.npmjs.org/package/gulp-util)

## Basic Structure

Production ready version

```
.
├── css
│   ├── main.min.css
│   └── normalize.min.css
├── img
├── js
│   ├── main.min.js
│   ├── plugins.js
│   └── vendor
│       ├── jquery.min.js
│       └── modernizr.min.js
├── .htaccess
├── 404.html
├── index.html
├── robots.txt
├── crossdomain.xml
```

## Changes comparing to original

* LESS with Autoprefixer instead of CSS
* Minified version of CSS files and main.js goes to Dist
* Added "watch and develop" gulp task
* Commented GA Code as it's not going to work until the project is live
* Removed favicons - remember about uploading project specific favicons
* Removed browserconfig.xml and tile icons
* Removed /Doc folder
* Other GULP related adjustments and improvements
* Handle more HTML files when deploying and testing

## Todo

* Add more Gulp.js plugins like Image Optimization, SVG/PNG Sprites, Filesize, Minifying SVGs etc..
* Concatenates CSS, JS files
* Testing and keeping project up-to-date


###Copyright and license

Copyright 2014-2015 Tomasz Bujnowicz under the [MIT license](http://opensource.org/licenses/MIT).
