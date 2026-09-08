import type { PageMeta } from './capture';

/**
 * Deterministic serialisation with recursively sorted object keys, so two
 * structurally identical JSON-LD blocks compare equal regardless of key order.
 * Note: JSON.stringify's array second argument is a key *filter*, not a sorter —
 * using it here would silently drop nested keys (e.g. everything under @graph).
 */
function canon(v: unknown): string {
  const sort = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(sort);
    if (x && typeof x === 'object') {
      return Object.fromEntries(
        Object.keys(x as Record<string, unknown>)
          .sort()
          .map((k) => [k, sort((x as Record<string, unknown>)[k])])
      );
    }
    return x;
  };
  return JSON.stringify(sort(v));
}


/**
 * Normalises the ONE known semantically-equivalent difference between the two builds.
 *
 * index.html declared `initial-scale=1.0`; Next's Viewport type takes a number, and JS
 * serialises 1.0 as "1", so an exact-string match is impossible through the framework.
 * The two values are identical to every browser and produce a 0px pixel diff.
 *
 * This is deliberately a single targeted rewrite rather than skipping the viewport field:
 * any OTHER change to viewport still fails the gate. Excepting the field wholesale would
 * have made 41 routes fail on a semantically-null difference, which trains readers to
 * ignore metadata failures — worse than the difference itself.
 */
function normaliseMetaValue(key: string, value: string | undefined): string | undefined {
  if (value === undefined) return value;
  if (key === 'viewport') return value.replace(/initial-scale=1\.0(?![0-9])/, 'initial-scale=1');
  return value;
}

/** Returns one string per difference. Empty array means identical. */
export function diffMeta(base: PageMeta, cur: PageMeta): string[] {
  const problems: string[] = [];

  if (base.title !== cur.title) {
    problems.push(`title: baseline "${base.title}" vs current "${cur.title}"`);
  }

  const keys = new Set([...Object.keys(base.metas), ...Object.keys(cur.metas)]);
  for (const k of keys) {
    const b = normaliseMetaValue(k, base.metas[k]);
    const c = normaliseMetaValue(k, cur.metas[k]);
    if (b !== c) {
      problems.push(`meta[${k}]: baseline "${base.metas[k] ?? '(missing)'}" vs current "${cur.metas[k] ?? '(missing)'}"`);
    }
  }

  // Canonical is deliberately NOT compared for equality of count against the
  // baseline: the baseline may contain duplicates (see spec Finding 3). The
  // requirement is exactly one canonical in the current build, matching one of
  // the baseline's values.
  if (cur.canonical.length !== 1) {
    problems.push(`canonical: expected exactly 1, found ${cur.canonical.length} -> ${JSON.stringify(cur.canonical)}`);
  } else if (base.canonical.length && !base.canonical.includes(cur.canonical[0])) {
    problems.push(`canonical: "${cur.canonical[0]}" not among baseline ${JSON.stringify(base.canonical)}`);
  }

  const baseLd = base.jsonLd.map(canon).sort();
  const curLd = cur.jsonLd.map(canon).sort();
  if (baseLd.length !== curLd.length) {
    problems.push(`json-ld: baseline has ${baseLd.length} block(s), current has ${curLd.length}`);
  } else {
    baseLd.forEach((b, i) => {
      if (b !== curLd[i]) problems.push(`json-ld[${i}] differs:\n  baseline: ${b}\n  current:  ${curLd[i]}`);
    });
  }

  return problems;
}
