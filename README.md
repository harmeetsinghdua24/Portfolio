# Harmeet Singh Dua — Portfolio

A premium, from-scratch personal portfolio for an AI/ML Engineer & Python Developer.
Built as a static site — no framework, no build step. Open `index.html` and it runs.

**Live sections:** Hero · About · Experience · Skills · Projects · Certificates ·
Education · Achievements · Contact

---

## Design concept

The visual identity is built around the candidate's actual specialty — retrieval-augmented
generation — rather than generic portfolio decoration:

- **Signature element:** an animated node graph in the hero (`#ragGraph`) depicting a query
  node lighting up paths to retrieved document nodes. It's a literal, on-brief visual for
  someone who builds RAG systems, not a stock illustration.
- **Palette:** near-black void (`#06080d`) with a signal-blue / violet accent pair and a
  mint accent reserved for "success / retrieved" states (active dot, highlights, checkmarks).
- **Type:** Space Grotesk (display) + Inter (body) + JetBrains Mono (technical labels,
  section eyebrows like `// experience`, stat captions). The mono labels are a deliberate
  nod to a developer's actual working environment — terminal comment syntax — instead of
  decorative numbering.
- **Motion:** ambient Three.js particle drift, GSAP-driven parallax and scroll polish,
  AOS scroll reveals, animated skill bars and counters, a custom dot+ring cursor, and a
  branded boot-sequence loader. Motion is layered, not scattered — every effect ties back
  to the "live system" feel (pulsing nodes, flowing dashed edges, typed role line).

All copy is real, sourced from the resume brief and the candidate's public GitHub profile
(`harmeetsinghdua24`) — no Lorem Ipsum anywhere.

---

## Project structure

```
portfolio/
├── index.html          # Full markup — semantic, accessible, SEO meta + JSON-LD
├── style.css            # Design tokens + all component styles, mobile-first breakpoints
├── script.js             # Loader, cursor, nav, particle bg, RAG graph, counters,
│                          # skill bars, AOS/GSAP init, contact form validation
├── assets/
│   ├── favicon.svg       # Brand mark (node-graph motif), used as the site favicon
│   └── resume.pdf         # ⚠️ PLACEHOLDER — replace with your real resume before deploying
└── README.md
```

---

## Setup

No build tools, no `npm install`. Everything loads via CDN (Three.js, GSAP, AOS, Typed.js,
Font Awesome, Google Fonts).

1. **Clone or download** this folder.
2. **Already included:**
   - `assets/resume.pdf` — Harmeet's real resume, wired to every download button.
   - `assets/profile.jpg` — real profile photo, cropped square and active in the hero card.
   - All copy across Experience, Skills, Projects, Certificates, Education, and Achievements
     is sourced directly from the resume — no placeholders left.
3. **Open `index.html` directly in a browser**, or serve it locally:
   ```bash
   python3 -m http.server 8080
   # then visit http://localhost:8080
   ```
4. **Deploy** to GitHub Pages, Vercel, Netlify, or any static host — drag-and-drop the
   folder, no configuration required.

---

## Customizing content

Everything is plain HTML — search `index.html` for the section you want to edit:

| Section | Anchor / ID | Notes |
|---|---|---|
| Hero | `#home` | Typed.js role list lives in `script.js` → `initTyped()` |
| About | `#about` | Bio paragraphs + mini-timeline |
| Experience | `#experience` | One `.exp-card` per role — duplicate the block to add more |
| Skills | `#skills` | Animated bars (`data-level="0-100"`) + chip cloud |
| Projects | `#projects` | One `.project-card` per project + GitHub stats panel |
| Certificates | `#certificates` | `.cert-card` grid |
| Education | `#education` | `.edu-card` |
| Achievements | `#achievements` | `.achieve-card` grid |
| Contact | `#contact` | Static front-end form — see note below |

### GitHub stats / contribution graph

The Projects section embeds live, auto-updating GitHub stat cards via
`github-readme-stats` and `github-readme-activity-graph` (no API keys needed, just image
URLs keyed to `harmeetsinghdua24`). If you rename your GitHub handle, update the
`username=` query param in the three `<img>` URLs inside the `.github-panel` block.

### Contact form

The form validates on the client (required fields + email format) and shows inline status
messages. It does **not** send real email yet — there's no backend in a static deliverable.
To make it functional, wire `initContactForm()` in `script.js` to:
- [Formspree](https://formspree.io) or [EmailJS](https://www.emailjs.com) (no backend needed), or
- your own serverless function / API route.

The simulated "Sending…" / success state is clearly marked with a comment in `script.js`.

---

## Performance & accessibility notes

- Respects `prefers-reduced-motion`: disables the particle field, RAG graph spin, AOS
  animations, and counter easing for users who request it.
- Custom cursor and particle canvas are skipped entirely on touch devices.
- Visible focus states (`:focus-visible`) on every interactive element.
- Semantic landmarks (`header`, `main`, `section`, `footer`), descriptive `aria-label`s on
  icon-only buttons/links, `aria-live` status region on the contact form.
- All images use `loading="lazy"` where applicable; fonts are preconnected.
- JSON-LD `Person` structured data + Open Graph / Twitter meta tags for clean link previews.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). The particle background
gracefully no-ops if WebGL is unavailable — the grid/gradient backdrop still renders, so
the page never breaks on older hardware or locked-down browsers.

---

Built for **Harmeet Singh Dua** — AI/ML Engineer & Python Developer.
[LinkedIn](https://www.linkedin.com/in/harmeetsinghdua/) ·
[GitHub](https://github.com/harmeetsinghdua24)
