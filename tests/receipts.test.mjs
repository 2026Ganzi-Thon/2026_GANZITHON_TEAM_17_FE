import {test,beforeEach} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync(new URL('../src/replyReceipts.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {readReceipts,writeReceipts,addReceipt}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
let data;beforeEach(()=>{data=new Map();globalThis.localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}});
const receipt={replyId:3,worryId:1,title:'고민',content:'답장',type:'TEXT',sentAt:'2026-11-15T00:00:00Z'};
test('전송 기록은 사용자별로 분리한다',()=>{writeReceipts('a',[receipt]);assert.equal(readReceipts('a').length,1);assert.deepEqual(readReceipts('b'),[])});
test('같은 서버 답장 ID를 중복 보관하지 않는다',()=>{assert.equal(addReceipt([receipt],receipt).length,1)});
test('삭제 이력은 유지한다',()=>{writeReceipts('a',[{...receipt,deleted:true}]);assert.equal(readReceipts('a')[0].deleted,true)});
test('저장 실패를 서버 전송 실패로 바꾸지 않는다',()=>{globalThis.localStorage.setItem=()=>{throw new Error('quota')};assert.equal(writeReceipts('a',[receipt]),false)});
