import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync(new URL('../src/appRouting.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {shouldOpenYouth}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('가입 완료 및 재접속 청년은 서버 사용자 ID로 청년 화면에 진입한다',()=>{for(const screen of ['home','profile','replies'])assert.equal(shouldOpenYouth('young',screen,'uuid'),true)});
test('가입 전, ID가 없는 기기, 어르신은 청년 시연 화면으로 우회하지 않는다',()=>{for(const screen of ['start','role','onboarding'])assert.equal(shouldOpenYouth('young',screen,'uuid'),false);assert.equal(shouldOpenYouth('senior','home','uuid'),false);assert.equal(shouldOpenYouth('young','home',null),false);assert.equal(shouldOpenYouth('young','home',' '),false)});
