export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="text-lg font-semibold tracking-tight">
          SafariTrade
        </a>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm font-medium">

          <a
            href="/match"
            className="text-white/70 hover:text-white transition"
          >
            Match
          </a>

          <a
            href="/compare"
            className="text-white/70 hover:text-white transition"
          >
            Compare
          </a>

          <a
            href="/directory"
            className="text-white/70 hover:text-white transition"
          >
            Directory
          </a>

          <a
            href="/companies"
            className="text-white/70 hover:text-white transition"
          >
            Companies
          </a>

          <a
            href="/workspace"
            className="text-white/70 hover:text-white transition"
          >
            Workspace
          </a>

        </div>
      </div>
    </nav>
  );
}
