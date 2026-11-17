import {useEffect,useState} from 'react';
import {ArrowLeft,Heart} from 'lucide-react';
import {apiData,describeError} from './api';
type HeartItem={kind:'THANKS'|'FOLLOW_UP';replyId:number;worryTitle:string;stamp:'GRATEFUL'|'HELPED'|'CHEERED'|null;content:string|null;createdAt:string};
const stamps={GRATEFUL:'고마워요',HELPED:'도움이 됐어요',CHEERED:'힘이 났어요'};
export default function ReceivedHearts({onBack}:{onBack:()=>void}){
 const [items,setItems]=useState<HeartItem[]|null>(null);const [error,setError]=useState('');const [retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;setItems(null);setError('');apiData<{items:HeartItem[]}>('/api/senior/received').then(d=>{if(!Array.isArray(d.items))throw new Error('받은 마음 응답을 확인할 수 없어요.');if(active)setItems([...d.items].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)))}).catch(e=>{if(active)setError(describeError(e))});return()=>{active=false}},[retry]);
 return <section className="content-page"><div className="screen-heading"><button className="icon-button" aria-label="홈으로" onClick={onBack}><ArrowLeft/></button><h1>받은 마음</h1></div><p className="subtitle">선배님의 이야기에 도착한 고마움과 그 뒤 이야기예요.</p>{error?<div role="alert" className="notice"><p>{error}</p><button className="secondary" onClick={()=>setRetry(n=>n+1)}>다시 불러오기</button></div>:items===null?<p role="status">받은 마음을 불러오고 있어요…</p>:items.length===0?<div className="empty"><Heart size={48}/><h2>아직 도착한 마음이 없어요</h2><p>청년이 보내온 고마움과 후일담을 여기에서 볼 수 있어요.</p></div>:items.map((item,i)=><article className="saved-reply" key={`${item.kind}-${item.replyId}-${i}`}><span className="tag">{item.kind==='THANKS'?'고마움':'후일담'}</span><h2>{item.worryTitle}</h2>{item.stamp&&<strong>{stamps[item.stamp]}</strong>}{item.content&&<p className="reply-detail-text">{item.content}</p>}<time className="helper">{new Date(item.createdAt).toLocaleString('ko-KR')}</time></article>)}</section>
}
