"use client";

import { useMemo, useState } from "react";
import { listings } from "../../data/listings";

type MatchForm = {
  destination: string;
  experience: string;
  budget: string;
  traveler: string;
};

type MatchResult = {
  listing: (typeof listings)[number];
  score: number;
};

function scoreListing(
  listing: (typeof listings)[number],
  form: MatchForm,
): number {
  let score = 0;

  if (
    form.destination &&
    listing.matchAttributes.destinations.includes(form.destination)
  ) {
    score += 3;
  }

  if (
    form.experience &&
    listing.matchAttributes.experiences.includes(form.experience)
  ) {
    score += 2;
  }

  if (
    form.budget &&
    listing.matchAttributes.budgetBands.includes(form.budget)
  ) {
    score += 2;
  }

  if (
    form.traveler &&
    listing.matchAttributes.idealFor.includes(form.traveler)
  ) {
    score += 2;
  }

  return score;
}

export default function MatchPage() {
  const [form, setForm] = useState<MatchForm>({
    destination: "",
    experience: "",
    budget: "",
    traveler: "",
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const publishedListings = useMemo(
    () => listings.filter((listing) => listing.published),
    [],
  );

  const results: MatchResult[] = useMemo(() => {
    if (!hasSearched) return [];

    return publishedListings
      .map((listing) => ({
        listing,
        score: scoreListing(listing, form),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [form, hasSearched, publishedListings]);

  function runMatch() {
    setHasSearched(true);
  }

  function toggleSelection(slug: string) {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug],
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Match the Perfect Safari
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">
            Find the best listings for a client brief using destination,
            experiences, budget, and traveler fit.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <select
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white outline-none"
              value={form.destination}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, destination: e.target.value }))
              }
            >
              <option value="">Destination</option>
              <option value="serengeti">Serengeti</option>
              <option value="tarangire">Tarangire</option>
              <option value="ngorongoro">Ngorongoro</option>
            </select>

            <select
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white outline-none"
              value={form.experience}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, experience: e.target.value }))
              }
            >
              <option value="">Experience</option>
              <option value="game-drive">Game Drive</option>
              <option value="balloon-safari">Balloon Safari</option>
              <option value="walking-safari">Walking Safari</option>
              <option value="birding">Birding</option>
              <option value="photography">Photography</option>
            </select>

            <select
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white outline-none"
              value={form.budget}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, budget: e.target.value }))
              }
            >
              <option value="">Budget</option>
              <option value="upper-mid">Upper Mid</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>

            <select
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white outline-none"
              value={form.traveler}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, traveler: e.target.value }))
              }
            >
              <option value="">Traveler Type</option>
              <option value="honeymoon">Honeymoon</option>
              <option value="family-safari">Family Safari</option>
              <option value="photographers">Photographers</option>
              <option value="luxury-couples">Luxury Couples</option>
              <option value="first-safari">First Safari</option>
            </select>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={runMatch}
              className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950"
              type="button"
            >
              Find Matches
            </button>

            {selected.length > 1 ? (
              <a
                href={`/compare?items=${selected.join(",")}`}
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white"
              >
                Compare Selected
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        {!hasSearched ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-white/60">
            Select filters and click <span className="font-semibold text-white">Find Matches</span>.
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-white/60">
            No matches found yet. Try broader filters.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {results.map((result) => {
              const isSelected = selected.includes(result.listing.slug);

              return (
                <div
                  key={result.listing.id}
                  className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-100">
                      {result.listing.kind.replace("-", " ")}
                    </span>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      Score {result.score}
                    </div>
                  </div>

                  <div className="mt-6 aspect-[4/3] rounded-[24px] border border-white/10 bg-gradient-to-br from-white/10 to-white/0" />

                  <h2 className="mt-6 text-2xl font-semibold">
                    {result.listing.name}
                  </h2>

                  <p className="mt-2 text-sm text-white/55">
                    {result.listing.location}
                  </p>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/65">
                    {result.listing.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {result.listing.matchAttributes.idealFor
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => toggleSelection(result.listing.slug)}
                      className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                        isSelected
                          ? "bg-amber-400 text-neutral-950"
                          : "border border-white/15 bg-white/5 text-white"
                      }`}
                      type="button"
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>

                    <a
                      href={`/profiles/${result.listing.slug}`}
                      className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
