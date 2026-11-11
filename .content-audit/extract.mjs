import fs from 'node:fs';
import ts from 'typescript';
const text = fs.readdirSync(new URL('.', import.meta.url)).filter(n => /^live-.*\.js$/.test(n)).map(n => fs.readFileSync(new URL(n, import.meta.url), 'utf8')).join('\n');
const ast = ts.createSourceFile('live.js', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
const strings = [];
function walk(n) {
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
    if (n.text.length > 15 && /[a-zA-Z]{3}/.test(n.text) && !/^[\w/-]+$/.test(n.text)) strings.push(n.text);
  }
  ts.forEachChild(n, walk);
}
walk(ast);
fs.writeFileSync(new URL('live-copy.txt', import.meta.url), [...new Set(strings)].join('\n'));
console.log('Extracted ' + strings.length + ' strings');
for (const term of ['68.5', '50,000', '371', '290', '348', '115', '0.6', '1.2', '2.78', 'RERA', 'revenue', '66%', '24/7', 'sq ft', 'sq.ft']) {
  console.log('\nTERM: ' + term);
  console.log([...new Set(strings)].filter(s => s.toLowerCase().includes(term.toLowerCase())).join('\n').slice(0, 2200));
}
