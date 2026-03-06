export default function DirectoryPage() {
  const profiles = [
    {
      name: "Nyumbani Serengeti",
      location: "Serengeti National Park",
      slug: "nyumbani-serengeti",
      type: "Camp",
    },
    {
      name: "Hila Camp",
      location: "Tarangire",
      slug: "hila-camp",
      type: "Camp",
    },
  ];

  return (
    <main style={{ padding: "40px" }}>
      <h1>Safari Trade Directory</h1>
      <p style={{ marginTop: "8px" }}>
        Discover camps and trade profiles across the safari industry.
      </p>

      <div style={{ display: "grid", gap: "20px", marginTop: "24px" }}>
        {profiles.map((profile) => (
          <a
            key={profile.slug}
            href={`/profiles/${profile.slug}`}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "black",
            }}
          >
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.7 }}>
              {profile.type}
            </p>
            <h2 style={{ margin: "8px 0" }}>{profile.name}</h2>
            <p>{profile.location}</p>
            <strong>View Profile →</strong>
          </a>
        ))}
      </div>
    </main>
  );
}
