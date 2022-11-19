Updated from 2015 portfolio.

- Added English version
- Updated libraries
- Updated information
- Updated to ES6

Run the site in dev mode with gulp serve (live reload, JS and SASS transpiling)
Build the site for prod with gulp build (copy static files to dist / babelify, concat, and uglify JS / transpile, concat, and minify CSS)

NOTES as of 18/11

- Bug bash
  ✔︎ Navigating from one project to the next breaks the youtube video
  - AND adds an extra background
  - Navigating from one project (reload here) to projects (close button) breaks footer UI
  - When resizing down, no image background. When resizing up, no slide images
    - Need to listen to resize and set video / slider / image background if necessary

NOTES as of 17/11

- Fixed Project CSS for mobile
- Fixed slide images on mobile
- Fixed image gallery on mobile
- Fixed browser navigation
  Next:
  - Full bug bash
  - Translate!

NOTES as of 16/11

- Fixed Project css, only for desktop
  Next:
  - Fix Project css on mobile
  - Fix slide images on mobile
  - Fix image gallery on mobile
  - Fix back navigation

NOTES as of 14/11

- Updated home, added lately
  Next:
  - Fix Project css, content should be vertically centered (open Batalla 300)
  - Agregar inglés

NOTES as of 13/11

- Load projects
- Finished migration
- Updated about me
- Updated contact, removed form
  Next:
  - Add lately to home

NOTES as of 12/11

- Refactored project
- Main loading logic WIP
  Next:
  - Load projects from home
  - Load projects from projects

NOTES as of 11/11

Fixed:

- ✔︎ Video load
- Buttons not working (this is part of the main loading logic)
- ✔︎ Next button hover effect not working
- ✔︎ Extra info not working
- ✔︎ Images not sliding
  Next:
  - Refactor of project
  - Main loading logic

NOTES as of 9/11

- Started working on project
- Populated data, mostly working
  Next:
  - Video load
  - Buttons not working
  - Next button hover effect not working
  - Extra info not working
  - Images not sliding

NOTES as of 8/11

- Finished projects
  Next:
  - Project

NOTES as of 7/11

- Finished contact "migration"
- Postponed redesign of contact (remove form, add social networks)
  Next:
  - Projects, and project

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
