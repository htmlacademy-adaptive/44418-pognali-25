import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import libsquoosh from 'gulp-libsquoosh';
import terser from 'gulp-terser';
import del from 'del';
import browser from 'browser-sync';

// Styles
export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream())
}

// HTML
const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({collapseWhitespace:true}))
  .pipe(gulp.dest('build'))
}

// Scripts
const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(rename('script.min.js'))
  .pipe(gulp.dest('build/js'))
}

// SVG
const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/icons/*.svg'])
  .pipe(svgmin())
  .pipe(gulp.dest('build/img'))
}

// Sprite
const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'))
}

// Images
const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(libsquoosh())
  .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'))
}

// Webp
const webp = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/*'])
  .pipe(libsquoosh({
    // avif: {},
    webp: {}
  }))
  .pipe(gulp.dest('build/img'))
}

// Copy
const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff,woff2}',
    'source/*.ico',
    'source/*.webmanifest'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'))
  done()
}

// Clean
const clean = () => {
  return del('build')
}

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  })
  done()
}

// Reload
const reload = (done) => {
  browser.reload()
  done()
}

// Watcher
const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles))
  gulp.watch('source/js/**/*.js', gulp.series(scripts))
  gulp.watch('source/*.html', gulp.series(html, reload))
}

// Build
export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    webp
  )
)


export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    webp
  ),
  gulp.series(
    server,
    watcher
  )
)
