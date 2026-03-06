export default function DirectoryPage() {
  const camps = [
    {
      name: "Nyumbani Serengeti",
      location: "Serengeti National Park",
      slug: "nyumbani-serengeti",
    },
    {
      name: "Hila Camp",
      location: "Tarangire",
      slug: "hila-camp",
    },
  ];

  return (
    <main style={{ padding: "40px" }}>
      <h1>Camp Directory</h1>

      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        {camps.map((camp) => (
          <a
            key={camp.slug}
            href={`/camps/${camp.slug}`}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "black",
            }}
          >
            <h2>{camp.name}</h2>
            <p>{camp.location}</p>
            <strong>View Profile →</strong>
          </a>
        ))}
      </div>
    </main>
  );
}
