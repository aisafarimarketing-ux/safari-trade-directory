export type ListingKind = "camp" | "tour-operator" | "dmc" | "travel-agent";
export type AccountStatus = "active" | "paused" | "flagged" | "deleted";

export type RoomKey = "family" | "double" | "single";
export type NumDraft = number | "";

export type DownloadableType = "file" | "link";
export type Downloadable = {
  id: string;
  title: string;
  type: DownloadableType;
  url: string;
  mime?: string;
  fileName?: string;
};

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

  class?: string;

  rooms?: NumDraft;
  family?: NumDraft;
  double?: NumDraft;
  single?: NumDraft;

  vibe?: string;

  inclusions?: string[];
  exclusions?: string[];

  freeActivities?: string[];
  paidActivities?: string[];

  offersText?: string;
  terms?: string;

  tradeProfileLabel?: string;
  tradeProfileSub?: string;

  locationLabel?: string;
  mapLink?: string;

  rating?: NumDraft;
  reviewCount?: NumDraft;

  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;

  roomTypeLabels?: Record<RoomKey, string>;
  roomPhotos?: Record<RoomKey, string[]>;

  leadHeadline?: string;
  leadSubcopy?: string;
  leadBullet1?: string;
  leadBullet2?: string;
  leadBullet3?: string;
  leadCta?: string;
  leadDisclaimer?: string;

  contactName?: string;
  contactTitle?: string;
  contactCompany?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWebsite?: string;

  enquiryEmail?: string;
  enquiryWhatsApp?: string;
  enquirySubject?: string;

  downloadables?: Downloadable[];

  taLogoUrl?: string;
  taLink?: string;
  taRating?: NumDraft;
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
      "A hosted safari trade profile for Nyumbani Serengeti. Trade partners can view location, brand details, downloadable materials, room setup, and direct contact information here.",
    published: true,
    featured: true,
    accountStatus: "active",

    logoImage: "",
    coverImage: "",

    class: "Tented (Luxury)",
    rooms: 10,
    family: 2,
    double: 6,
    single: 2,

    vibe: "High-end canvas meets the raw heartbeat of the Serengeti.",

    inclusions: ["Three gourmet meals", "Bottled water", "Laundry"],
    exclusions: ["Park Fees", "Premium Spirits", "Flights"],

    freeActivities: ["Morning Game Drive", "Nature Walk"],
    paidActivities: ["Hot Air Balloon", "Night Drive"],

    offersText: "Stay 5 Pay 4 during Green Season.",
    terms: "30% non-refundable deposit.",

    tradeProfileLabel: "Nyumbani-Collections",
    tradeProfileSub: "Trade profile.",

    locationLabel: "Serengeti National Park, Tanzania",
    mapLink: "https://maps.google.com",

    rating: 4.9,
    reviewCount: 128,

    website: "https://example.com",
    facebookUrl: "https://facebook.com/",
    instagramUrl: "https://instagram.com/nyumbani.collections",
    tiktokUrl: "https://tiktok.com/",
    youtubeUrl: "https://youtube.com/",

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

    leadHeadline: "Get rates, availability & trade support in one reply.",
    leadSubcopy:
      "Leave your details and we’ll send a trade-ready fact sheet and quick quote.",
    leadBullet1: "Agent-ready proposal + net rates",
    leadBullet2: "Seasonality guidance + offers",
    leadBullet3: "Fast response from reservations",
    leadCta: "Request Trade Pack",
    leadDisclaimer:
      "By submitting, you agree to be contacted by our reservations team.",

    contactName: "Nyumbani Reservations",
    contactTitle: "Trade Desk",
    contactCompany: "Nyumbani Collections",
    contactEmail: "trade@nyumbani.example",
    contactPhone: "+255 000 000 000",
    contactWebsite: "https://example.com",

    enquiryEmail: "trade@nyumbani.example",
    enquiryWhatsApp: "+255000000000",
    enquirySubject: "Trade Request / Rates & Availability",

    downloadables: [
      {
        id: "dl-serengeti-factsheet",
        title: "Trade Fact Sheet (Google Drive)",
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
      "A hosted safari trade profile for Nyumbani Tarangire. This listing represents one camp within the Nyumbani Collection, with trade-first materials and direct enquiry options.",
    published: true,
    featured: true,
    accountStatus: "active",

    logoImage: "",
    coverImage: "",

    class: "Tented (Premium)",
    rooms: 12,
    family: 3,
    double: 7,
    single: 2,

    vibe:
      "A warm bush atmosphere with softer pacing and strong nature immersion in Tarangire.",

    inclusions: ["Three meals", "Bottled water", "Shared game drives"],
    exclusions: ["Park fees", "Flights", "Premium beverages"],

    freeActivities: ["Game Drive", "Birding Walk"],
    paidActivities: ["Private Sundowner", "Night Drive"],

    offersText: "Long-stay value offer available in select shoulder months.",
    terms: "Deposit and cancellation policy available on request.",

    tradeProfileLabel: "Nyumbani-Collections",
    tradeProfileSub: "Trade profile.",

    locationLabel: "Tarangire National Park, Tanzania",
    mapLink: "https://maps.google.com",

    rating: 4.7,
    reviewCount: 84,

    website: "https://example.com",
    facebookUrl: "https://facebook.com/",
    instagramUrl: "https://instagram.com/nyumbani.collections",
    tiktokUrl: "https://tiktok.com/",
    youtubeUrl: "https://youtube.com/",

    roomTypeLabels: {
      family: "Family tent",
      double: "Double tent",
      single: "Single tent",
    },

    roomPhotos: {
      family: [],
      double: [],
      single: [],
    },

    leadHeadline: "Ask for rates, fit, and trade support.",
    leadSubcopy:
      "Send a quick enquiry and receive a trade-ready response from reservations.",
    leadBullet1: "Fast turnaround for trade partners",
    leadBullet2: "Clear fit guidance by client type",
    leadBullet3: "Useful current offers and positioning",
    leadCta: "Request Trade Pack",
    leadDisclaimer:
      "By submitting, you agree to be contacted by our reservations team.",

    contactName: "Nyumbani Tarangire Reservations",
    contactTitle: "Trade Desk",
    contactCompany: "Nyumbani Collections",
    contactEmail: "trade@nyumbani.example",
    contactPhone: "+255 000 000 000",
    contactWebsite: "https://example.com",

    enquiryEmail: "trade@nyumbani.example",
    enquiryWhatsApp: "+255000000000",
    enquirySubject: "Trade Request / Rates & Availability",

    downloadables: [
      {
        id: "dl-tarangire-factsheet",
        title: "Trade Fact Sheet (Google Drive)",
        type: "link",
        url: "https://drive.google.com/",
      },
    ],

    taLogoUrl:
      "https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg",
    taLink: "https://www.tripadvisor.com/",
    taRating: 4.3,
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
