/* ==========================================================================
   CYNÉ — project data
   --------------------------------------------------------------------------
   This is the only file you need to edit to add, remove or change projects.

   For every project:
   1. Make a folder:  images/projects/<slug>/
   2. Put the files in it (moodboard, plans, renders). Any file names work,
      as long as they match what you write below.
   3. Copy one block below, fill it in, and put it in the order you want
      the projects to appear (first = newest / most important).

   - discipline: "Interior architecture", "Spatial design" or "Scenography"
   - featured: true  → the project's renders also appear in the home slideshow
   - location / year: optional; leave "" to hide them
   - moodboard / plans / renders: a section only shows when it has images,
     so you can add the moodboard and plans later.

   NOTE: project names and descriptions below are placeholders — change them.
   ========================================================================== */

window.CYNE_PROJECTS = [
  {
    slug: "courtyard-house",
    title: "Courtyard House",
    discipline: "Interior architecture",
    location: "",
    year: "",
    featured: true,
    cover: "images/projects/courtyard-house/render-1-living-dining.jpg",
    intro:
      "A home in walnut, travertine and paper light. From the entrance, every room opens towards the garden, so daylight and leaf shadows move through the house over the course of the day.",
    moodboard: [
      // { src: "images/projects/courtyard-house/moodboard.jpg", caption: "Materials & colours" }
    ],
    plans: [
      // { src: "images/projects/courtyard-house/plan-ground-floor.jpg", caption: "Ground floor" }
    ],
    renders: [
      { src: "images/projects/courtyard-house/render-1-living-dining.jpg", caption: "Living & dining" },
      { src: "images/projects/courtyard-house/render-2-entrance-hall.jpg", caption: "Entrance hall" },
      { src: "images/projects/courtyard-house/render-3-kitchen.jpg", caption: "Kitchen" },
      { src: "images/projects/courtyard-house/render-4-study.jpg", caption: "Study" }
    ]
  },
  {
    slug: "casa-tropical",
    title: "Casa Tropical",
    discipline: "Interior architecture",
    location: "",
    year: "",
    featured: true,
    cover: "images/projects/casa-tropical/render-1-living-room.jpg",
    intro:
      "Warm wood, terracotta tones and Latin American art. Slatted screens and sheer curtains filter the tropical light, so the rooms stay soft and shaded.",
    moodboard: [],
    plans: [],
    renders: [
      { src: "images/projects/casa-tropical/render-1-living-room.jpg", caption: "Living room" },
      { src: "images/projects/casa-tropical/render-2-dining-room.jpg", caption: "Dining room" }
    ]
  },
  {
    slug: "moonlit-suite",
    title: "Moonlit Suite",
    discipline: "Interior architecture",
    location: "",
    year: "",
    featured: true,
    cover: "images/projects/moonlit-suite/render-1-bedroom.jpg",
    intro:
      "A bedroom in deep green and walnut, lit by paper lanterns. A round opening frames the room beyond: you see a little, and discover the rest slowly.",
    moodboard: [],
    plans: [],
    renders: [
      { src: "images/projects/moonlit-suite/render-1-bedroom.jpg", caption: "Bedroom" },
      { src: "images/projects/moonlit-suite/render-2-bedroom-view.jpg", caption: "View through the screen" }
    ]
  }
];
