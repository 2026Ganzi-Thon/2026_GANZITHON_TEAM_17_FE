import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../youth-app/src/worrySorting.ts',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {sortWorries}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const topics=['CAREER','LOVE','FAMILY'];
const rows=[{id:1,tag:'FAMILY',date:'2026-11-19'},{id:2,tag:'CAREER',date:'2026-11-18'},{id:3,tag:'CAREER',date:'2026-11-20'},{id:4,tag:'NEW',date:'2026-11-21'}];
test('피드 최신순·오래된순은 날짜를 기준으로 정렬한다',()=>{
 assert.deepEqual(sortWorries(rows,'latest',topics).map(x=>x.id),[4,3,1,2]);
 assert.deepEqual(sortWorries(rows,'oldest',topics).map(x=>x.id),[2,1,3,4]);
});
test('주제별은 태그 순서와 주제 내 최신순을 적용하고 원본을 보존한다',()=>{
 const before=structuredClone(rows);
 assert.deepEqual(sortWorries(rows,'topic',topics).map(x=>x.id),[3,2,1,4]);
 assert.deepEqual(rows,before);
 assert.deepEqual(sortWorries([],'topic',topics),[]);
});
