import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url);
function bundle(path){
 const code=buildSync({entryPoints:[fileURLToPath(new URL(path,import.meta.url))],bundle:true,platform:'node',format:'cjs',write:false,external:['react','react/jsx-runtime','lucide-react'],loader:{'.css':'empty'}}).outputFiles[0].text;
 const module={exports:{}};
 new Function('require','module','exports',code)(require,module,module.exports);
 return module.exports;
}
const {contentCheckItems}=bundle('../src/contentWarning.ts');
const Dialog=bundle('../src/ContentWarningDialog.tsx').default;
test('filter codes identify the exact server rejection regardless of message text',()=>{
 assert.deepEqual(contentCheckItems('FILTER_422_002','외부 연락처'),['전화번호']);
 assert.deepEqual(contentCheckItems('FILTER_422_003','연락처'),['SNS ID·링크']);
 assert.deepEqual(contentCheckItems('FILTER_422_001','전화번호'),['금지 표현']);
});
test('local checks and unknown codes retain guidance without assigning a fake server code',()=>{
 assert.deepEqual(contentCheckItems(undefined,'전화번호나 외부 연락처가 포함되어 있어요.'),['전화번호','SNS ID·링크']);
 assert.deepEqual(contentCheckItems(undefined,'사용할 수 없는 표현이 포함되어 있어요.'),['금지 표현']);
 assert.deepEqual(contentCheckItems('OTHER_CODE','내용을 확인해주세요.'),['전화번호','SNS ID·링크','금지 표현']);
});
test('reply rejection renders the prototype icon, explanation, matching check item and Next',()=>{
 const html=renderToStaticMarkup(createElement(Dialog,{code:'FILTER_422_002',message:'전화번호가 포함되어 있어요.',onNext(){}}));
 assert.match(html,/role="alertdialog"/);
 assert.match(html,/aria-describedby=/);
 assert.match(html,/content-warning-icon[\s\S]*<svg/);
 assert.match(html,/외부 연락처나 부적절한 표현이 포함되어 있어 답장을 보낼 수 없어요/);
 assert.match(html,/확인 항목<\/strong><p>전화번호<\/p>/);
 assert.match(html,/>다음<\/button>/);
 assert.doesNotMatch(html,/내용 수정하기|SNS ID|FILTER_422/);
});
test('youth warning preserves the worry action and links its server reason to the shared dialog',()=>{
 const html=renderToStaticMarkup(createElement(Dialog,{worry:true,code:'FILTER_422_003',message:'링크',onNext(){}}));
 assert.match(html,/고민을 올릴 수 없어요/);
 assert.match(html,/확인 항목<\/strong><p>SNS ID·링크<\/p>/);
 assert.match(html,/youth-content-warning/);
});
