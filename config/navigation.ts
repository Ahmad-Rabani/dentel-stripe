export const mainNavigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerNavigation = {
  company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ],
  catalog: [
    { href: "/products", label: "All products" },
    { href: "/categories", label: "Categories" },
  ],
} as const;
