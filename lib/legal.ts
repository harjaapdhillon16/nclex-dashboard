/**
 * Details shown on the Privacy Policy and Terms pages.
 * Set these in .env.local (or your host's environment) before launch. Until then the
 * bracketed placeholders are shown, so it is obvious what still needs filling in.
 */
export const LEGAL = {
  product: "QREXq",
  entity: process.env.NEXT_PUBLIC_LEGAL_ENTITY ?? "[Legal entity name]",
  email: process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? "[contact email]",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS ?? "[registered address]",
  jurisdiction: process.env.NEXT_PUBLIC_LEGAL_JURISDICTION ?? "[governing jurisdiction]",
  updated: "23 November 2026",
};
