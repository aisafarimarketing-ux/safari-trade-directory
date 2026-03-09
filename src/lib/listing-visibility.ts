import { listings } from "../data/listings";

export type Listing = (typeof listings)[number];

export function isPublicListing(listing: Listing): boolean {
  return listing.published && listing.accountStatus === "active";
}
