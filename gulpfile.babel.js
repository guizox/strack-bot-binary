const gulp = require('gulp');
const watch = require('gulp-watch');
const ghpages = require('gh-pages');
const connect = require('gulp-connect');
const open = require('gulp-open');
require('./gulp/i18n');
require('./gulp/build');
require('./gulp/plato');

gulp.task(
    'connect',
    gulp.series(done => {
        connect.server({
            root      : 'ec2-34-205-30-2.compute-1.amazonaws.com',
            port      : process.env.PORT || 3000,
            livereload: false,
        });
        done();
    })
);

gulp.task(
    'serve',
    gulp.series('connect', done => {
        done();
    })
);

gulp.task(
    'release-branch',
    gulp.series(done => {
        const index = process.argv.indexOf('--branch');
        let option = '';
        if (index <= -1) {
            throw Error('Please specify branch');
        } else {
            option = process.argv[index + 1];
        }
        ghpages
            .publish('www', {
                dest: option,
                add : true,
            })
            .then(done);
    })
);

gulp.task(
    'release-master',
    gulp.series(done => {
        ghpages
            .publish('./', {
                src: ['404.md', 'LICENSE', 'README.md', 'CNAME'],
                add: true,
            })
            .then(() => {
                ghpages.publish('www', {
                    add: true,
                });
            })
            .then(done);
    })
);

gulp.task('test-deploy', gulp.series('build-min', 'serve', () => {}));

gulp.task(
    'watch-static',
    gulp.parallel(done => {
        gulp.watch(
            ['static/xml/**/*', 'static/*.html', 'static/css/*.scss'],
            {
                debounceTimeout: 1000,
            },
            gulp.series('build-dev-static')
        );
        done();
    })
);

gulp.task(
    'watch-html',
    gulp.series(done => {
        console.log('------- watch html ----xxx----');
        gulp.watch(
            ['templates/**/*'],
            {
                debounceTimeout: 1000,
            },
            gulp.series('build-dev-html')
        );
        done();
    })
);

gulp.task('watch', gulp.series('build', 'serve'));

gulp.task('default', gulp.series('watch'));
