import { companies } from "../../../data/companies";
import { profiles } from "../../../data/profiles";

type CompanyPageProps = {
  params: {
    slug: string;
  };
};

export default function CompanyPage({ params }: CompanyPageProps) {
  const company = companies.find((item) => item.slug === params.slug);

  if (!company) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            Companies
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Company not found
          </h1>
          <p className="mt-4 text-white/65">
            This company page does not exist yet.
          </p>
        </div>
      </main>
    );
  }

  const companyProfiles = profiles.filter(
    (profile) => profile.companySlug === company.slug,
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            {company.type}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            {company.name}
          </h1>
          <p className="mt-4 text-white/60">{company.location}</p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
            {company.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Company Portfolio
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Listings under this umbrella
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {companyProfiles.map((profile) => (
            <div
              key={profile.slug}
              className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-100">
                {profile.type}
              </span>

              <div className="mt-6 aspect-[4/3] rounded-[24px] border border-white/10 bg-gradient-to-br from-white/10 to-white/0" />

              <h3 className="mt-6 text-2xl font-semibold">{profile.name}</h3>
              <p className="mt-2 text-sm text-white/55">{profile.location}</p>
              <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/65">
                {profile.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`/profiles/${profile.slug}`}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
                >
                  View Profile
                </a>
                <a
                  href="/compare"
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                >
                  Compare
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
