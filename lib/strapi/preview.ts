import type {
  AboutContent,
  Article,
  Category,
  HomeContent,
  Product,
  SiteSettings,
  Testimonial,
} from "@/lib/strapi/types";
import { siteConfig } from "@/config/site";

function image(url: string, alternativeText: string): {
  url: string;
  alternativeText: string;
  width: number;
  height: number;
  mime: string;
} {
  return {
    url,
    alternativeText,
    width: 1600,
    height: 1200,
    mime: "image/jpeg",
  };
}

const photos = {
  operatory: "/images/operatory.jpg",
  instruments: "/images/instruments.jpg",
  clinic: "/images/clinic.jpg",
  hands: "/images/clinical.jpg",
  tools: "/images/tools.jpg",
  chair: "/images/chair.jpg",
  portrait1: "/images/portrait-1.jpg",
  portrait2: "/images/portrait-2.jpg",
  portrait3: "/images/portrait-3.jpg",
};

export const previewSettings: SiteSettings = {
  siteName: siteConfig.name,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  logo: null,
  favicon: null,
  phone: siteConfig.phone,
  email: siteConfig.email,
  address: siteConfig.address,
  hours: siteConfig.hours,
  footerContent:
    "Dentel designs and services precision dental systems for independent practices and clinical groups.",
  socialLinks: Object.entries(siteConfig.social).map(([label, url]) => ({
    label,
    url,
  })),
};

export const previewHome: HomeContent = {
  heroEyebrow: "Clinical systems",
  heroTitle: "Instruments made for unhurried precision.",
  heroBody:
    "Dentel builds operatory tools with a quieter kind of ambition: exact tolerances, considered materials, and a service relationship that lasts longer than a product cycle.",
  heroImage: image(photos.operatory, "A calm, light-filled dental operatory"),
  heroPrimaryCtaLabel: "View the collection",
  heroPrimaryCtaHref: "/products",
  heroSecondaryCtaLabel: "Speak with us",
  heroSecondaryCtaHref: "/contact",
  promoEyebrow: "Practice partnership",
  promoTitle: "A calibration-first relationship, not a catalog drop.",
  promoBody:
    "From chairside handpieces to imaging, every Dentel system is specified with service intervals, parts availability, and training support already in the room.",
  promoImage: image(photos.hands, "Clinician preparing instruments"),
  ctaTitle: "Specify the next operatory with a quieter standard.",
  ctaBody:
    "Tell us about your rooms, your volume, and the work you want to feel effortless. We will prepare a considered recommendation.",
};

export const previewAbout: AboutContent = {
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
};

export const previewCategories: Category[] = [
  {
    id: "clinical-systems",
    name: "Clinical Systems",
    slug: "clinical-systems",
    description:
      "Handpieces and chairside systems balanced for all-day procedures.",
    image: image(photos.instruments, "Precision dental handpieces"),
  },
  {
    id: "imaging",
    name: "Imaging",
    slug: "imaging",
    description: "Quiet, high-fidelity imaging for diagnosis without theatre.",
    image: image(photos.clinic, "Modern dental imaging suite"),
  },
  {
    id: "hygiene",
    name: "Hygiene",
    slug: "hygiene",
    description: "Ultrasonic and prophylaxis tools with restrained acoustics.",
    image: image(photos.tools, "Dental hygiene instruments on a tray"),
  },
  {
    id: "operatory",
    name: "Operatory",
    slug: "operatory",
    description: "Chairs, delivery, and lighting specified as a single system.",
    image: image(photos.chair, "Contemporary dental chair and light"),
  },
];

function category(slug: string) {
  const match = previewCategories.find((item) => item.slug === slug);
  return match
    ? { id: match.id, name: match.name, slug: match.slug }
    : null;
}

export const previewProducts: Product[] = [
  {
    id: "apex-one",
    name: "Apex One Handpiece",
    slug: "apex-one-handpiece",
    price: 1280,
    shortDescription: "A balanced high-speed handpiece with a notably quiet turbine.",
    description:
      "The Apex One is machined for all-day chairside work. Its turbine is tuned for a lower acoustic profile, the grip is slightly longer than the category standard, and service intervals are documented in hours of use rather than calendar months.",
    image: image(photos.instruments, "Apex One dental handpiece"),
    additionalImages: [image(photos.tools, "Handpiece detail"), image(photos.hands, "Handpiece in use")],
    category: category("clinical-systems"),
    featured: true,
    specifications: [
      { label: "Speed", value: "320,000 rpm" },
      { label: "Weight", value: "48 g" },
      { label: "Coupling", value: "ISO 9168" },
      { label: "Service interval", value: "1,200 clinical hours" },
    ],
  },
  {
    id: "lumen",
    name: "Lumen Curing Light",
    slug: "lumen-curing-light",
    price: 640,
    shortDescription: "A focused LED curing light with even output and a calm interface.",
    description:
      "Lumen delivers a consistent beam without a cluttered control surface. Output modes are limited to what a practice actually uses, and the battery cycle is specified for a full clinical day.",
    image: image(photos.tools, "Lumen LED curing light"),
    additionalImages: [],
    category: category("clinical-systems"),
    featured: true,
    specifications: [
      { label: "Wavelength", value: "385–515 nm" },
      { label: "Modes", value: "Standard, ramp, pulse" },
      { label: "Battery", value: "Full-day cycle" },
    ],
  },
  {
    id: "contour",
    name: "Contour Ultrasonic Scaler",
    slug: "contour-ultrasonic-scaler",
    price: 890,
    shortDescription: "An ultrasonic scaler tuned for tactile feedback rather than volume.",
    description:
      "Contour keeps power in the tip and noise out of the room. The handpiece is light enough for hygiene days, and the waterline is designed for straightforward clinic maintenance.",
    image: image(photos.hands, "Ultrasonic scaler in clinical use"),
    additionalImages: [],
    category: category("hygiene"),
    featured: true,
    specifications: [
      { label: "Frequency", value: "28–32 kHz" },
      { label: "Tips", value: "6 included" },
      { label: "Waterline", value: "Autoclavable cassette" },
    ],
  },
  {
    id: "nova",
    name: "Nova Intraoral Scanner",
    slug: "nova-intraoral-scanner",
    price: 4200,
    shortDescription: "A compact scanner for practices moving to digital without spectacle.",
    description:
      "Nova is built for adoption: a smaller wand, a shorter learning curve, and files that leave the room without a proprietary maze. Calibration is designed to happen between patients, not overnight.",
    image: image(photos.clinic, "Intraoral scanner beside a monitor"),
    additionalImages: [image(photos.operatory, "Scanner in an operatory")],
    category: category("imaging"),
    featured: true,
    specifications: [
      { label: "Wand weight", value: "210 g" },
      { label: "Full-arch scan", value: "Under 60 seconds" },
      { label: "Export", value: "STL, PLY, OBJ" },
    ],
  },
  {
    id: "helix",
    name: "Helix Impression System",
    slug: "helix-impression-system",
    price: 1150,
    shortDescription: "A restorative impression kit specified for repeatable margins.",
    description:
      "Helix is a complete impression workflow with materials and trays selected to reduce retakes. It is intended for practices that still want analog certainty alongside digital options.",
    image: image(photos.tools, "Impression trays and materials"),
    additionalImages: [],
    category: category("clinical-systems"),
    featured: false,
    specifications: [
      { label: "Set", value: "Trays, material, adhesive" },
      { label: "Working time", value: "2 minutes" },
    ],
  },
  {
    id: "meridian",
    name: "Meridian Chair Unit",
    slug: "meridian-chair-unit",
    price: 8900,
    shortDescription: "An operatory chair and delivery unit designed as one system.",
    description:
      "Meridian treats the chair, light, and delivery as a single composition. Movement is quiet, upholstery is specified for clinical cleaning, and service access is from the rear without dismantling the room.",
    image: image(photos.chair, "Meridian dental chair unit"),
    additionalImages: [image(photos.operatory, "Meridian chair in a clinic")],
    category: category("operatory"),
    featured: true,
    specifications: [
      { label: "Positions", value: "Programmable 4-point" },
      { label: "Upholstery", value: "Medical-grade, seam-minimized" },
      { label: "Delivery", value: "Rear or side configuration" },
    ],
  },
];

export const previewArticles: Article[] = [
  {
    id: "quiet-operatory",
    title: "What a quieter operatory actually changes",
    slug: "quieter-operatory",
    excerpt:
      "Noise is rarely listed as a clinical KPI. Patients feel it immediately, and so do the people who work eight hours inside it.",
    content: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            text: "Most operatories accumulate sound the way they accumulate equipment: one well-intentioned purchase at a time. The result is a room that works, but never quite settles.",
          },
        ],
      },
      {
        type: "heading",
        level: 2,
        children: [{ type: "text", text: "Treat acoustics as a specification" }],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            text: "When handpieces, suction, and scalers are specified together, the room changes character. Conversations stay in a normal register. Patients stop bracing for the next surge of noise.",
          },
        ],
      },
    ],
    coverImage: image(photos.operatory, "Quiet dental operatory"),
    author: { name: "Mira Ellison", role: "Clinical design lead", avatar: image(photos.portrait1, "Mira Ellison") },
    category: "Practice",
    featured: true,
    publishedAt: "2026-04-12",
  },
  {
    id: "service-intervals",
    title: "Service intervals measured in clinical hours",
    slug: "service-intervals",
    excerpt:
      "Calendar-based maintenance is convenient for vendors. Hour-based maintenance is more honest for a busy practice.",
    content:
      "<p>A handpiece used in a high-volume hygiene program should not share a maintenance calendar with one used twice a week. Dentel documents service against actual use so practices can plan without guesswork.</p>",
    coverImage: image(photos.instruments, "Handpiece maintenance"),
    author: { name: "Jonah Reed", role: "Service director", avatar: image(photos.portrait2, "Jonah Reed") },
    category: "Operations",
    featured: false,
    publishedAt: "2026-03-02",
  },
  {
    id: "digital-without-theatre",
    title: "Moving to digital without the theatre",
    slug: "digital-without-theatre",
    excerpt:
      "Intraoral scanning should shorten the appointment, not add a second performance in the corner of the room.",
    content:
      "<p>Adoption fails when the scanner is treated as a spectacle. The better test is whether a full-arch scan fits between conversation and dismissal, and whether the file leaves the practice without a proprietary maze.</p>",
    coverImage: image(photos.clinic, "Digital dentistry workspace"),
    author: { name: "Amina Shah", role: "Product", avatar: image(photos.portrait3, "Amina Shah") },
    category: "Digital",
    featured: false,
    publishedAt: "2026-01-18",
  },
];

export const previewTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Helen Cho",
    role: "Principal, Cho & Atelier",
    message:
      "The Apex One is the first handpiece in a decade that my associates did not argue about. It simply stays out of the way.",
    avatar: image(photos.portrait1, "Dr. Helen Cho"),
    rating: 5,
  },
  {
    id: "2",
    name: "Dr. Marcus Pell",
    role: "Group clinical lead, Northline",
    message:
      "We specified Meridian across eight rooms. Service access from the rear has already saved us two days of downtime we used to treat as normal.",
    avatar: image(photos.portrait2, "Dr. Marcus Pell"),
    rating: 5,
  },
  {
    id: "3",
    name: "Lila Ortiz, RDH",
    role: "Hygiene director",
    message:
      "Contour is the first scaler I can use through a full day without bracing my wrist. Patients notice the quieter room before I mention it.",
    avatar: image(photos.portrait3, "Lila Ortiz"),
    rating: 5,
  },
];
