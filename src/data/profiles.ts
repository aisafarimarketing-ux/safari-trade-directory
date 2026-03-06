export type TradeProfile = {
  name: string;
  location: string;
  slug: string;
  type: string;
  description: string;
};

export const profiles: TradeProfile[] = [
  {
    name: "Nyumbani Serengeti",
    location: "Serengeti National Park",
    slug: "nyumbani-serengeti",
    type: "Camp",
    description:
      "A hosted safari trade profile for Nyumbani Serengeti. This is where trade partners will view brand, location, and key listing details.",
  },
  {
    name: "Hila Camp",
    location: "Tarangire",
    slug: "hila-camp",
    type: "Camp",
    description:
      "A hosted safari trade profile for Hila Camp. This page will later include richer trade content and contact tools.",
  },
];
