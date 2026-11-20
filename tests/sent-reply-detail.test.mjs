import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../src/sentReplyDetail.ts',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {parseSentReplyDetail,isDetailEndpointUnavailable}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const target={replyId:7,worryId:2,worryTitle:'내 고민',type:'LETTER'};
const dto={replyId:7,worryId:2,type:'LETTER',content:null,imageUrl:'/files/letters/11111111-1111-1111-1111-111111111111.jpg',createdAt:'2026-11-20T13:00:00'};
test('server originals create a usable sent letter without a local receipt',()=>{
 const result=parseSentReplyDetail(dto,target);assert.equal(result.replyId,7);assert.equal(result.content,'');assert.equal(result.imageUrl,dto.imageUrl);assert.equal(result.title,'내 고민');
});
test('text originals preserve authored whitespace',()=>{
 const result=parseSentReplyDetail({...dto,type:'TEXT',content:'  내 이야기\n원문  ',imageUrl:null},{...target,type:'TEXT'});
 assert.equal(result.content,'  내 이야기\n원문  ');assert.equal(result.imageUrl,undefined);
});
test('mismatched IDs or reply types never become another reply original',()=>{
 for(const change of [{replyId:8},{worryId:3},{type:'TEXT'}])assert.throws(()=>parseSentReplyDetail({...dto,...change},target),/일치/);
});
test('missing original fields are reported as errors',()=>{
 for(const row of [null,{}, {...dto,imageUrl:''},{...dto,createdAt:null}])assert.throws(()=>parseSentReplyDetail(row,target));
});
test('device fallback cannot bypass forbidden or deleted server replies',()=>{
 assert.equal(isDetailEndpointUnavailable({status:404,code:'COMMON_404'}),true);
 for(const e of [{status:403,code:'REPLY_403_001'},{status:404,code:'REPLY_404_001'},{status:500},null,Error('offline')])assert.equal(isDetailEndpointUnavailable(e),false);
});
