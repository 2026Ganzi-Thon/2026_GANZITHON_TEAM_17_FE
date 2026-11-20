import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url),module={exports:{}};
const code=buildSync({entryPoints:[fileURLToPath(new URL('../src/BottomNavigation.tsx',import.meta.url))],bundle:true,platform:'node',format:'cjs',write:false,external:['react','react/jsx-runtime'],define:{'import.meta.env.BASE_URL':JSON.stringify('/')}}).outputFiles[0].text;
new Function('require','module','exports',code)(require,module,module.exports);
const Nav=module.exports.default;
test('all six role/tab states keep accessible controls and use the original PNG shapes',()=>{
 for(const youth of [false,true])for(const active of ['home','replies','profile']){
  const html=renderToStaticMarkup(createElement(Nav,{youth,active,onSelect(){}}));
  assert.equal((html.match(/<button/g)||[]).length,3);assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
  assert.match(html,/navigation-profile\.png/);assert.match(html,/navigation-replies\.png/);assert.match(html,/mask-image/);assert.match(html,/내 한 올/);assert.doesNotMatch(html,/<svg/);
 }
});
test('supplied PNG dimensions remain unchanged',()=>{
 for(const [name,w,h] of [['navigation-profile.png',364,45],['navigation-replies.png',364,45],['profile-pencil.png',35,35]]){
  const bytes=fs.readFileSync(new URL('../public/brand/'+name,import.meta.url));
  assert.equal(bytes.readUInt32BE(16),w);assert.equal(bytes.readUInt32BE(20),h);
 }
});
