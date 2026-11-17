// Extract possible changed UI strings for human review; this is not a translation or a coverage proof.
const { execFileSync } = require('child_process');
const fs = require('fs');
const [base, head = 'HEAD'] = process.argv.slice(2);
if (!base || !/^[0-9a-f]{40}$/i.test(base) || !/^[0-9a-f]{40}$/i.test(head)) {
  console.error(
    'Usage: node scripts/report-ui-changes.cjs <base SHA> <head SHA>'
  );
  process.exit(2);
}
const diff = execFileSync(
  'git',
  ['diff', '--no-ext-diff', '--unified=0', base, head, '--', 'src/main'],
  { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }
);
let file = '';
const candidates = [];
for (const line of diff.split(/\r?\n/)) {
  if (line.startsWith('+++ b/')) {
    file = line.slice(6);
    continue;
  }
  if (!line.startsWith('+') || line.startsWith('+++')) continue;
  const text = line.slice(1).trim();
  if (!text || /^(\/\/|\*|import |export |\})/.test(text)) continue;
  if (!/[A-Za-z]{3}/.test(text)) continue;
  if (
    !/(?:label|title|message|detail|placeholder|innerText|textContent|innerHTML)\s*[=:]|>[^<]*[A-Za-z]{3}[^<]*</i.test(
      text
    )
  )
    continue;
  candidates.push({ file, text: text.slice(0, 400) });
}
const lines = [
  '# 桌面界面英文变更候选',
  '',
  '此报告仅供人工复核：可能包含误报和遗漏，不表示翻译完整。',
  '请勿自动翻译或修改用户内容、路径、代码和 JupyterLab 网页本体。',
  '如果存在候选项，上游同步 PR 不会自动合并，请先人工复核。',
  ''
];
if (!candidates.length)
  lines.push('未检测到符合规则的界面文本变更；仍需人工检查。');
for (const item of candidates.slice(0, 200)) {
  lines.push(
    `- **${item.file.replace(/[<>`]/g, '')}**: ${item.text.replace(
      /[<>`]/g,
      c => ({ '<': '&lt;', '>': '&gt;', '`': '&#96;' }[c])
    )}`
  );
}
if (candidates.length > 200)
  lines.push(`\n另有 ${candidates.length - 200} 项未列出，请检查完整 diff。`);
const report = lines.join('\n') + '\n';
fs.writeFileSync(
  process.env.UI_REVIEW_REPORT || 'ui-translation-review.md',
  report
);
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `candidate_count=${candidates.length}\n`
  );
}
process.stdout.write(report);
