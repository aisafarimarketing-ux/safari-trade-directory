import { Listing } from "../data/listings";

export function isPublicListing(listing: Listing): boolean {
  return listing.published === true && listing.accountStatus === "active";
}
