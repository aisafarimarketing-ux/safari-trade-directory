export type ListingKind = "camp" | "tour-operator" | "dmc" | "travel-agent";
export type AccountStatus = "active" | "paused" | "flagged" | "deleted";

export type MatchAttributes = {
  idealFor: string[];
  customFitNotes?: string;
  budgetBands: string[];
  destinations: string[];
  travelMonths: string[];
  experiences: string[];
  styleTags: string[];
  suitability: string[];
};

export type Listing = {
  id: string;
  ownerAccountId: string;
  slug: string;
  kind: ListingKind;
  companySlug?: string;
  name: string;
  location: string;
  description: string;
  published: boolean;
  featured: boolean;
  accountStatus: AccountStatus;
  logoImage?: string;
  coverImage?: string;
  matchAttributes: MatchAttributes;
};

export const listings: Listing[] = [
  {
    id: "camp-nyumbani-serengeti",
    ownerAccountId: "acct-nyumbani",
    slug: "nyumbani-serengeti",
    kind: "camp",
    companySlug: "nyumbani-collection",
    name: "Nyumbani Serengeti",
    location: "Serengeti National Park",
    description:
      "A hosted safari trade profile for Nyumbani Serengeti. Trade partners can view location, brand details, and contact information here.",
    published: true,
    featured: true,
    accountStatus: "active",
    logoImage: "",
    coverImage: "",
    matchAttributes: {
      idealFor: [
        "honeymoon",
        "luxury-couples",
        "first-safari",
        "special-occasion",
        "photographers",
      ],
      customFitNotes:
        "Also a strong fit for privacy-focused VIP guests, anniversary trips, and high-end celebratory travel.",
      budgetBands: ["premium", "luxury"],
      destinations: ["serengeti"],
      travelMonths: ["june", "july", "august", "september", "october"],
      experiences: ["balloon-safari", "game-drive", "photography"],
      styleTags: ["luxury", "romantic", "exclusive"],
      suitability: ["first-safari", "special-occasion", "couples"],
    },
  },
  {
    id: "camp-nyumbani-tarangire",
    ownerAccountId: "acct-nyumbani",
    slug: "nyumbani-tarangire",
    kind: "camp",
    companySlug: "nyumbani-collection",
    name: "Nyumbani Tarangire",
    location: "Tarangire National Park",
    description:
      "A hosted safari trade profile for Nyumbani Tarangire. This listing represents one camp within the Nyumbani Collection.",
    published: true,
    featured: true,
    accountStatus: "active",
    logoImage: "",
    coverImage: "",
    matchAttributes: {
      idealFor: [
        "family-safari",
        "couples",
        "repeat-safari",
        "birders",
        "nature-lovers",
      ],
      customFitNotes:
        "Works well for travelers who want a warm bush atmosphere, softer pacing, and strong nature immersion without ultra-formal luxury.",
      budgetBands: ["upper-mid", "premium"],
      destinations: ["tarangire"],
      travelMonths: [
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
      ],
      experiences: ["game-drive", "walking-safari", "birding"],
      styleTags: ["warm", "authentic", "nature-led"],
      suitability: ["family-safari", "repeat-safari", "soft-adventure"],
    },
  },
];
