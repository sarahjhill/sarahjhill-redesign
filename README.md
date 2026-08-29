# Sarah J Hill

**Websites for women who get underestimated.**
Cardiff &amp; Birmingham · [sarahjhill.com](https://sarahjhill.com)

Hand-written HTML, CSS and JavaScript. No framework, no build step, no
dependencies, nothing that can rot. Edit a file, run `./deploy.sh`, done.

| | |
| --- | --- |
| **Performance** | 100 |
| **Accessibility** | 100 |
| **Best Practices** | 100 |
| **SEO** | 100 |

Measured with the Lighthouse CLI, mobile preset.
First paint 1.2s · Largest paint 1.6s · Blocking time 10ms · Layout shift 0.

---

## Deploying

**Every change:** `./deploy.sh "what I changed"`

Full instructions, first-time setup and the custom-domain switch are in
**[DEPLOY.md](DEPLOY.md)**.

## Planning

**[STORYBOARD.md](STORYBOARD.md)** — the eleven scenes, what each one is for,
and the rule that every animation has to carry meaning.

**[seed-project.sh](seed-project.sh)** — populates GitHub Project #12 with the
storyboard and the backlog in one command. Needs the GitHub CLI with project
scope. **[PROJECT-ITEMS.md](PROJECT-ITEMS.md)** is the same list to add by hand.

## The strategy

**[POSITIONING.md](POSITIONING.md)** is the document this site is built from.
If a change disagrees with that file, one of the two is wrong.

---

## File structure

```
index.html              The page
404.html                Not-found page
deploy.sh               One-command deploy
CNAME                   (add this only when switching the domain over)

assets/
  css/
    01-tokens.css       Colours, reset, base type
    02-layout.css       Progress bar, nav, hero, section shells, buttons
    03-components.css   Everything that repeats inside a section
    04-motion.css       Reduced-motion overrides (loaded last, wins)
    05-scene.css        The hero dragon's box and the ember line
    06-globe.css        The contact globe
  js/
    main.js             All behaviour, indexed at the top of the file
    globe.js            The dot globe (no libraries, 2KB land mask)
    dragon.js           The dot dragon (same technique, 4KB silhouette)
  img/                  Photographs and screenshots

robots.txt              Search engine instructions
sitemap.xml             Page list for search engines
favicon.svg             Tab icon
```

The CSS is numbered because **load order matters** — later files override
earlier ones. Keep the numbers if you add a file.

---

## The design

**The hero animation is the argument.** Three seconds is how long someone takes
to decide about you, so the page takes three seconds. A counter ticks 3 → 2 → 1
while a flame line crosses the top and the headline sits blurred and undecided.
At zero it snaps sharp and the label reads *"they have decided"*. There is a
**Watch it again** button because people want one.

**The 3-second test** is the centrepiece. Two electricians, a real countdown,
and the visitor picks one. Then the reveal: they are the same electrician —
one just put the proof where the doubt was. It makes the argument happen to
the reader instead of being told to them. It runs once, when you scroll to it.

**The dragon** sits in the lower-right of the hero, drawn the same way as the contact
globe: a dot field on canvas, no libraries and no image file. The silhouette is
1,816 points sampled on a 7px grid and packed one byte per axis — about 4KB for
the whole animal. It breathes, blinks, and throws a stream of flame particles
across the **whole** hero, dimming as it travels so it is fire at the dragon and
faint embers by the time it passes under the headline. The dots run hotter the
closer they are to its head. The hero's sub-headline is the line that explains
it: *Content is king. Yours should be breathing fire.*

The particles are stamped from one pre-rendered sprite rather than building a
radial gradient per particle per frame — the first version cost 90ms of blocking
time and dropped Performance to 99. They are capped at 190 on screen.

**The contact globe** is your own `globe.js`, retimed to the new palette —
amber land, flame arcs landing on Cardiff. Still no libraries, still a 2KB
base64 land mask instead of a map image.

**Other movement:** the progress bar becomes a scroll indicator once the
countdown finishes; a light follows the cursor across the hero; sections rise
as they come into view; counters count; the nav sticks and marks where you are.

Everything above is switched off for anyone with **reduce motion** enabled.
They get the finished state immediately and the page still makes complete sense.

---

## Editing

### Colours

Top of `assets/css/01-tokens.css`:

```css
--ink:   #0a0a0c;   /* near-black background   */
--paper: #f6f3ed;   /* warm cream              */
--flame: #ff3b1f;   /* the accent. Passion.    */
--amber: #ffb020;   /* highlights on dark      */
```

Change `--flame` and the whole site changes personality in one line.

### Adding a row

```html
<div class="row stand">
  <div>
    <h3>Title here</h3>
    <p>One plain sentence.</p>
  </div>
  <div class="payoff"><em>You get</em><b>The payoff.</b></div>
</div>
```

`class="stand"` makes anything rise into view on scroll. Put it on new things.

### The countdown timing

In `assets/js/main.js` the interval is `1000`ms; in `02-layout.css` the
`#tick.run` animation is `3s`. **They have to agree** or the bar and the
numbers drift apart.

---

## SEO

- Title, meta description, canonical, Open Graph and Twitter cards all set.
- **JSON-LD structured data** in `index.html` — `ProfessionalService` with
  founder, areas served, and both offers (Doubt Audit, SJH Process). This is
  what gets you a rich result rather than a plain blue link.
- `sitemap.xml` and `robots.txt` are wired up.
- One `<h1>`, then `<h2>`s in order. Search engines and screen readers both
  read the page by its headings.
- Every image has an `alt` and explicit `width`/`height` — which is also why
  layout shift is 0.

**Keywords it targets:** web design for tradeswomen · websites for female
electricians · woman web designer Cardiff · web designer Birmingham ·
accessible small business websites · charity and community project websites ·
free website audit Cardiff.

**What actually moves the needle next**, in order:
1. A **Google Business Profile** for Cardiff. For local search this outweighs
   everything on this list.
2. Get listed on tradeswomen directories and networks — those backlinks are
   worth more than any on-page tweak.
3. One page per trade (`/electricians`, `/plumbers`) once you have a case study
   for each. Specific pages rank; a general one doesn't.

---

## Accessibility

- Skip link, landmarks, one `h1`, headings in order.
- Every interactive thing is a real `<button>` or `<a>` — keyboard and screen
  reader work with no extra code.
- Visible focus rings in amber, never removed.
- The countdown and progress bar are `aria-hidden`; the test result is announced
  through `aria-live` so it isn't silently missed.
- All text passes WCAG AA contrast. Lighthouse accessibility: 100.
- No web fonts, so nothing waits on a third-party server — which is also why
  the largest paint is 1.3s.

---

## Not done yet

- `website-audit.html` and `project-os.html` are **not** in this repo; links
  point at the live site so nothing is broken. Redesign them next.
- The tradeswomen directory doesn't exist yet. When it does, it gets a section.
- More testimonials. The three here are real; more would be better.
- **A photograph of you actually working** would do more for this page than
  anything else on this list.
