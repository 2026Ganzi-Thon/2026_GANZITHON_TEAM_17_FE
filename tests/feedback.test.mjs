import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
async function load(name){const source=fs.readFileSync(new URL('../src/'+name+'.ts',import.meta.url),'utf8');const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));}
const {assessPhotoPixels}=await load('photoQuality');
const {storiesForReply}=await load('receivedStories');
function pixels(value,alpha=255){const data=new Uint8ClampedArray(16*16*4);for(let i=0;i<256;i++){data.set([value,value,value,alpha],i*4)}return data;}
test('매우 어두운 사진과 밝지만 세부 정보가 부족한 사진을 구분한다',()=>{assert.equal(assessPhotoPixels(pixels(15),16,16).warning,'dark');assert.equal(assessPhotoPixels(pixels(230),16,16).warning,'low-detail')});
test('명암 경계가 충분한 사진은 흐림 안내를 띄우지 않는다',()=>{const data=pixels(255);for(let y=0;y<16;y++)for(let x=0;x<16;x++){if((x+y)%2===0)data.set([0,0,0,255],(y*16+x)*4)}assert.equal(assessPhotoPixels(data,16,16).warning,null)});
test('투명한 배경을 검은 사진으로 잘못 판단하지 않고 입력 픽셀을 보존한다',()=>{const data=pixels(0,0),copy=data.slice();assert.notEqual(assessPhotoPixels(data,16,16).warning,'dark');assert.deepEqual(data,copy)});
test('잘못된 크기와 픽셀 배열은 검사 성공으로 처리하지 않는다',()=>{assert.throws(()=>assessPhotoPixels(pixels(100),2,2));assert.throws(()=>assessPhotoPixels(new Uint8ClampedArray(),16,16));});
test('후일담 상세에는 선택한 답장의 실제 항목만 최신순으로 표시한다',()=>{const row={kind:'FOLLOW_UP',replyId:7,stamp:null,content:'작은 목표를 세워봤어요.',createdAt:'2026-11-18T10:00:00'};const source=[row,{...row,replyId:8,content:'다른 답장의 내용'},{...row,kind:'THANKS',stamp:'HELPED',createdAt:'2026-11-18T12:00:00'},{...row,kind:'UNKNOWN'},{...row,createdAt:'invalid'}];const result=storiesForReply({items:source},7);assert.equal(result.length,2);assert.equal(result[0].kind,'THANKS');assert.equal(result[1].content,row.content);assert.equal(source[0],row);assert.deepEqual(storiesForReply({items:source},99),[])});
test('잘못된 받은 마음 응답은 빈 성공 목록으로 감추지 않는다',()=>{for(const response of [null,{}, {items:null}])assert.throws(()=>storiesForReply(response,7));});
