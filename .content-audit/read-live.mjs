import fs from 'node:fs';
const html = await (await fetch('https://memcoskyline.com/')).text();
fs.writeFileSync(new URL('live-home.html', import.meta.url), html);
const path = html.match(/src="([^"]*static\/js\/main[^"]*)/)[1];
const bundle = await (await fetch(new URL(path, 'https://memcoskyline.com'))).text();
fs.writeFileSync(new URL('live-main.js', import.meta.url), bundle);
console.log('Saved public HTML and bundle: ' + bundle.length + ' bytes');
console.log([...new Set([...bundle.matchAll(/path:"([^"]+)"/g)].map(m => m[1]))].join('\n'));
const chunkMap = bundle.match(/n\.u=e=>"static\/js\/"\+e\+"\."\+\{([^}]+)\}/)[1];
await Promise.all([...chunkMap.matchAll(/(\d+):"([a-f0-9]+)"/g)].map(async ([, id, hash]) => {
  const url = `https://memcoskyline.com/static/js/${id}.${hash}.chunk.js`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(url + ': ' + response.status);
  fs.writeFileSync(new URL(`live-${id}.js`, import.meta.url), await response.text());
}));
console.log('Saved all 16 published page chunks for text inspection.');
