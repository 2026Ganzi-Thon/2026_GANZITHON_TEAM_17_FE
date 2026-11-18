import {test,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../src/api.ts',import.meta.url),'utf8').replace('import.meta.env.VITE_API_BASE_URL',"'https://api.test.invalid'");
const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const api=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
let storage;
beforeEach(()=>{storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}});
test('가입 전에는 개인 API를 호출하지 않는다',async()=>{globalThis.fetch=()=>assert.fail('fetch should not run');await assert.rejects(()=>api.apiData('/api/users/me'),/가입/)});
test('가입 요청은 인증 헤더 없이 JSON으로 보낸다',async()=>{globalThis.fetch=async(url,opts)=>{assert.equal(new Headers(opts.headers).has('X-User-Id'),false);assert.equal(new Headers(opts.headers).get('Content-Type'),'application/json');assert.equal(JSON.parse(opts.body).role,'SENIOR');return Response.json({status:200,data:{userId:'issued'}})};assert.equal((await api.apiData('/api/users',{method:'POST',body:JSON.stringify({role:'SENIOR',ageGroup:'60S'})},false)).userId,'issued')});
test('사용자 헤더를 넣고 multipart 경계를 브라우저에 맡긴다',async()=>{api.saveServerUserId('issued');const form=new FormData();form.append('image',new Blob(['test'],{type:'image/png'}),'letter.png');globalThis.fetch=async(url,opts)=>{const h=new Headers(opts.headers);assert.equal(h.get('X-User-Id'),'issued');assert.equal(h.has('Content-Type'),false);return Response.json({status:200,data:{imageUrl:'/image.png'}})};assert.equal((await api.apiData('/api/uploads/letters',{method:'POST',body:form})).imageUrl,'/image.png')});
test('HTTP 오류와 응답 내부 오류 메시지를 유지한다',async()=>{for(const status of [200,400]){globalThis.fetch=async()=>Response.json({status:400,code:'BAD',message:'금지어를 수정해주세요'},{status});await assert.rejects(()=>api.apiData('/api/users',{},false),/금지어/)}});
test('잘못된 성공 응답도 오류 처리한다',async()=>{for(const data of [null,{}, {status:200,data:null}]){globalThis.fetch=async()=>Response.json(data);await assert.rejects(()=>api.apiData('/api/users',{},false))}});
test('외부 URL을 API 경로로 사용하지 않는다',async()=>{await assert.rejects(()=>api.apiData('//other.invalid',{},false),/경로/)});

test('역할별 가입 나이와 서버 코드가 일치한다',()=>{assert.deepEqual(api.agesByRole.young,['20대','30대','40대']);assert.deepEqual(api.agesByRole.senior,['50대','60대','70대','80대 이상']);assert.equal(api.ageCodes['70대'],'70S');assert.equal(api.ageCodes['80대 이상'],'80S_PLUS');assert.equal(api.ageCodes['70대 이상'],undefined);assert.equal(api.ageLabel('80S_PLUS'),'80대 이상')});
test('시연 초기화는 활성 사용자만 지우고 다른 보관 기록은 유지한다',async()=>{api.saveServerUserId('old-id');localStorage.setItem('hanol-profile','old-profile');localStorage.setItem('hanol-receipts-old-id','saved-receipts');localStorage.setItem('other-project','keep');api.clearActiveIdentity();assert.equal(api.getServerUserId(),null);assert.equal(localStorage.getItem('hanol-profile'),null);assert.equal(localStorage.getItem('hanol-receipts-old-id'),'saved-receipts');assert.equal(localStorage.getItem('other-project'),'keep');globalThis.fetch=()=>assert.fail('previous identity must not be used');await assert.rejects(()=>api.apiData('/api/users/me'),/가입/)});
