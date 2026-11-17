// Conservatively prevent automatic upstream merges from changing existing Chinese messages.
const fs = require('fs');
const { execFileSync } = require('child_process');
const ts = require('typescript');

function parseTranslations(source) {
  const file = ts.createSourceFile(
    'zh-CN.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  if (file.parseDiagnostics.length)
    throw new Error('Chinese resource has syntax errors');
  let messages;
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'messages'
    ) {
      if (messages) throw new Error('Duplicate messages object');
      if (!node.initializer || !ts.isObjectLiteralExpression(node.initializer))
        throw new Error('Messages must be a static object');
      messages = new Map();
      for (const entry of node.initializer.properties) {
        if (
          !ts.isPropertyAssignment(entry) ||
          !(ts.isStringLiteral(entry.name) || ts.isIdentifier(entry.name)) ||
          !ts.isStringLiteral(entry.initializer)
        ) {
          throw new Error('Messages must use static string keys and values');
        }
        const key = entry.name.text;
        if (messages.has(key)) throw new Error(`Duplicate message: ${key}`);
        messages.set(key, entry.initializer.text);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  if (!messages || messages.size === 0)
    throw new Error('Chinese messages not found');
  return messages;
}

function findRegressions(previous, current) {
  return Array.from(previous, ([key, value]) => {
    if (!current.has(key)) return `Missing: ${key}`;
    if (current.get(key) !== value) return `Changed: ${key}`;
    return null;
  }).filter(Boolean);
}

if (require.main === module) {
  const base = process.argv[2];
  if (!/^[0-9a-f]{40}$/i.test(base || ''))
    throw new Error('Expected a full base commit SHA');
  const oldSource = execFileSync(
    'git',
    ['show', `${base}:src/main/locales/zh-CN.ts`],
    { encoding: 'utf8' }
  );
  const newSource = fs.readFileSync('src/main/locales/zh-CN.ts', 'utf8');
  const regressions = findRegressions(
    parseTranslations(oldSource),
    parseTranslations(newSource)
  );
  if (regressions.length) {
    console.error(
      'Existing Chinese translations changed or disappeared; manual review required:\n' +
        regressions.join('\n')
    );
    process.exitCode = 1;
  } else {
    console.log('Existing Chinese translations retained');
  }
}
module.exports = { parseTranslations, findRegressions };
