# Dentel

Dentel is a Next.js website for a precision dental systems company, with Strapi as the headless CMS.

The app uses the **App Router**, **TypeScript**, and **Tailwind CSS v4**. Content that a client would normally edit — products, categories, journal articles, testimonials, and site settings — is loaded through a single Strapi layer. If Strapi is not configured yet, the UI uses clearly documented **preview content** so you can design and click through the site. That preview data is not presented as live CMS content.

## 1. Install dependencies

```bash
npm install
npm --prefix cms install
```

## 2. Start the website and CMS

This repo includes a local Strapi app in `cms/`. Run both from the project root, in two terminals:

```bash
npm run cms
npm run dev
```

- Website: [http://localhost:3000](http://localhost:3000)
- Strapi admin: [http://localhost:1337/admin](http://localhost:1337/admin)

The first `npm run cms` start creates the admin user, public API permissions, starter catalog, and writes `.env.local` for Next.js.

Local admin login:

- Email: `admin@dentel.local`
- Password: `DentelAdmin123!`

Change that password in Strapi after the first login.

Other useful scripts:

```bash
npm run lint
npm run build
npm start
npm run cms:start
```

Restart `npm run dev` after `.env.local` changes.

## 3. Configure environment variables

`.env.local` is created automatically the first time Strapi starts. You can also copy the example file:

```bash
cp .env.example .env.local
```

Variables:

| Name | Where it is used | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_STRAPI_URL` | Server fetch + `next/image` remote host | Public. Local default: `http://localhost:1337`. Leave empty to use preview content. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph | Public. Example: `http://localhost:3000`. |
| `STRAPI_API_TOKEN` | Server-only Authorization header | **Private.** Never prefix this with `NEXT_PUBLIC_`. Written by Strapi on first boot. |

`.env*` files are gitignored. `.env.example` is the only env file that should be committed.

## 4. How Strapi is connected

The content types, permissions, and seed data already live in `cms/`. A field-by-field reference is in [docs/STRAPI.md](docs/STRAPI.md).

When `NEXT_PUBLIC_STRAPI_URL` is set, the site talks only to Strapi. If Strapi is down, collection pages show a calm empty/error state instead of crashing.

## 5. Required Strapi content types

Collection types:

- **Product** (`products`)
- **Category** (`categories`)
- **Article** (`articles`) — this is the journal / blog
- **Testimonial** (`testimonials`)
- **Contact submission** (`contact-submissions`) — created by the contact form

Single types:

- **Site setting** (`site-setting`)
- **Home page** (`home-page`)
- **About page** (`about-page`)

API path names are centralized in `config/site.ts` (`strapiPaths`). Change them there if your Strapi API IDs differ.

## 6. Required relations

- Product → Category (many-to-one)
- Product.image and Product.additionalImages → Media
- Category.image → Media
- Article.coverImage → Media
- Article.author can be a string **or** a relation with `name`, `role`, `avatar`
- Testimonial.avatar → Media
- Site setting.logo / favicon → Media
- Home page.heroImage / promoImage → Media

## 7. Required permissions

For a public marketing site, either:

- Grant **find** / **findOne** on Product, Category, Article, Testimonial, Site setting, Home page, and About page to the Public role, **or**
- Keep those types private and use a server-only API token (recommended).

For the contact form:

- Allow **create** on Contact submission for the token (or Public, if you accept the spam risk).
- Do **not** allow Public users to find contact submissions.

The Next.js app never sends `STRAPI_API_TOKEN` to the browser. Queries run in Server Components and Server Actions.

## 8. How the React app talks to Strapi

```
Server Component / Server Action
        ↓
lib/strapi/queries.ts     getProducts(), getArticleBySlug(), …
        ↓
lib/strapi/client.ts      base URL, token, fetch, errors
        ↓
lib/strapi/normalize.ts   Strapi v4/v5 payloads → clean app objects
        ↓
UI components             product.name, product.image, …
```

Components do not call Strapi URLs. Media URLs are resolved with `getStrapiMediaUrl()`.

If `NEXT_PUBLIC_STRAPI_URL` is empty, `queries.ts` returns preview objects from `lib/strapi/preview.ts`. That is development/demo content only.

## 9. How to add new content

1. In Strapi, create or edit an entry (product, article, and so on).
2. Fill the slug. Pages use `/products/[slug]`, `/categories/[slug]`, and `/blog/[slug]`.
3. Upload media and attach relations.
4. Publish the entry.
5. Wait for revalidation (about 60 seconds) or restart the Next.js server.

Homepage hero, promo, and CTA copy live on the **Home page** single type. Header/footer phone, email, and social links live on **Site setting**.

## 10. Deploy

1. Host Strapi and the Next.js app separately (for example Strapi on a VPS or Strapi Cloud; Next.js on Vercel or any Node host).
2. Set `NEXT_PUBLIC_STRAPI_URL`, `NEXT_PUBLIC_SITE_URL`, and `STRAPI_API_TOKEN` on the Next.js host.
3. Allow the Strapi host in `next.config.ts` image `remotePatterns` (localhost and `*.strapiapp.com` are already included; a custom domain is added from `NEXT_PUBLIC_STRAPI_URL` at boot).
4. Run `npm run build` and `npm start`, or use your platform’s Next.js build.

## Architecture

```
app/                         routes, metadata, server actions
components/
  ui/                        buttons, containers, images, states
  layout/                    header, footer, site shell
  sections/                  homepage sections
  products/ categories/ blog/ testimonials/ contact/
config/                      site name, nav, Strapi paths
lib/strapi/                  CMS client, queries, types, normalize, preview
```

The existing App Router + Tailwind setup was kept. There is no `src/` folder because the project already used a root-level `app/` directory.

## Assumptions

- Strapi 4 or 5 REST APIs both work; the normalize layer unwraps `data.attributes` and flattened Strapi 5 documents.
- Journal content is stored as collection type **Article** (`/api/articles`), not `blogs`.
- Contact form messages are stored in Strapi when it is connected. The app does not send email on its own.
- Preview catalog images are loaded from `/public/images` only when Strapi is not configured.
- Local Strapi lives in `cms/` and uses SQLite (`.tmp/data.db`). Do not commit `.env` files.
