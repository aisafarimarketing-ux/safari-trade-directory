export type TradeProfile = {
  name: string;
  location: string;
  slug: string;
  type: string;
  description: string;
  companySlug: string;
};

export const profiles: TradeProfile[] = [
  {
    name: "Nyumbani Serengeti",
    location: "Serengeti National Park",
    slug: "nyumbani-serengeti",
    type: "Camp",
    description:
      "A hosted safari trade profile for Nyumbani Serengeti. Trade partners can view location, brand details, and contact information here.",
    companySlug: "nyumbani-collection",
  },
  {
    name: "Nyumbani Tarangire",
    location: "Tarangire National Park",
    slug: "nyumbani-tarangire",
    type: "Camp",
    description:
      "A hosted safari trade profile for Nyumbani Tarangire. This listing represents one camp within the Nyumbani Collection.",
    companySlug: "nyumbani-collection",
  },
];
