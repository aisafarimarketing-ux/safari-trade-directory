export default function HomePage() {
  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <p style={{ margin: 0, fontSize: "14px", opacity: 0.7 }}>
        Safari Trade Directory
      </p>

      <h1 style={{ marginTop: "12px", fontSize: "42px" }}>
        A trade directory for safari camps and travel businesses
      </h1>

      <p style={{ marginTop: "16px", fontSize: "18px" }}>
        Camps, safari brands, DMCs, tour operators, and travel agents can
        create hosted trade profiles and be discovered by industry partners.
      </p>

      <div style={{ display: "flex", gap: "16px", marginTop: "30px" }}>
        <a
          href="/directory"
          style={{
            padding: "14px 18px",
            border: "1px solid black",
            borderRadius: "8px",
            textDecoration: "none",
            color: "black",
            fontWeight: "600",
          }}
        >
          Explore Directory
        </a>

        <a
          href="/admin"
          style={{
            padding: "14px 18px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            textDecoration: "none",
            color: "black",
          }}
        >
          Open Admin
        </a>
      </div>
    </main>
  );
}
