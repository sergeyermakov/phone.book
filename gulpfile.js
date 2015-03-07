var gulp = require('gulp'),
	del = require('del'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	connect = require('gulp-connect'),
	assets = useref.assets(),
	wiredep = require('wiredep').stream;

//develop сборка
	//подключение bower_components
	gulp.task('bower', function() {
		return gulp.src('./app/*.jade')
			.pipe(wiredep({
				directory: 'bower_components'
			}))
			.pipe(gulp.dest('app'));
	});
	//шаблоны
	gulp.task('templates', function(){
		return gulp.src('./app/*.jade')
			.pipe(jade({
				pretty: true
			}))
			.pipe(gulp.dest('develop'))
			.pipe(connect.reload());
	});
	//стили
	gulp.task('styles', function () {
		return gulp.src('./app/style/style.scss')
			.pipe(sass())
			.pipe(gulp.dest('develop/style'))
			.pipe(connect.reload());
	});
	//скрипты
	gulp.task('scripts', function() {
		return gulp.src('./app/script/app.js')
			.pipe(gulp.dest('develop/script/')) // путь до сформированного файла
			.pipe(connect.reload()); // перезагружаем сервер
	});
	//картинки
	gulp.task('images', function(){
		gulp.src('./app/style/img/*.*')
			.pipe(gulp.dest('develop/style/img'));
	});
	//watcher
	gulp.task('watch', ['bower','styles', 'scripts', 'templates','images'], function() {
		gulp.watch('./app/*.jade', ['templates']);
		gulp.watch('./app/script/app.js', ['scripts']);
		gulp.watch('./app/style/style.scss', ['styles']);
		gulp.watch('./app/style/img/*.*', ['images']);
	});
	//сервер
	gulp.task('server', ['watch'], function() {
		connect.server({
			port: 3000, // порт сервера
			livereload: true // автоматический перезапуск
		})
	});


	gulp.task('develop', ['clean:develop','bower','scripts', 'styles', 'templates','images']);

	gulp.task('default', ['develop']);




//production сборка

	gulp.task('prod_styles', function () {
		return gulp.src('./develop/style/*.css')
			.pipe(minifyCss())
			.pipe(gulp.dest('production/style'));
	});
	gulp.task('prod_js', function () {
		return gulp.src('./develop/script/*.js')
			.pipe(uglify())
			.pipe(gulp.dest('production/script'));
	});
	gulp.task('prod_img', function(){
		gulp.src('./develop/style/img/*.*')
			.pipe(gulp.dest('production/style/img'));
	});
	gulp.task('production', ['clean:prod','prod_styles','prod_js', 'prod_img'], function () {
		return gulp.src('develop/*.html')
			.pipe(assets)
			.pipe(gulpif('*.js', uglify()))
			.pipe(gulpif('*.css', minifyCss()))
			.pipe(assets.restore())
			.pipe(useref())
			.pipe(gulp.dest('production'));
	});



gulp.task('clean:production', function (cb) {
	del(['production'], cb);
});
gulp.task('clean:develop', function (cb) {
	del(['develop'], cb);
});