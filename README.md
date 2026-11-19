# CYNÉ website

Plain HTML, CSS and JavaScript. No build step: open `index.html` in a browser,
or upload the whole folder to any web host.

## Pages
- `index.html` — home (image slideshow, intro, selected projects)
- `projects.html` — all projects, filterable by discipline
- `project.html` — one project: moodboard, plans, 3D renders (click an image to enlarge)
- `about.html` — about us
- `contact.html` — contact details + form

## Adding a project
1. Make a folder `images/projects/<project-name>/` and put the moodboard, plans and renders in it.
2. Open `js/projects-data.js`, copy one project block and fill it in.
   That's all: the project appears on the projects page (and on the home page if `featured: true`).

The project names and descriptions are placeholders — change them in `js/projects-data.js`.
The moodboard and plans sections appear automatically as soon as you add those images to a project.

## Still to fill in
- E-mail address and Instagram link: search for `info@cyne.be` and `instagram.com` in the five `.html` files.
- Contact form: it opens the visitor's e-mail app. To receive messages without that step,
  connect a form service such as Formspree (see the comment in `js/main.js`).

## Fonts
Cormorant Garamond (headings) and Jost (text), loaded from Google Fonts.
