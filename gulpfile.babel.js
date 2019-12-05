const gulp = require("gulp");
const watch = require("gulp-watch");
const ghpages = require("gh-pages");
const connect = require("gulp-connect");
const open = require("gulp-open");
require("./gulp/i18n");
require("./gulp/build");
require("./gulp/plato");

gulp.task(
  "connect",
  gulp.series(done => {
    console.log("starta");
    connect.server({
      root: "www",
      port: 8080,
      livereload: false
    });
    console.log("antes do done");
    done();
    console.log("depois do done");
  })
);

gulp.task(
  "open",
  gulp.series(done => {
    /*gulp.src('www/index.html').pipe(
            open({
                uri: 'http://localhost:8080/',
            })
        );*/
    done();
  })
);

gulp.task(
  "serve",
  gulp.series("open", "connect", done => {
    // watch(['www/*.html']).pipe(connect.reload());
    done();
  })
);

gulp.task(
  "release-branch",
  gulp.series(done => {
    const index = process.argv.indexOf("--branch");
    let option = "";
    if (index <= -1) {
      throw Error("Please specify branch");
    } else {
      option = process.argv[index + 1];
    }
    ghpages
      .publish("www", {
        dest: option,
        add: true
      })
      .then(done);
  })
);

gulp.task(
  "release-master",
  gulp.series(done => {
    ghpages
      .publish("./", {
        src: ["404.md", "LICENSE", "README.md", "CNAME"],
        add: true
      })
      .then(() => {
        ghpages.publish("www", {
          add: true
        });
      })
      .then(done);
  })
);

gulp.task(
  "test-deploy",
  gulp.series("build-min", "serve", () => {})
);

gulp.task(
  "watch-static",
  gulp.parallel(done => {
    gulp.watch(
      ["static/xml/**/*", "static/*.html", "static/css/*.scss"],
      {
        debounceTimeout: 1000
      },
      gulp.series("build-dev-static")
    );
    done();
  })
);

gulp.task(
  "watch-html",
  gulp.series(done => {
    console.log("------- watch html --------");
    gulp.watch(
      ["templates/**/*"],
      {
        debounceTimeout: 1000
      },
      gulp.series("build-dev-html")
    );
    done();
  })
);

gulp.task("watch", gulp.series("build", "serve"));

gulp.task("default", gulp.series("watch"));
