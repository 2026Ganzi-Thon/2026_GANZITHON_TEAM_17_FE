import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../youth-app/src/noticeDates.ts',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {noticeDay,noticeTime}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('알림의 오늘 구분은 UTC 날짜가 아닌 한국 자정을 기준으로 한다',()=>{
 assert.equal(noticeDay('2026-11-18T14:59:59Z'),'2026-11-18');
 assert.equal(noticeDay('2026-11-18T15:00:00Z'),'2026-11-19');
 assert.equal(noticeDay('2026-11-19T00:00:00+09:00'),'2026-11-19');
});
test('오늘 알림은 시각을, 이전 알림은 월일을 표시한다',()=>{
 const now=new Date('2026-11-19T09:00:00Z');
 assert.match(noticeTime('2026-11-19T10:00:00Z',now),/오후.*7:00/);
 assert.equal(noticeTime('2026-11-18T10:00:00Z',now),'11월 18일');
 assert.equal(noticeDay('invalid'),'');
 assert.equal(noticeTime('invalid',now),'');
});
