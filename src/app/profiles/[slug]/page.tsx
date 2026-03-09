import { profiles } from "../../../data/profiles";
import { companies } from "../../../data/companies";

type ProfilePageProps = {
  params: {
    slug: string;
  };
};

export default function ProfilePage({ params }: ProfilePageProps) {
  const profile = profiles.find((p) => p.slug === params.slug);

  if (!profile) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white px-6 py-20">
        <h1 className="text-4xl font-semibold">Profile not found</h1>
      </main>
    );
  }

  const company = companies.find(
    (c) => c.slug === profile.companySlug
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white">

      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-100">
              {profile.type}
            </span>

            {company && (
              <a
                href={`/companies/${company.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
              >
                {company.name}
              </a>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            {profile.name}
          </h1>

          <p className="mt-3 text-lg text-white/60">
            {profile.location}
          </p>

        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10">

        <div className="grid gap-10 lg:grid-cols-3">

          {/* Main column */}
          <div className="lg:col-span-2">

            <h2 className="text-2xl font-semibold">
              Overview
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
              {profile.description}
            </p>

            {/* Match attributes */}
            {profile.matchAttributes && (
              <>
                <h3 className="mt-12 text-xl font-semibold">
                  Match Attributes
                </h3>

                <div className="mt-6 flex flex-wrap gap-3">

                  {profile.matchAttributes.clientTypes.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                    >
                      {tag}
                    </span>
                  ))}

                  {profile.matchAttributes.experiences.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                    >
                      {tag}
                    </span>
                  ))}

                  {profile.matchAttributes.styleTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                    >
                      {tag}
                    </span>
                  ))}

                </div>
              </>
            )}

          </div>

          {/* Sidebar */}
          <aside>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

              <h3 className="text-lg font-semibold">
                Trade Tools
              </h3>

              <div className="mt-5 flex flex-col gap-3">

                <a
                  href="/compare"
                  className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950"
                >
                  Compare Camps
                </a>

                <a
                  href="/workspace"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                >
                  Add to Workspace
                </a>

                <a
                  href="/directory"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                >
                  Back to Directory
                </a>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}
