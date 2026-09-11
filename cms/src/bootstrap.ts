import fs from "fs";
import path from "path";
import type { Core } from "@strapi/strapi";

const ADMIN_EMAIL = "admin@dentel.local";
const ADMIN_PASSWORD = "DentelAdmin123!";
const API_TOKEN_NAME = "Dentel website";

const PUBLIC_ACTIONS = [
  "api::product.product.find",
  "api::product.product.findOne",
  "api::category.category.find",
  "api::category.category.findOne",
  "api::article.article.find",
  "api::article.article.findOne",
  "api::testimonial.testimonial.find",
  "api::testimonial.testimonial.findOne",
  "api::site-setting.site-setting.find",
  "api::home-page.home-page.find",
  "api::about-page.about-page.find",
  "api::contact-submission.contact-submission.create",
];

type Strapi = Core.Strapi;

function docs(strapi: Strapi, uid: string) {
  return (
    strapi as unknown as {
      documents: (id: string) => {
        create: (input: { data: Record<string, unknown> }) => Promise<{ id?: number; documentId?: string }>;
        publish: (input: { documentId: string }) => Promise<unknown>;
        count: () => Promise<number>;
      };
    }
  ).documents(uid);
}

function websiteEnvPath() {
  return path.resolve(process.cwd(), "..", ".env.local");
}

function imageDir() {
  return path.resolve(process.cwd(), "..", "public", "images");
}

function upsertEnv(filePath: string, values: Record<string, string>) {
  let text = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  if (text && !text.endsWith("\n")) {
    text += "\n";
  }

  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    if (pattern.test(text)) {
      text = text.replace(pattern, line);
    } else {
      text += `${line}\n`;
    }
  }

  fs.writeFileSync(filePath, text, "utf8");
}

function paragraph(text: string) {
  return {
    type: "paragraph",
    children: [{ type: "text", text }],
  };
}

function heading(text: string, level = 2) {
  return {
    type: "heading",
    level,
    children: [{ type: "text", text }],
  };
}

async function createPublished(strapi: Strapi, uid: string, data: Record<string, unknown>) {
  const created = await docs(strapi, uid).create({ data });
  const documentId = (created as { documentId?: string } | null)?.documentId;
  if (documentId) {
    await docs(strapi, uid).publish({ documentId });
  }
  return created as { id?: number; documentId?: string };
}

async function ensureAdmin(strapi: Strapi) {
  const existing = await strapi.db.query("admin::user").findOne({
    where: { email: ADMIN_EMAIL },
  });
  if (existing) {
    return;
  }

  const superAdmin = await strapi.db.query("admin::role").findOne({
    where: { code: "strapi-super-admin" },
  });
  if (!superAdmin) {
    strapi.log.warn("Super admin role missing; skip creating Dentel admin user.");
    return;
  }

  await strapi.service("admin::user").create({
    email: ADMIN_EMAIL,
    firstname: "Dentel",
    lastname: "Admin",
    password: ADMIN_PASSWORD,
    isActive: true,
    roles: [superAdmin.id],
    registrationToken: null,
  });

  strapi.log.info(`Created admin user ${ADMIN_EMAIL}`);
}

async function enablePublicPermissions(strapi: Strapi) {
  const publicRole = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
  });
  if (!publicRole) {
    strapi.log.warn("Public role missing; skip public permissions.");
    return;
  }

  for (const action of PUBLIC_ACTIONS) {
    const existing = await strapi.db.query("plugin::users-permissions.permission").findOne({
      where: { action, role: publicRole.id },
    });
    if (existing) {
      continue;
    }

    await strapi.db.query("plugin::users-permissions.permission").create({
      data: {
        action,
        role: publicRole.id,
      },
    });
  }

  strapi.log.info("Public API permissions are in place.");
}

async function ensureWebsiteToken(strapi: Strapi) {
  const envFile = websiteEnvPath();
  const current = fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf8") : "";
  const hasToken = /^STRAPI_API_TOKEN=.+$/m.test(current);

  upsertEnv(envFile, {
    NEXT_PUBLIC_STRAPI_URL: "http://localhost:1337",
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  });

  if (hasToken) {
    return;
  }

  const existing = await strapi.db.query("admin::api-token").findOne({
    where: { name: API_TOKEN_NAME },
  });
  if (existing) {
    strapi.log.warn(
      "API token already exists in Strapi but is missing from .env.local. Create a new token in Settings → API Tokens if needed.",
    );
    return;
  }

  const created = await strapi.service("admin::api-token").create({
    name: API_TOKEN_NAME,
    description: "Server token for the Dentel Next.js website",
    type: "full-access",
    lifespan: null,
  });

  const accessKey = (created as { accessKey?: string }).accessKey;
  if (!accessKey) {
    strapi.log.warn("API token was created but no access key was returned.");
    return;
  }

  upsertEnv(envFile, { STRAPI_API_TOKEN: accessKey });
  strapi.log.info("Wrote STRAPI_API_TOKEN to the website .env.local file.");
}

async function uploadImage(strapi: Strapi, filename: string, alternativeText: string) {
  const filePath = path.join(imageDir(), filename);
  if (!fs.existsSync(filePath)) {
    strapi.log.warn(`Seed image missing: ${filename}`);
    return null;
  }

  const already = await strapi.db.query("plugin::upload.file").findOne({
    where: { name: filename },
  });
  if (already) {
    return already as { id: number; documentId?: string };
  }

  const stats = fs.statSync(filePath);
  const uploaded = await strapi.plugin("upload").service("upload").upload({
    data: {
      fileInfo: {
        name: filename,
        alternativeText,
        caption: alternativeText,
      },
    },
    files: {
      filepath: filePath,
      originalFilename: filename,
      mimetype: "image/jpeg",
      size: stats.size,
    },
  });

  const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
  return (file as { id: number; documentId?: string } | undefined) ?? null;
}

function mediaRef(file: { id: number } | null) {
  return file?.id ?? undefined;
}

async function seedIfEmpty(strapi: Strapi) {
  const existingCount = await docs(strapi, "api::product.product").count();
  if (existingCount > 0) {
    return;
  }

  strapi.log.info("Seeding Dentel starter content…");

  const operatory = await uploadImage(strapi, "operatory.jpg", "A calm, light-filled dental operatory");
  const instruments = await uploadImage(strapi, "instruments.jpg", "Precision dental handpieces");
  const clinic = await uploadImage(strapi, "clinic.jpg", "Modern dental imaging suite");
  const clinical = await uploadImage(strapi, "clinical.jpg", "Clinician preparing instruments");
  const tools = await uploadImage(strapi, "tools.jpg", "Dental hygiene instruments on a tray");
  const chair = await uploadImage(strapi, "chair.jpg", "Contemporary dental chair and light");
  const portrait1 = await uploadImage(strapi, "portrait-1.jpg", "Portrait");
  const portrait2 = await uploadImage(strapi, "portrait-2.jpg", "Portrait");
  const portrait3 = await uploadImage(strapi, "portrait-3.jpg", "Portrait");

  const categories = [
    {
      name: "Clinical Systems",
      slug: "clinical-systems",
      description: "Handpieces and chairside systems balanced for all-day procedures.",
      image: mediaRef(instruments),
    },
    {
      name: "Imaging",
      slug: "imaging",
      description: "Quiet, high-fidelity imaging for diagnosis without theatre.",
      image: mediaRef(clinic),
    },
    {
      name: "Hygiene",
      slug: "hygiene",
      description: "Ultrasonic and prophylaxis tools with restrained acoustics.",
      image: mediaRef(tools),
    },
    {
      name: "Operatory",
      slug: "operatory",
      description: "Chairs, delivery, and lighting specified as a single system.",
      image: mediaRef(chair),
    },
  ];

  const categoryIds: Record<string, string> = {};
  for (const category of categories) {
    const created = await createPublished(strapi, "api::category.category", category);
    if (created.documentId) {
      categoryIds[category.slug] = created.documentId;
    }
  }

  const products = [
    {
      name: "Apex One Handpiece",
      slug: "apex-one-handpiece",
      price: 1280,
      featured: true,
      shortDescription: "A balanced high-speed handpiece with a notably quiet turbine.",
      description:
        "The Apex One is machined for all-day chairside work. Its turbine is tuned for a lower acoustic profile, the grip is slightly longer than the category standard, and service intervals are documented in hours of use rather than calendar months.",
      image: mediaRef(instruments),
      additionalImages: [mediaRef(tools), mediaRef(clinical)].filter(Boolean),
      category: categoryIds["clinical-systems"],
      specifications: [
        { label: "Speed", value: "320,000 rpm" },
        { label: "Weight", value: "48 g" },
        { label: "Coupling", value: "ISO 9168" },
        { label: "Service interval", value: "1,200 clinical hours" },
      ],
    },
    {
      name: "Lumen Curing Light",
      slug: "lumen-curing-light",
      price: 640,
      featured: true,
      shortDescription: "A focused LED curing light with even output and a calm interface.",
      description:
        "Lumen delivers a consistent beam without a cluttered control surface. Output modes are limited to what a practice actually uses, and the battery cycle is specified for a full clinical day.",
      image: mediaRef(tools),
      category: categoryIds["clinical-systems"],
      specifications: [
        { label: "Wavelength", value: "385–515 nm" },
        { label: "Modes", value: "Standard, ramp, pulse" },
        { label: "Battery", value: "Full-day cycle" },
      ],
    },
    {
      name: "Contour Ultrasonic Scaler",
      slug: "contour-ultrasonic-scaler",
      price: 890,
      featured: true,
      shortDescription: "An ultrasonic scaler tuned for tactile feedback rather than volume.",
      description:
        "Contour keeps power in the tip and noise out of the room. The handpiece is light enough for hygiene days, and the waterline is designed for straightforward clinic maintenance.",
      image: mediaRef(clinical),
      category: categoryIds.hygiene,
      specifications: [
        { label: "Frequency", value: "28–32 kHz" },
        { label: "Tips", value: "6 included" },
        { label: "Waterline", value: "Autoclavable cassette" },
      ],
    },
    {
      name: "Nova Intraoral Scanner",
      slug: "nova-intraoral-scanner",
      price: 4200,
      featured: true,
      shortDescription: "A compact scanner for practices moving to digital without spectacle.",
      description:
        "Nova is built for adoption: a smaller wand, a shorter learning curve, and files that leave the room without a proprietary maze. Calibration is designed to happen between patients, not overnight.",
      image: mediaRef(clinic),
      additionalImages: [mediaRef(operatory)].filter(Boolean),
      category: categoryIds.imaging,
      specifications: [
        { label: "Wand weight", value: "210 g" },
        { label: "Full-arch scan", value: "Under 60 seconds" },
        { label: "Export", value: "STL, PLY, OBJ" },
      ],
    },
    {
      name: "Helix Impression System",
      slug: "helix-impression-system",
      price: 1150,
      featured: false,
      shortDescription: "A restorative impression kit specified for repeatable margins.",
      description:
        "Helix is a complete impression workflow with materials and trays selected to reduce retakes. It is intended for practices that still want analog certainty alongside digital options.",
      image: mediaRef(tools),
      category: categoryIds["clinical-systems"],
      specifications: [
        { label: "Set", value: "Trays, material, adhesive" },
        { label: "Working time", value: "2 minutes" },
      ],
    },
    {
      name: "Meridian Chair Unit",
      slug: "meridian-chair-unit",
      price: 8900,
      featured: true,
      shortDescription: "An operatory chair and delivery unit designed as one system.",
      description:
        "Meridian treats the chair, light, and delivery as a single composition. Movement is quiet, upholstery is specified for clinical cleaning, and service access is from the rear without dismantling the room.",
      image: mediaRef(chair),
      additionalImages: [mediaRef(operatory)].filter(Boolean),
      category: categoryIds.operatory,
      specifications: [
        { label: "Positions", value: "Programmable 4-point" },
        { label: "Upholstery", value: "Medical-grade, seam-minimized" },
        { label: "Delivery", value: "Rear or side configuration" },
      ],
    },
  ];

  for (const product of products) {
    await createPublished(strapi, "api::product.product", product);
  }

  await createPublished(strapi, "api::article.article", {
    title: "What a quieter operatory actually changes",
    slug: "quieter-operatory",
    excerpt:
      "Noise is rarely listed as a clinical KPI. Patients feel it immediately, and so do the people who work eight hours inside it.",
    featured: true,
    category: "Practice",
    coverImage: mediaRef(operatory),
    author: {
      name: "Mira Ellison",
      role: "Clinical design lead",
      avatar: mediaRef(portrait1),
    },
    content: [
      paragraph(
        "Most operatories accumulate sound the way they accumulate equipment: one well-intentioned purchase at a time. The result is a room that works, but never quite settles.",
      ),
      heading("Treat acoustics as a specification"),
      paragraph(
        "When handpieces, suction, and scalers are specified together, the room changes character. Conversations stay in a normal register. Patients stop bracing for the next surge of noise.",
      ),
    ],
  });

  await createPublished(strapi, "api::article.article", {
    title: "Service intervals measured in clinical hours",
    slug: "service-intervals",
    excerpt:
      "Calendar-based maintenance is convenient for vendors. Hour-based maintenance is more honest for a busy practice.",
    featured: false,
    category: "Operations",
    coverImage: mediaRef(instruments),
    author: {
      name: "Jonah Reed",
      role: "Service director",
      avatar: mediaRef(portrait2),
    },
    content: [
      paragraph(
        "A handpiece used in a high-volume hygiene program should not share a maintenance calendar with one used twice a week. Dentel documents service against actual use so practices can plan without guesswork.",
      ),
    ],
  });

  await createPublished(strapi, "api::article.article", {
    title: "Moving to digital without the theatre",
    slug: "digital-without-theatre",
    excerpt:
      "Intraoral scanning should shorten the appointment, not add a second performance in the corner of the room.",
    featured: false,
    category: "Digital",
    coverImage: mediaRef(clinic),
    author: {
      name: "Amina Shah",
      role: "Product",
      avatar: mediaRef(portrait3),
    },
    content: [
      paragraph(
        "Adoption fails when the scanner is treated as a spectacle. The better test is whether a full-arch scan fits between conversation and dismissal, and whether the file leaves the practice without a proprietary maze.",
      ),
    ],
  });

  await createPublished(strapi, "api::testimonial.testimonial", {
    name: "Dr. Helen Cho",
    role: "Principal, Cho & Atelier",
    message:
      "The Apex One is the first handpiece in a decade that my associates did not argue about. It simply stays out of the way.",
    avatar: mediaRef(portrait1),
    rating: 5,
  });
  await createPublished(strapi, "api::testimonial.testimonial", {
    name: "Dr. Marcus Pell",
    role: "Group clinical lead, Northline",
    message:
      "We specified Meridian across eight rooms. Service access from the rear has already saved us two days of downtime we used to treat as normal.",
    avatar: mediaRef(portrait2),
    rating: 5,
  });
  await createPublished(strapi, "api::testimonial.testimonial", {
    name: "Lila Ortiz, RDH",
    role: "Hygiene director",
    message:
      "Contour is the first scaler I can use through a full day without bracing my wrist. Patients notice the quieter room before I mention it.",
    avatar: mediaRef(portrait3),
    rating: 5,
  });

  await createPublished(strapi, "api::site-setting.site-setting", {
    siteName: "Dentel",
    tagline: "Precision dental systems",
    description:
      "Dentel designs clinical instruments and operatory systems for practices that value quiet precision, lasting materials, and unhurried care.",
    phone: "+1 (212) 555-0148",
    email: "hello@dentel.studio",
    address: "418 Mercer Street, New York, NY 10012",
    hours: "Monday–Friday, 9:00–18:00 ET",
    footerContent:
      "Dentel designs and services precision dental systems for independent practices and clinical groups.",
    socialLinks: [
      { label: "instagram", url: "https://instagram.com" },
      { label: "linkedin", url: "https://linkedin.com" },
      { label: "x", url: "https://x.com" },
    ],
  });

  await createPublished(strapi, "api::home-page.home-page", {
    heroEyebrow: "Clinical systems",
    heroTitle: "Instruments made for unhurried precision.",
    heroBody:
      "Dentel builds operatory tools with a quieter kind of ambition: exact tolerances, considered materials, and a service relationship that lasts longer than a product cycle.",
    heroImage: mediaRef(operatory),
    heroPrimaryCtaLabel: "View the collection",
    heroPrimaryCtaHref: "/products",
    heroSecondaryCtaLabel: "Speak with us",
    heroSecondaryCtaHref: "/contact",
    promoEyebrow: "Practice partnership",
    promoTitle: "A calibration-first relationship, not a catalog drop.",
    promoBody:
      "From chairside handpieces to imaging, every Dentel system is specified with service intervals, parts availability, and training support already in the room.",
    promoImage: mediaRef(clinical),
    ctaTitle: "Specify the next operatory with a quieter standard.",
    ctaBody:
      "Tell us about your rooms, your volume, and the work you want to feel effortless. We will prepare a considered recommendation.",
  });

  await createPublished(strapi, "api::about-page.about-page", {
    title: "A quieter standard for the operatory.",
    introduction:
      "Dentel began with a simple observation: the best clinical work is rarely loud. It is repeatable, well-balanced, and designed around the hand that uses it every hour of the day.",
    missionTitle: "Mission",
    mission:
      "To design dental systems that disappear into skilled hands — reducing friction, protecting longevity, and giving clinicians more of the hour for the patient in the chair.",
    values: [
      {
        title: "Material honesty",
        body: "We specify steels, ceramics, and finishes for how they age in a real operatory, not how they photograph on a launch day.",
      },
      {
        title: "Serviceable by design",
        body: "Wear parts, calibration, and documentation are part of the product, not an afterthought sold later as a plan.",
      },
      {
        title: "Clinical quiet",
        body: "Balance, noise, and tactile feedback are treated as design constraints equal to power and speed.",
      },
    ],
    statistics: [
      { value: "14", label: "Years in clinical manufacturing" },
      { value: "2,400+", label: "Practices equipped" },
      { value: "48h", label: "Average service dispatch" },
      { value: "12", label: "Countries supported" },
    ],
    ctaTitle: "Visit the studio, or start remotely.",
    ctaBody:
      "Whether you are specifying a single room or a multi-site group, we will map the right system with the same care.",
  });

  strapi.log.info("Starter content is published.");
}

async function runStep(strapi: Strapi, label: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (error) {
    strapi.log.error(
      `${label} failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function bootstrapCms(strapi: Strapi) {
  await runStep(strapi, "Admin user", () => ensureAdmin(strapi));
  await runStep(strapi, "Public permissions", () => enablePublicPermissions(strapi));
  await runStep(strapi, "Website API token", () => ensureWebsiteToken(strapi));
  await runStep(strapi, "Starter content", () => seedIfEmpty(strapi));
}
