export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="/" className="text-lg font-semibold tracking-tight">
          SafariTrade
        </a>

        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="/match" className="text-white/70 transition hover:text-white">
            Match
          </a>
          <a href="/compare" className="text-white/70 transition hover:text-white">
            Compare
          </a>
          <a href="/directory" className="text-white/70 transition hover:text-white">
            Directory
          </a>
          <a
            href="/companies/nyumbani-collection"
            className="text-white/70 transition hover:text-white"
          >
            Companies
          </a>
          <a href="/workspace" className="text-white/70 transition hover:text-white">
            Workspace
          </a>
          <a
            href="/login"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}
