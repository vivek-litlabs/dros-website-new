import { mkdirSync, writeFileSync } from 'node:fs';
import { REPORT_DIR } from './config';

export interface RouteResult {
  route: string;
  viewport: string;
  pixels: number;
  stable: boolean;
  metaProblems: string[];
  consoleErrors: string[];
  baselinePng: string;
  currentPng: string;
  diffPng: string | null;
}

export function writeReport(results: RouteResult[]): { pass: boolean; failures: number } {
  const failed = results.filter(
    (r) => r.pixels !== 0 || !r.stable || r.metaProblems.length > 0 || r.consoleErrors.length > 0
  );

  const rows = results
    .map((r) => {
      const ok = r.pixels === 0 && r.stable && r.metaProblems.length === 0 && r.consoleErrors.length === 0;
      const imgs = r.diffPng
        ? `<div class="imgs"><img src="../../${r.baselinePng}"><img src="../../${r.currentPng}"><img src="../../${r.diffPng}"></div>`
        : '';
      const notes = [...r.metaProblems, ...r.consoleErrors]
        .map((p) => `<li><pre>${p.replace(/</g, '&lt;')}</pre></li>`)
        .join('');
      return `<tr class="${ok ? 'ok' : 'fail'}">
        <td>${r.route}</td><td>${r.viewport}</td><td>${r.pixels}</td>
        <td>${r.stable ? 'yes' : 'NO'}</td>
        <td>${ok ? 'PASS' : 'FAIL'}</td>
        <td><ul>${notes}</ul>${imgs}</td></tr>`;
    })
    .join('\n');

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(
    `${REPORT_DIR}/index.html`,
    `<!doctype html><meta charset="utf-8"><title>Parity report</title>
<style>
 body{font:14px system-ui;margin:24px}
 table{border-collapse:collapse;width:100%}
 td,th{border:1px solid #ddd;padding:6px;vertical-align:top;text-align:left}
 tr.ok{background:#f3fbf4} tr.fail{background:#fdf3f3}
 .imgs img{max-width:300px;border:1px solid #ccc;margin-right:8px}
 pre{white-space:pre-wrap;margin:0}
</style>
<h1>Parity report</h1>
<p><strong>${results.length - failed.length}/${results.length}</strong> checks passed.</p>
<table><tr><th>Route</th><th>Viewport</th><th>Diff px</th><th>Stable</th><th>Status</th><th>Notes</th></tr>
${rows}</table>`
  );

  return { pass: failed.length === 0, failures: failed.length };
}
