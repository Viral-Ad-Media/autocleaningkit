# Auto Cleaning Kit

The autocleaningkit.com site, rebuilt from the 19 Oct 2026 WordPress backup with **Next.js 16**, **Tailwind CSS 4**, **Neon Postgres** (via Drizzle ORM) and **Better Auth**.

## What came over from WordPress

The backup had no database dump, so only what lived in files could be recovered:

| Recovered | Source in the backup |
| --- | --- |
| 14 article titles, URLs and dates, 6 categories | Rank Math sitemap cache (`wp-content/uploads/rank-math/*.xml`) |
| 73 product picks (name + image) across the round-ups | Images attached to each article in the same sitemaps |
| 90 images, logo, home-page banners | `wp-content/uploads` (resized to max 1600px) |
| Brand colours and the Hind typeface | Logo artwork and Elementor's local font cache |

**Not recoverable:** the original article text and affiliate links, which lived in the database. The articles were rewritten as new buying guides (`src/content/articles/*.md`, product blurbs in `src/content/product-notes.json`) and loaded by `npm run db:seed`. Product cards show a "Check price" button once a link is added in `/admin`.

> Security note: the WordPress site in the backup was compromised (backdoor mu-plugins, a hidden `system` admin user, and a modified Elementor plugin that served article URLs from an outside server). None of that code or content was carried over.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run db:migrate           # create tables
npm run db:seed              # load the recovered content
npm run create-admin -- you@example.com "a-long-password" "Your Name"
npm run dev
```

Sign in at `/sign-in`, then edit posts at `/admin`.

`DATABASE_URL` can be a Neon connection string (uses the Neon HTTP driver) or any local Postgres URL (uses `pg`), so you can develop offline.

## How it's organised

- `src/app/[slug]` serves both posts and category archives, matching WordPress's top-level URLs (`/best-polishing-machines-2026`, `/exterior`).
- `next.config.ts` redirects the old `-2023` slugs and `/2022/12/18/...` date permalinks to their current URLs.
- `src/app/admin` is the editor (Markdown body, product picks, publish toggle). It's protected by `src/proxy.ts` plus a server-side session check on every page and action.
- Public sign-up is off. Editors are created with `npm run create-admin`. Set `ALLOW_SIGNUP=true` only if you want open registration.
- `src/content/seed.json` is the recovered content; `npm run db:seed -- --force` reloads it (overwrites edits).

## Deploying (Vercel + Neon)

1. Create a Neon project and copy the **pooled** connection string.
2. Import the repo in Vercel and set `DATABASE_URL`, `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` (`https://autocleaningkit.com`).
3. Run `npm run db:migrate && npm run db:seed` once against the Neon database, then `npm run create-admin`.
4. Point the domain at Vercel and retire the old WordPress hosting.
