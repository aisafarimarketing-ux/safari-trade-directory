import { profiles } from "../../../data/profiles";

type PreviewPageProps = {
  params: {
    slug: string;
  };
};

export default function PreviewPage({ params }: PreviewPageProps) {
  const profile = profiles.find((p) => p.slug === params.slug);

  if (!profile) {
    return (
      <main className="p-10">
        <h1>Preview not found</h1>
      </main>
    );
  }

  return (
    <main className="p-10">
      <p className="text-sm opacity-60">Preview Mode</p>

      <h1 className="text-4xl font-bold mt-4">{profile.name}</h1>
      <p className="mt-2">{profile.location}</p>

      <div className="mt-8 border p-6 rounded-xl">
        <h2 className="text-xl font-semibold">Trade Profile Preview</h2>
        <p className="mt-2">{profile.description}</p>
      </div>
    </main>
  );
}
