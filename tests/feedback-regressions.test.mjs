import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
async function load(path){
 const source=fs.readFileSync(new URL(path,import.meta.url),'utf8').replaceAll('import.meta.env.VITE_API_BASE_URL',JSON.stringify('https://api.example.test'));
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
}
const {resolveApiImageUrl}=await load('../src/imageUrl.ts');
const {navigationFrame}=await load('../src/navigationFrame.ts');
test('server image paths use the backend origin, including saved relative receipts',()=>{
 for(const path of ['/uploads/letter.jpg','uploads/letter.jpg','./uploads/letter.jpg']){
  assert.equal(resolveApiImageUrl(path),'https://api.example.test/uploads/letter.jpg');
 }
 assert.equal(resolveApiImageUrl('/uploads/letter.jpg','https://api.example.test/api/'),'https://api.example.test/uploads/letter.jpg');
});
test('signed image URLs and local previews stay intact',()=>{
 for(const url of ['https://bucket.example.test/a.jpg?signature=abc%2F123&expires=999','blob:https://app.example.test/abc','data:image/jpeg;base64,YWJj'])assert.equal(resolveApiImageUrl(url),url);
 assert.equal(resolveApiImageUrl(null),undefined);
 assert.equal(resolveApiImageUrl('javascript:alert(1)'),undefined);
 assert.equal(resolveApiImageUrl('/uploads/a.jpg',''),undefined);
});
test('navigation follows both app widths and an off-center mobile frame',()=>{
 assert.deepEqual(navigationFrame({left:175,width:393,top:-300,bottom:1300},800),{left:175,width:393,bottom:0,visible:true});
 assert.deepEqual(navigationFrame({left:150,width:440,top:-300,bottom:1300},800),{left:150,width:440,bottom:0,visible:true});
 assert.equal(navigationFrame({left:0,width:320,top:0,bottom:1000},700).width,320);
});
test('navigation stays above the end of the app frame while scrolling',()=>{
 assert.equal(navigationFrame({left:100,width:440,top:-500,bottom:750},800).bottom,50);
 assert.equal(navigationFrame({left:100,width:440,top:-1000,bottom:-1},800).visible,false);
 assert.equal(navigationFrame({left:100,width:440,top:900,bottom:1900},800).visible,false);
 assert.equal(navigationFrame({left:100,width:440,top:-100,bottom:1000},500,100).bottom,0);
});
