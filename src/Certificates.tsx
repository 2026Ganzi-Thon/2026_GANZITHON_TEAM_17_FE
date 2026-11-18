import Mascot from './Mascot';
import {useEffect,useState} from 'react';
import {ArrowLeft,Award,Download,FileDown} from 'lucide-react';
import {apiData,describeError} from './api';
import CertificateArt,{drawCertificate} from './CertificateArt';
import {imagePdf,saveBlob} from './certificateExport';
type Certificate={certificateId:number;nickname:string;replyCount:number;issuedAt:string};
type Entry={certificateId:number;issuedAt:string;replyCount?:number};
function parseEntries(value:unknown):Entry[]{
 if(!value||typeof value!=='object'||!Array.isArray((value as {items?:unknown}).items))throw new Error('감사장 목록 응답을 확인할 수 없어요.');
 return ((value as {items:unknown[]}).items).map(item=>{if(!item||typeof item!=='object')throw new Error('감사장 목록 형식이 올바르지 않아요.');const r=item as Record<string,unknown>;if(typeof r.certificateId!=='number'||typeof r.issuedAt!=='string')throw new Error('서버 감사장 목록 필드 확인이 필요해요.');return {certificateId:r.certificateId,issuedAt:r.issuedAt,replyCount:typeof r.replyCount==='number'?r.replyCount:undefined}});
}
const date=(value:string)=>new Date(value).toLocaleDateString('ko-KR');
export default function Certificates({onBack,initialId=null}:{onBack:()=>void;initialId?:number|null}){
 const [entries,setEntries]=useState<Entry[]|null>(null);const [selected,setSelected]=useState<number|null>(initialId);const [detail,setDetail]=useState<Certificate|null>(null);const [error,setError]=useState('');const [attempt,setAttempt]=useState(0);const [saving,setSaving]=useState(false);
 useEffect(()=>{let active=true;setError('');setDetail(null);if(selected===null)setEntries(null);
 (selected===null?apiData<unknown>('/api/senior/certificates').then(parseEntries).then(d=>{if(active)setEntries(d)}):apiData<Certificate>(`/api/senior/certificates/${selected}`).then(d=>{if(typeof d.nickname!=='string'||typeof d.replyCount!=='number'||typeof d.issuedAt!=='string')throw new Error('감사장 응답 형식을 확인할 수 없어요.');if(active)setDetail(d)})).catch(e=>{if(active)setError(describeError(e))});return()=>{active=false}},[selected,attempt]);
 const [saved,setSaved]=useState('');
 const download=async(format:'png'|'pdf')=>{if(!detail||saving)return;setSaving(true);setError('');setSaved('');try{await document.fonts.ready;const canvas=document.createElement('canvas');drawCertificate(canvas,detail);let blob:Blob;if(format==='pdf'){const jpeg=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('이미지를 만들 수 없어요.')),'image/jpeg',0.95));const bytes=imagePdf(new Uint8Array(await jpeg.arrayBuffer()),canvas.width,canvas.height);blob=new Blob([bytes as BlobPart],{type:'application/pdf'})}else{blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('이미지를 만들 수 없어요.')),'image/png'))}saveBlob(blob,`hanol-certificate-${detail.certificateId}.${format}`);setSaved('저장 파일을 준비했어요. 다운로드 목록을 확인해주세요.')}catch(e){setError(describeError(e))}finally{setSaving(false)}};
 return <section className="content-page certificates-page"><button className="icon-button no-print" aria-label={selected===null?'내 털 기록으로':'감사장 목록으로'} onClick={()=>selected===null?onBack():setSelected(null)}><ArrowLeft/></button><span className="overline no-print">선배님의 온기를 기억해요</span><h1 className="no-print">감사장</h1><p className="subtitle no-print">누적 답장 20통마다 감사장을 받아요.</p>
 {error&&<div className="notice no-print" role="alert"><p>{error}</p><button className="secondary" onClick={()=>setAttempt(n=>n+1)}>다시 불러오기</button></div>}
 {!error&&(selected===null?entries===null:detail===null)&&<p className="helper" role="status">감사장을 불러오고 있어요…</p>}
 {selected===null&&entries?.length===0&&!error&&<div className="empty"><div className="empty-cloud"><Mascot/></div><h2>지금은 감사장이 없어요</h2><p>첫 감사장은 누적 답장 20통에 발급돼요.<br/>이미 발급된 감사장은 계속 보관돼요.</p></div>}
 {selected===null&&!error&&entries?.map(c=><button className="certificate-entry" key={c.certificateId} onClick={()=>setSelected(c.certificateId)}><Award size={32}/><div><h2>{c.replyCount?`${Math.floor(c.replyCount/20)}번째 감사장`:'온기를 나눈 감사장'}</h2>{c.replyCount&&<p>누적 답장 {c.replyCount}통</p>}<p>{date(c.issuedAt)} 발급</p></div><span>보기 →</span></button>)}
 {detail&&!error&&<><CertificateArt detail={detail}/><div className="button-row no-print"><button className="primary" disabled={saving} onClick={()=>void download('png')}><Download size={20}/>{saving?'파일 준비 중…':'사진 저장'}</button><button className="secondary" disabled={saving} onClick={()=>void download('pdf')}><FileDown size={18}/>PDF 저장</button></div>{saved&&<p className="success no-print" role="status">{saved}</p>}<button className="text-button no-print" disabled={saving} onClick={()=>{setSaved('');setSelected(null)}}>이전 감사장 발급 기록</button></>}
 </section>
}
