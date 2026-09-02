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

/** Returns one string per difference. Empty array means identical. */
export function diffMeta(base: PageMeta, cur: PageMeta): string[] {
  const problems: string[] = [];

  if (base.title !== cur.title) {
    problems.push(`title: baseline "${base.title}" vs current "${cur.title}"`);
  }

  const keys = new Set([...Object.keys(base.metas), ...Object.keys(cur.metas)]);
  for (const k of keys) {
    if (base.metas[k] !== cur.metas[k]) {
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
