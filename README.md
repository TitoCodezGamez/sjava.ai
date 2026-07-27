# Sara Javanmardi, Personal Website

Static personal site built with [Astro](https://astro.build). Single page: hero,
career timeline, education, contact form, plus a coffee-booking dialog.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build for production

```bash
npm run build
npm run preview
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare Pages: **Create project** → connect repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add the custom domain in Cloudflare. It must match `site` in
   `astro.config.mjs`, which the canonical and OG tags are derived from.

## Structure

| Path | What it is |
| --- | --- |
| `src/pages/index.astro` | The only page. Composes the sections. |
| `src/components/Hero.astro` | Parallax hero, cutout image, link row. |
| `src/components/Experience.astro` | Career timeline. Roles are data at the top of the file. |
| `src/components/Education.astro` | Degrees. |
| `src/components/Contact.astro` | Contact form. |
| `src/components/CoffeeModal.astro` | Booking dialog. |
| `src/layouts/BaseLayout.astro` | `<head>`, meta and OG tags, scroll-reveal observer. |

## Booking and contact

Neither the contact form nor the booking dialog has a backend. Both compose a
`mailto:` and hand off to the visitor's email client. For real server-side
delivery, swap the submit handler in `Contact.astro` for a `fetch()` to
Formspree or a Cloudflare Pages Function.

Booking slots are 30 minutes, weekdays, 9am to 4pm, anchored to Pacific Time
rather than the visitor's clock, so bookings land inside Sara's working day.
The constants are at the top of the `<script>` in `CoffeeModal.astro`.

## Themes

Light and dark are defined in `src/styles/themes.css` and switch on a
`data-theme` attribute on `<html>`. There is no visible toggle: the site follows
the visitor's OS preference, with any value in `localStorage` under `theme`
taking precedence.

## Before launch

- `CV_URL` in `Hero.astro` is a placeholder. Point it at the hosted CV.
- The hero cutout is a placeholder SVG. Needs a transparent-background PNG.
- `public/og.png` does not exist yet. Add it at 1200x630, or shared links have
  no preview image.
- The Principal Engineer focus line in `Experience.astro` is a draft. Confirm it.
