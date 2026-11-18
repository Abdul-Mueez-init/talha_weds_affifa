# Wedding Invitation — "Gulnaar" style

A self-contained, single-page wedding invitation website. No build step, no
backend, no dependencies — just HTML, CSS, and JavaScript. Guests open one
link, watch the opening film, scratch to reveal the date, check the countdown,
and RSVP straight to your WhatsApp.

## Files

```
index.html              The whole invitation page
assets/css/styles.css   Main theme + layout
assets/css/extras.css   Extra sections (events, RSVP, contacts, blessings)
assets/js/config.js     ★ EDIT THIS — all your wedding details
assets/js/app.js        Engine: intro, scratch card, countdown, calendar
assets/js/extras.js     Engine: RSVP, events, contacts, blessings
assets/media/           Intro video, poster, background music
assets/images/          Backgrounds, floral divider, scratch frame, venue photo
```

## Customizing (only `assets/js/config.js`)

Open `assets/js/config.js` and fill in every `TODO`-style placeholder:

| Section | What to change |
| --- | --- |
| `couple` | Bride & groom names, parents, "Daughter of"/"Son of" |
| `wedding` | `isoDate` (keep the `+05:30` offset!), `date`, `day`, `time` |
| `venue` | Name, address, and a Google Maps search link |
| `preWeddingEvents` | Mehendi / Walima (or your events) — date, time, map link |
| `program` | The day-of timeline shown on the invite |
| `contacts` | Phone numbers shown on the contact cards |
| `rsvp.whatsapp` | **Your WhatsApp number** with country code — the RSVP button opens WhatsApp with a pre-filled message |
| `rsvp.deadline` / `rsvp.contact` | RSVP deadline text and helper phone number |
| `copy` | All written text: welcome line, story, closing, dua |
| `verse` | The Arabic verse + translation (default: Surah Ar-Rum 30:21) |
| `media` | Intro video/poster paths, background music, gallery photos |
| `theme` | The blush-rose colour palette (all optional) |

The checklist at the top of `config.js` lists everything before you share.

### Changing the intro video / music / photos

Drop your own files into `assets/media/` or `assets/images/` and point
`config.js` at them, e.g. `introVideo: "./assets/media/our-film.mp4"`.
Recommended formats: MP4 (H.264) for video, WebP/JPG for images, MP3 for music.

## Previewing locally

Any static file server works. Easiest options:

```bash
# from this folder, with Python:
python -m http.server 8080
# then open http://localhost:8080
```

Or just double-click `index.html` — everything uses relative paths, so it
works from `file://` too.

## Deploying (free)

The site is 100% static — upload the whole `gulnaar-invite` folder to any
static host:

- **Cloudflare Pages** — drag the folder onto
  <https://dash.cloudflare.com> → Workers & Pages → Create → Pages →
  "Upload assets", or `npx wrangler pages deploy .`
- **Vercel** — `npx vercel` from this folder (or import the folder/Git repo)
- **GitHub Pages / Netlify** — push the folder to a repo and connect it

You will get a link like `https://your-name.pages.dev` that you can share on
WhatsApp. A custom domain can be added in the host's dashboard later.

## How guests experience it

1. Opens the link → full-screen intro film with names and Bismillah
2. Taps to open → scrolls through verse, letter, **scratch-to-reveal date**
   (scratch > ~40% to reveal; Enter/Space works too), live countdown,
   events, venue, **RSVP form → WhatsApp**, blessings & dua, contacts
3. Music toggle (bottom-left) plays a soft track — browsers require a tap
   before audio can start, which the open-gesture covers.

## Notes

- The RSVP form collects name / attending / guests / phone / message and
  opens WhatsApp with everything pre-filled — no backend needed. Responses
  arrive as normal WhatsApp messages.
- "Add to calendar" generates a real `.ics` file; "Google Calendar" opens a
  pre-filled event.
- All media is bundled locally — the site works fully offline after loading
  once (except Google Fonts, which degrade gracefully).
