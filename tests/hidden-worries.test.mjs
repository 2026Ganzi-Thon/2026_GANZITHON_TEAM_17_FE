import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../youth-app/src/hiddenWorries.ts',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {hiddenWorryIds,hideWorry}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
function storage(){const rows=new Map();return {getItem:key=>rows.get(key)??null,setItem:(key,value)=>rows.set(key,value)}}
test('hiding persists across reloads, is idempotent, and keeps users separate',()=>{
 const store=storage();hideWorry('user-a',7,store);hideWorry('user-a',7,store);hideWorry('user-a',8,store);
 assert.deepEqual(hiddenWorryIds('user-a',store),[7,8]);assert.deepEqual(hiddenWorryIds('user-b',store),[]);
 hideWorry('user-b',9,store);assert.deepEqual(hiddenWorryIds('user-a',store),[7,8]);assert.deepEqual(hiddenWorryIds('user-b',store),[9]);
});
test('invalid hidden data does not hide unrelated worries or crash the list',()=>{
 const store=storage();for(const raw of ['invalid','{}','null']){store.setItem('a-hidden',raw);assert.deepEqual(hiddenWorryIds('a',store),[])}
 store.setItem('a-hidden','[7,"8",null,-1,0,2.5]');assert.deepEqual(hiddenWorryIds('a',store),[7]);
});
test('storage failure is not reported as a completed hide',()=>{
 assert.throws(()=>hideWorry('a',7,{getItem:()=>null,setItem(){throw Error('quota')}}),/quota/);
});
