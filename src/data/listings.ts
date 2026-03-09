export type ListingKind = "camp" | "tour-operator" | "dmc" | "travel-agent";
export type AccountStatus = "active" | "paused" | "flagged" | "deleted";

export type DownloadableType = "file" | "link";

export type Downloadable = {
  id: string;
  title: string;
  type: DownloadableType;
  url: string;
  mime?: string;
  fileName?: string;
};

export type RoomKey = "family" | "double" | "single";

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

export type ListingContactCard = {
  contactName: string;
  contactTitle: string;
  contactCompany: string;
  contactEmail: string;
  contactPhone: string;
  contactWebsite: string;
};

export type ListingLeadCapture = {
  headline: string;
  subcopy: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  cta: string;
  disclaimer: string;
  enquiryEmail: string;
  enquiryWhatsApp: string;
  enquirySubject: string;
};

export type ListingPropertyDetails = {
  rooms?: number;
  family?: number;
  double?: number;
  single?: number;
  roomTypeLabels?: Partial<Record<RoomKey, string>>;
  roomPhotos?: Partial<Record<RoomKey, string[]>>;
  freeActivities?: string[];
  paidActivities?: string[];
  inclusions?: string[];
  exclusions?: string[];
  offersText?: string;
  terms?: string;
  mapLink?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  vibe?: string;
};

export type ListingSocialLinks = {
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
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

  tradeProfileLabel?: string;
  tradeProfileSub?: string;

  propertyDetails?: ListingPropertyDetails;
  socialLinks?: ListingSocialLinks;
  contactCard?: ListingContactCard;
  leadCapture?: ListingLeadCapture;
  downloadables?: Downloadable[];
  taLogoUrl?: string;
  taLink?: string;
  taRating?: number;
  taStyle?: "dots" | "stars";
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
      "A hosted safari trade profile for Nyumbani Serengeti. Trade partners can view location, brand details, contact information, and downloadable trade materials here.",
    published: true,
    featured: true,
    accountStatus: "active",
    logoImage: "",
    coverImage: "",
    tradeProfileLabel: "Nyumbani Collections",
    tradeProfileSub: "Trade Profile",
    propertyDetails: {
      rooms: 10,
      family: 2,
      double: 6,
      single: 2,
      roomTypeLabels: {
        family: "Family setup",
        double: "Double setup",
        single: "Single setup",
      },
      roomPhotos: {
        family: [],
        double: [],
        single: [],
      },
      freeActivities: ["game-drive", "photography"],
      paidActivities: ["balloon-safari"],
      inclusions: ["Three gourmet meals", "Bottled water", "Laundry"],
      exclusions: ["Park fees", "Premium spirits", "Flights"],
      offersText: "Stay 5 Pay 4 during Green Season.",
      terms: "30% non-refundable deposit.",
      mapLink: "https://maps.google.com",
      website: "https://example.com",
      rating: 4.9,
      reviewCount: 128,
      vibe:
        "High-end canvas meets the raw heartbeat of the Serengeti, designed for luxury trade partners and high-value safari clients.",
    },
    socialLinks: {
      facebookUrl: "https://facebook.com/",
      instagramUrl: "https://instagram.com/nyumbani.collections",
      tiktokUrl: "https://tiktok.com/",
      youtubeUrl: "https://youtube.com/",
    },
    contactCard: {
      contactName: "Nyumbani Reservations",
      contactTitle: "Trade Desk",
      contactCompany: "Nyumbani Collections",
      contactEmail: "trade@nyumbani.example",
      contactPhone: "+255 000 000 000",
      contactWebsite: "https://example.com",
    },
    leadCapture: {
      headline: "Get rates, availability & trade support in one reply.",
      subcopy:
        "Leave your details and we’ll send a trade-ready fact sheet and quick quote.",
      bullet1: "Agent-ready proposal + net rates",
      bullet2: "Seasonality guidance + offers",
      bullet3: "Fast response from reservations",
      cta: "Request Trade Pack",
      disclaimer:
        "By submitting, you agree to be contacted by our reservations team.",
      enquiryEmail: "trade@nyumbani.example",
      enquiryWhatsApp: "+255000000000",
      enquirySubject: "Trade Request / Rates & Availability",
    },
    downloadables: [
      {
        id: "dl-nyumbani-serengeti-factsheet",
        title: "Trade Fact Sheet",
        type: "link",
        url: "https://drive.google.com/",
      },
    ],
    taLogoUrl:
      "https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg",
    taLink: "https://www.tripadvisor.com/",
    taRating: 4.5,
    taStyle: "dots",
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
      "A hosted safari trade profile for Nyumbani Tarangire. This listing represents one camp within the Nyumbani Collection and includes trade-useful property information.",
    published: true,
    featured: true,
    accountStatus: "active",
    logoImage: "",
    coverImage: "",
    tradeProfileLabel: "Nyumbani Collections",
    tradeProfileSub: "Trade Profile",
    propertyDetails: {
      rooms: 12,
      family: 3,
      double: 7,
      single: 2,
      roomTypeLabels: {
        family: "Family setup",
        double: "Double setup",
        single: "Single setup",
      },
      roomPhotos: {
        family: [],
        double: [],
        single: [],
      },
      freeActivities: ["game-drive", "birding", "walking-safari"],
      paidActivities: [],
      inclusions: ["Three meals", "Bottled water"],
      exclusions: ["Park fees", "Flights"],
      offersText: "Seasonal offer available on request.",
      terms: "Standard deposit and cancellation policy applies.",
      mapLink: "https://maps.google.com",
      website: "https://example.com",
      rating: 4.7,
      reviewCount: 84,
      vibe:
        "Warm bush atmosphere, softer pacing, and strong nature immersion without ultra-formal luxury.",
    },
    socialLinks: {
      facebookUrl: "https://facebook.com/",
      instagramUrl: "https://instagram.com/",
      tiktokUrl: "https://tiktok.com/",
      youtubeUrl: "https://youtube.com/",
    },
    contactCard: {
      contactName: "Nyumbani Reservations",
      contactTitle: "Trade Desk",
      contactCompany: "Nyumbani Collections",
      contactEmail: "trade@nyumbani.example",
      contactPhone: "+255 000 000 000",
      contactWebsite: "https://example.com",
    },
    leadCapture: {
      headline: "Get rates, availability & trade support in one reply.",
      subcopy:
        "Leave your details and we’ll send a trade-ready fact sheet and quick quote.",
      bullet1: "Agent-ready proposal + net rates",
      bullet2: "Seasonality guidance + offers",
      bullet3: "Fast response from reservations",
      cta: "Request Trade Pack",
      disclaimer:
        "By submitting, you agree to be contacted by our reservations team.",
      enquiryEmail: "trade@nyumbani.example",
      enquiryWhatsApp: "+255000000000",
      enquirySubject: "Trade Request / Rates & Availability",
    },
    downloadables: [
      {
        id: "dl-nyumbani-tarangire-factsheet",
        title: "Trade Fact Sheet",
        type: "link",
        url: "https://drive.google.com/",
      },
    ],
    taLogoUrl:
      "https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg",
    taLink: "https://www.tripadvisor.com/",
    taRating: 4.4,
    taStyle: "dots",
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
