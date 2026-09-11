# Strapi content model for Dentel

This repository already includes a Strapi 5 app in `cms/`. From the project root:

```bash
npm run cms
```

That command starts [http://localhost:1337/admin](http://localhost:1337/admin), creates the types below, seeds published starter content, and writes `NEXT_PUBLIC_STRAPI_URL` plus `STRAPI_API_TOKEN` into `.env.local`.

Local admin login:

- Email: `admin@dentel.local`
- Password: `DentelAdmin123!`

If you use a hosted Strapi instead, recreate these types there, then point `NEXT_PUBLIC_STRAPI_URL` at that origin. Field names below are the API names the Next.js app reads. Optional fields can be omitted; the frontend will skip them.

The app understands both Strapi 4 (`data.attributes`) and Strapi 5 (flattened documents).

## Collection type: Product

API ID: `product` / `products`

| Field | Type | Required |
| --- | --- | --- |
| name | Text | Yes |
| slug | UID (from name) | Yes |
| price | Decimal / Number | No |
| description | Long text or Rich text | No |
| shortDescription | Text | No |
| image | Media (single) | No |
| additionalImages | Media (multiple) | No |
| category | Relation, many-to-one → Category | No |
| featured | Boolean | No |
| specifications | Repeatable component `product.specification` | No |

Specification component fields: `label` (Text), `value` (Text). A JSON object of key/value pairs is also accepted.

## Collection type: Category

API ID: `category` / `categories`

| Field | Type | Required |
| --- | --- | --- |
| name | Text | Yes |
| slug | UID (from name) | Yes |
| description | Text / Long text | No |
| image | Media (single) | No |

## Collection type: Article

API ID: `article` / `articles`

This is the journal. If you prefer a type named Blog, change `strapiPaths.articles` in `config/site.ts` to `/api/blogs`.

| Field | Type | Required |
| --- | --- | --- |
| title | Text | Yes |
| slug | UID (from title) | Yes |
| excerpt | Text / Long text | No |
| content | Rich text (Blocks) or HTML long text | No |
| coverImage | Media (single) | No |
| author | Text, or relation/component with name, role, avatar | No |
| category | Text, or relation with `name` | No |
| featured | Boolean | No |
| publishedAt | DateTime (Strapi draft/publish is enough) | No |

The frontend renders Blocks JSON and HTML. It will not dump raw JSON on the page.

## Collection type: Testimonial

API ID: `testimonial` / `testimonials`

| Field | Type | Required |
| --- | --- | --- |
| name | Text | Yes |
| role | Text | No |
| message | Long text | Yes |
| avatar | Media (single) | No |
| rating | Integer 1–5 | No |

## Collection type: Contact submission

API ID: `contact-submission` / `contact-submissions`

| Field | Type |
| --- | --- |
| name | Text |
| email | Email |
| phone | Text |
| message | Long text |

Used only by the contact form Server Action. Grant **create**, not **find**, to the token or Public role.

## Single type: Site setting

API ID: `site-setting`

| Field | Type |
| --- | --- |
| siteName | Text |
| tagline | Text |
| description | Long text |
| logo | Media |
| favicon | Media |
| phone | Text |
| email | Email |
| address | Text |
| hours | Text |
| footerContent | Long text |
| socialLinks | Repeatable component with `label` + `url`, or JSON |

If this type is missing, the app falls back to `config/site.ts`.

## Single type: Home page

API ID: `home-page`

| Field | Type |
| --- | --- |
| heroEyebrow | Text |
| heroTitle | Text |
| heroBody | Long text |
| heroImage | Media |
| heroPrimaryCtaLabel | Text |
| heroPrimaryCtaHref | Text |
| heroSecondaryCtaLabel | Text |
| heroSecondaryCtaHref | Text |
| promoEyebrow | Text |
| promoTitle | Text |
| promoBody | Long text |
| promoImage | Media |
| ctaTitle | Text |
| ctaBody | Long text |

Missing fields use the copy in `lib/strapi/normalize.ts`.

## Single type: About page

API ID: `about-page`

| Field | Type |
| --- | --- |
| title | Text |
| introduction | Long text |
| missionTitle | Text |
| mission | Long text |
| values | Repeatable component: `title`, `body` |
| statistics | Repeatable component: `value`, `label` |
| ctaTitle | Text |
| ctaBody | Long text |

## Permissions checklist

- Read: Product, Category, Article, Testimonial, Site setting, Home page, About page
- Create only: Contact submission
- Keep `STRAPI_API_TOKEN` on the server
- Publish entries or they will not appear through the REST API
