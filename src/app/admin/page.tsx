"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { companies } from "../../data/companies";
import { listings, type AccountStatus, type ListingKind } from "../../data/listings";

type EditableListing = (typeof listings)[number];

const kindOptions: ListingKind[] = [
  "camp",
  "tour-operator",
  "dmc",
  "travel-agent",
];

const accountStatusOptions: AccountStatus[] = [
  "active",
  "paused",
  "flagged",
  "deleted",
];

const emptyListing = (): EditableListing => ({
  id: `listing-${Date.now()}`,
  ownerAccountId: "acct-demo",
  slug: "",
  kind: "camp",
  companySlug: "",
  name: "",
  location: "",
  description: "",
  published: false,
  featured: false,
  accountStatus: "active",
  logoImage: "",
  coverImage: "",
  matchAttributes: {
    idealFor: [],
    customFitNotes: "",
    budgetBands: [],
    destinations: [],
    travelMonths: [],
    experiences: [],
    styleTags: [],
    suitability: [],
  },
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinTags(values: string[]) {
  return values.join(", ");
}

function getVisibilityLabel(listing: EditableListing) {
  if (listing.accountStatus === "deleted") return "Hidden: deleted";
  if (listing.accountStatus === "flagged") return "Hidden: flagged";
  if (listing.accountStatus === "paused") return "Hidden: paused";
  if (!listing.published) return "Hidden: unpublished";
  return "Live";
}

function getVisibilityTone(listing: EditableListing) {
  const label = getVisibilityLabel(listing);

  if (label === "Live") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (listing.accountStatus === "flagged") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  }

  if (listing.accountStatus === "deleted") {
    return "border-red-400/20 bg-red-400/10 text-red-200";
  }

  return "border-white/15 bg-white/5 text-white/70";
}

export default function AdminPage() {
  const [listingItems, setListingItems] = useState<EditableListing[]>(listings);
  const [selectedId, setSelectedId] = useState<string>(listings[0]?.id ?? "");
  const [saveMessage, setSaveMessage] = useState("");

  const selectedListing = useMemo(() => {
    return (
      listingItems.find((item) => item.id === selectedId) ??
      listingItems[0] ??
      null
    );
  }, [listingItems, selectedId]);

  function updateListing(patch: Partial<EditableListing>) {
    if (!selectedListing) return;

    setListingItems((prev) =>
      prev.map((item) =>
        item.id === selectedListing.id ? { ...item, ...patch } : item,
      ),
    );
  }

  function updateMatchField(
    key: keyof EditableListing["matchAttributes"],
    value: string[] | string,
  ) {
    if (!selectedListing) return;

    setListingItems((prev) =>
      prev.map((item) =>
        item.id === selectedListing.id
          ? {
              ...item,
              matchAttributes: {
                ...item.matchAttributes,
                [key]: value,
              },
            }
          : item,
      ),
    );
  }

  function createNewListing() {
    const next = emptyListing();
    setListingItems((prev) => [next, ...prev]);
    setSelectedId(next.id);
    setSaveMessage("");
  }

  function duplicateListing() {
    if (!selectedListing) return;

    const copy: EditableListing = {
      ...selectedListing,
      id: `listing-${Date.now()}`,
      slug: `${selectedListing.slug || "new-listing"}-copy`,
      name: `${selectedListing.name} Copy`,
      featured: false,
      published: false,
    };

    setListingItems((prev) => [copy, ...prev]);
    setSelectedId(copy.id);
    setSaveMessage("");
  }

  function deleteSelectedListing() {
    if (!selectedListing) return;

    const remaining = listingItems.filter((item) => item.id !== selectedListing.id);
    setListingItems(remaining);
    setSelectedId(remaining[0]?.id ?? "");
    setSaveMessage("");
  }

  function saveChanges() {
    setSaveMessage("Changes saved in local admin state.");
    setTimeout(() => setSaveMessage(""), 2500);
  }

  function exportJson() {
    const blob = new Blob(
      [JSON.stringify(listingItems, null, 2)],
      { type: "application/json" },
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "listings-export.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  if (!selectedListing) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white md:px-10">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            SafariTrade Admin
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            No listings loaded
          </h1>
          <p className="mt-4 text-white/65">
            Create your first listing to begin editing.
          </p>

          <button
            type="button"
            onClick={createNewListing}
            className="mt-8 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950"
          >
            Create Listing
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                SafariTrade Admin
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                Listing Editor
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
                Manage SafariTrade listings from the unified listings model.
                Edit media, publishing state, company links, and match data from
                one admin view.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/directory"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
              >
                Directory
              </Link>
              <button
                type="button"
                onClick={exportJson}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={saveChanges}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950"
              >
                Save Changes
              </button>
            </div>
          </div>

          {saveMessage ? (
            <div className="mt-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              {saveMessage}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={createNewListing}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
                >
                  New Listing
                </button>
                <button
                  type="button"
                  onClick={duplicateListing}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={deleteSelectedListing}
                  className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-200"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Listings
              </p>

              <div className="mt-4 space-y-3">
                {listingItems.map((item) => {
                  const isActive = item.id === selectedListing.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full rounded-[24px] border p-4 text-left transition ${
                        isActive
                          ? "border-white/20 bg-white/[0.08]"
                          : "border-white/10 bg-black/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold">
                            {item.name || "Untitled listing"}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">
                            {item.kind.replace("-", " ")}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getVisibilityTone(
                            item,
                          )}`}
                        >
                          {getVisibilityLabel(item)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-white/55">
                        {item.location || "No location yet"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[5/2] border-b border-white/10 bg-neutral-900">
                {selectedListing.coverImage ? (
                  <>
                    <img
                      src={selectedListing.coverImage}
                      alt={`${selectedListing.name} cover`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-300/15 via-white/5 to-emerald-300/10" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
                  </>
                )}

                <div className="absolute bottom-5 left-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] border border-white/15 bg-black/35 shadow-lg backdrop-blur">
                  {selectedListing.logoImage ? (
                    <img
                      src={selectedListing.logoImage}
                      alt={`${selectedListing.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="px-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                      {(selectedListing.name || "NL").slice(0, 2)}
                    </span>
                  )}
                </div>

                <div className="absolute right-5 top-5">
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getVisibilityTone(
                      selectedListing,
                    )}`}
                  >
                    {getVisibilityLabel(selectedListing)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-3xl font-semibold">
                  {selectedListing.name || "Untitled listing"}
                </h2>
                <p className="mt-2 text-sm text-white/55">
                  {selectedListing.location || "No location yet"}
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Core Listing Data
                </p>

                <div className="mt-5 grid gap-4">
                  <Field label="Name">
                    <input
                      value={selectedListing.name}
                      onChange={(e) =>
                        updateListing({ name: e.target.value })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    />
                  </Field>

                  <Field label="Slug">
                    <div className="flex gap-3">
                      <input
                        value={selectedListing.slug}
                        onChange={(e) =>
                          updateListing({ slug: e.target.value })
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateListing({
                            slug: slugify(selectedListing.name || ""),
                          })
                        }
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                      >
                        Generate
                      </button>
                    </div>
                  </Field>

                  <Field label="Location">
                    <input
                      value={selectedListing.location}
                      onChange={(e) =>
                        updateListing({ location: e.target.value })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      rows={5}
                      value={selectedListing.description}
                      onChange={(e) =>
                        updateListing({ description: e.target.value })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Kind">
                      <select
                        value={selectedListing.kind}
                        onChange={(e) =>
                          updateListing({
                            kind: e.target.value as ListingKind,
                          })
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                      >
                        {kindOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Company">
                      <select
                        value={selectedListing.companySlug || ""}
                        onChange={(e) =>
                          updateListing({
                            companySlug: e.target.value || undefined,
                          })
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                      >
                        <option value="">Independent</option>
                        {companies.map((company) => (
                          <option key={company.slug} value={company.slug}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Publishing & Media
                </p>

                <div className="mt-5 grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Published">
                      <select
                        value={String(selectedListing.published)}
                        onChange={(e) =>
                          updateListing({
                            published: e.target.value === "true",
                          })
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    </Field>

                    <Field label="Featured">
                      <select
                        value={String(selectedListing.featured)}
                        onChange={(e) =>
                          updateListing({
                            featured: e.target.value === "true",
                          })
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Account Status">
                    <select
                      value={selectedListing.accountStatus}
                      onChange={(e) =>
                        updateListing({
                          accountStatus: e.target.value as AccountStatus,
                        })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    >
                      {accountStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Logo Image URL">
                    <input
                      value={selectedListing.logoImage || ""}
                      onChange={(e) =>
                        updateListing({ logoImage: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    />
                  </Field>

                  <Field label="Cover Image URL">
                    <input
                      value={selectedListing.coverImage || ""}
                      onChange={(e) =>
                        updateListing({ coverImage: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Match Attributes
              </p>

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                <Field label="Ideal For">
                  <input
                    value={joinTags(selectedListing.matchAttributes.idealFor)}
                    onChange={(e) =>
                      updateMatchField("idealFor", parseTags(e.target.value))
                    }
                    placeholder="honeymoon, family-safari, photographers"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  />
                </Field>

                <Field label="Budget Bands">
                  <input
                    value={joinTags(selectedListing.matchAttributes.budgetBands)}
                    onChange={(e) =>
                      updateMatchField("budgetBands", parseTags(e.target.value))
                    }
                    placeholder="upper-mid, premium, luxury"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  />
                </Field>

                <Field label="Destinations">
                  <input
                    value={joinTags(selectedListing.matchAttributes.destinations)}
                    onChange={(e) =>
                      updateMatchField("destinations", parseTags(e.target.value))
                    }
                    placeholder="serengeti, tarangire"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  />
                </Field>

                <Field label="Travel Months">
                  <input
                    value={joinTags(selectedListing.matchAttributes.travelMonths)}
                    onChange={(e) =>
                      updateMatchField("travelMonths", parseTags(e.target.value))
                    }
                    placeholder="june, july, august"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  />
                </Field>

                <Field label="Experiences">
                  <input
                    value={joinTags(selectedListing.matchAttributes.experiences)}
                    onChange={(e) =>
                      updateMatchField("experiences", parseTags(e.target.value))
                    }
                    placeholder="game-drive, walking-safari"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  />
                </Field>

                <Field label="Style Tags">
                  <input
                    value={joinTags(selectedListing.matchAttributes.styleTags)}
                    onChange={(e) =>
                      updateMatchField("styleTags", parseTags(e.target.value))
                    }
                    placeholder="luxury, romantic, exclusive"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  />
                </Field>

                <Field label="Suitability">
                  <input
                    value={joinTags(selectedListing.matchAttributes.suitability)}
                    onChange={(e) =>
                      updateMatchField("suitability", parseTags(e.target.value))
                    }
                    placeholder="first-safari, couples, soft-adventure"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  />
                </Field>

                <Field label="Custom Fit Notes">
                  <textarea
                    rows={5}
                    value={selectedListing.matchAttributes.customFitNotes || ""}
                    onChange={(e) =>
                      updateMatchField("customFitNotes", e.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                    Preview Links
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    Open current listing pages
                  </h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`/profiles/${selectedListing.slug}`}
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
                  >
                    Public Profile
                  </a>

                  {selectedListing.companySlug ? (
                    <a
                      href={`/companies/${selectedListing.companySlug}`}
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Company Page
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      {children}
    </label>
  );
}
