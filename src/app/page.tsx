import ThemeToggle from "@/components/ThemeToggle";

// Temporary token demo — replaced by the real sections in the next commits.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-muted">design tokens</span>
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">Kai Okah</h1>
      <p className="text-lg text-muted">
        Near-black / paper-white themes, one warm{" "}
        <span className="text-accent">amber accent</span>, Geist Sans +{" "}
        <span className="font-mono">Geist Mono</span>.
      </p>
      <div className="rounded-lg border border-line bg-card p-4 text-sm">
        Card surface on subtle border.
      </div>
    </main>
  );
}
