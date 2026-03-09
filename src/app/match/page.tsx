"use client";

import { useState } from "react";
import { profiles } from "../../data/profiles";

type MatchForm = {
  destination: string;
  experience: string;
  budget: string;
  traveler: string;
};

function scoreProfile(profile: any, form: MatchForm) {
  let score = 0;

  if (profile.matchAttributes.destinations.includes(form.destination)) {
    score += 3;
  }

  if (profile.matchAttributes.experiences.includes(form.experience)) {
    score += 2;
  }

  if (profile.matchAttributes.budgetBands.includes(form.budget)) {
    score += 2;
  }

  if (profile.matchAttributes.idealFor.includes(form.traveler)) {
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

  const [results, setResults] = useState<any[]>([]);

  function runMatch() {
    const scored = profiles
      .map((p) => ({
        profile: p,
        score: scoreProfile(p, form),
      }))
      .sort((a, b) => b.score - a.score);

    setResults(scored);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-semibold mb-10">
          Match the Perfect Safari
        </h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <select
            className="bg-neutral-900 border border-white/10 rounded-xl p-3"
            onChange={(e) =>
              setForm({ ...form, destination: e.target.value })
            }
          >
            <option value="">Destination</option>
            <option value="serengeti">Serengeti</option>
            <option value="tarangire">Tarangire</option>
          </select>

          <select
            className="bg-neutral-900 border border-white/10 rounded-xl p-3"
            onChange={(e) =>
              setForm({ ...form, experience: e.target.value })
            }
          >
            <option value="">Experience</option>
            <option value="game-drive">Game Drive</option>
            <option value="balloon-safari">Balloon Safari</option>
            <option value="walking-safari">Walking Safari</option>
            <option value="birding">Birding</option>
          </select>

          <select
            className="bg-neutral-900 border border-white/10 rounded-xl p-3"
            onChange={(e) =>
              setForm({ ...form, budget: e.target.value })
            }
          >
            <option value="">Budget</option>
            <option value="upper-mid">Upper Mid</option>
            <option value="premium">Premium</option>
            <option value="luxury">Luxury</option>
          </select>

          <select
            className="bg-neutral-900 border border-white/10 rounded-xl p-3"
            onChange={(e) =>
              setForm({ ...form, traveler: e.target.value })
            }
          >
            <option value="">Traveler Type</option>
            <option value="couples">Couples</option>
            <option value="honeymoon">Honeymoon</option>
            <option value="family-safari">Family</option>
            <option value="photographers">Photographers</option>
          </select>
        </div>

        <button
          onClick={runMatch}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold mb-12"
        >
          Find Matches
        </button>

        <div className="space-y-6">

          {results.map((r) => (
            <div
              key={r.profile.slug}
              className="border border-white/10 rounded-2xl p-6 bg-white/[0.03]"
            >
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm text-white/40 uppercase">
                    {r.profile.type}
                  </p>

                  <h2 className="text-2xl font-semibold">
                    {r.profile.name}
                  </h2>

                  <p className="text-white/60">
                    {r.profile.location}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-white/40">Match Score</p>
                  <p className="text-3xl font-semibold">{r.score}</p>
                </div>

              </div>

              <p className="mt-4 text-white/70">
                {r.profile.description}
              </p>

              <a
                href={`/profiles/${r.profile.slug}`}
                className="inline-block mt-4 text-sm font-semibold text-amber-300"
              >
                View Profile →
              </a>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
