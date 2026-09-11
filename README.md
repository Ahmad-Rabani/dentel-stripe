# Dentel

Dentel is a Next.js website for a precision dental systems company, with Strapi as the headless CMS.

The app uses the **App Router**, **TypeScript**, and **Tailwind CSS v4**. Content that a client would normally edit — products, categories, journal articles, testimonials, and site settings — is loaded through a single Strapi layer. If Strapi is not configured yet, the UI uses clearly documented **preview content** so you can design and click through the site. That preview data is not presented as live CMS content.

## 1. Install dependencies

```bash
npm install
```

## 2. Start Next.js

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other useful scripts:

```bash
npm run lint
npm run build
npm start
```

## 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Variables:

| Name | Where it is used | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_STRAPI_URL` | Server fetch + `next/image` remote host | Public. Example: `http://localhost:1337`. Leave empty to use preview content. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph | Public. Example: `http://localhost:3000`. |
| `STRAPI_API_TOKEN` | Server-only Authorization header | **Private.** Never prefix this with `NEXT_PUBLIC_`. |

`.env*` files are gitignored. `.env.example` is the only env file that should be committed.

Restart `npm run dev` after changing env vars.

## 4. Start / connect Strapi

1. Run Strapi locally (default `http://localhost:1337`) or use a hosted Strapi project.
2. Create the content types listed below. A field-by-field guide lives in [docs/STRAPI.md](docs/STRAPI.md).
3. Set `NEXT_PUBLIC_STRAPI_URL` to that origin **without a trailing slash**.
4. Create an API token in Strapi (**Settings → API Tokens**) with read access to the public content types, plus create access for `contact-submissions` if you want the contact form to store messages.
5. Put the token in `STRAPI_API_TOKEN`.

When the URL is set, the site talks only to Strapi. If Strapi is down, collection pages show a calm empty/error state instead of crashing.

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
- Preview catalog images are loaded from Unsplash only when Strapi is not configured.
