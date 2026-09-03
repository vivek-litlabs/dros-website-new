export default function ProbeBody() {
  const weights = [100, 200, 300, 400, 500, 600, 700, 800];
  return (
    <main className="bg-base text-ink p-10 space-y-8">
      <h1 className="font-saans text-6xl font-light tracking-[-0.03em]">Heading 1 — Saans light</h1>
      <h2 className="font-saans text-4xl font-normal tracking-[-0.03em]">Heading 2 — Saans normal</h2>
      <h3 className="font-saans text-2xl font-medium">Heading 3 — Saans medium</h3>
      <p className="text-base leading-relaxed max-w-[65ch]">
        The quick brown fox jumps over the lazy dog. 0123456789 — em dash, &ldquo;quotes&rdquo;, &amp; ampersand.
        This paragraph exists to expose ascent-override and line-height drift across builds.
      </p>
      <p className="font-mono text-sm">Geist Mono 0123456789 the quick brown fox</p>
      {weights.map((w) => (
        <p key={w} style={{ fontWeight: w }} className="font-saans text-3xl">
          Saans {w} — Hamburgefonstiv
        </p>
      ))}
      <div className="flex flex-wrap gap-4">
        <span className="rounded-full bg-black px-6 py-3 text-white">Primary surface</span>
        <span className="rounded-full border border-black/20 px-6 py-3">Bordered surface</span>
        <span className="rounded-lg bg-black/5 px-6 py-3">Muted surface</span>
      </div>
    </main>
  );
}
