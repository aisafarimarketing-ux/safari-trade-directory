import { profiles } from "@/data/profiles";

type ProfilePageProps = {
  params: {
    slug: string;
  };
};

export default function ProfilePage({ params }: ProfilePageProps) {
  const profile = profiles.find((item) => item.slug === params.slug);

  if (!profile) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Profile not found</h1>
        <p>This trade profile does not exist yet.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px" }}>
      <p style={{ margin: 0, fontSize: "14px", opacity: 0.7 }}>
        {profile.type}
      </p>
      <h1 style={{ marginTop: "8px" }}>{profile.name}</h1>
      <p>{profile.location}</p>

      <div
        style={{
          marginTop: "24px",
          padding: "24px",
          border: "1px solid #ddd",
          borderRadius: "12px",
        }}
      >
        <h2>Trade Profile</h2>
        <p>{profile.description}</p>
      </div>

      <div style={{ marginTop: "24px" }}>
        <a href="/directory">← Back to Directory</a>
      </div>
    </main>
  );
}
