Updated from 2015 portfolio.

- Added English version
- Updated libraries
- Updated information
- Updated to ES6

Run the site in dev mode with gulp serve (live reload, JS and SASS transpiling)
Build the site for prod with gulp build (copy static files to dist / babelify, concat, and uglify JS / transpile, concat, and minify CSS)

NOTES as of 6/11

- Finished about me
- Postponed AnimatedLoader
- Started contact
  Next:
  - Finish contact, fix map

NOTES as of 4/11

- Finished gulpfile
- Migrated home and its dependencies
  Next:
  - Instead of loading AnimatedLoader and load next section from within Home and others, trigger an event so that main takes care of it

NOTES as of 3/11

- Fixed serve, there was a loop where a change in main triggered a change and then changed bundle, which triggered an infinite change
  Next:
  - Need to test main.js

NOTES as of 1/11

- Fixed gulpfile, had to change bundle to bundle2.js, otherwise browserSync looked for bundle2.js/ and failed.
  Next:
  - watch is not working properly to re-process js

NOTES as of 31/10

- Implemented live reload and server with browserSync in gulpfile
- Wrote pipelines to copy html, images, and other static files from app to dist
- Processed JS through babel into bundle.js in the same app js directory
  Next:
  - Need to test the JS as it seems to be giving an error

NOTES as of 30/10

- Migrated main.js to ES6
- Need to use gulp to create a server
  Next:
  - I just created browser sync function to see if it works
