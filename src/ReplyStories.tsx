import {useEffect,useRef,useState} from 'react';
import {apiData,describeError} from './api';
import {storiesForReply,thanksLabels,type ReceivedStory} from './receivedStories';
/** Opening the inbox also marks it read: show that effect before the user loads it. */
export default function ReplyStories({replyId}:{replyId:number}){
 const [items,setItems]=useState<ReceivedStory[]|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const controller=useRef<AbortController|null>(null),lock=useRef(false);
 useEffect(()=>()=>controller.current?.abort(),[]);
 const load=async()=>{if(lock.current)return;lock.current=true;const request=new AbortController();controller.current=request;setBusy(true);setError('');try{const data=await apiData<unknown>('/api/senior/received',{signal:AbortSignal.any([request.signal,AbortSignal.timeout(15000)])});if(!request.signal.aborted)setItems(storiesForReply(data,replyId))}catch(e){if(!request.signal.aborted)setError(describeError(e))}finally{if(!request.signal.aborted)setBusy(false);lock.current=false}};
 return <section className="reply-stories" aria-label="이 답장에 도착한 마음">{items===null&&<><button className="followup-entry" disabled={busy} onClick={()=>void load()}>{busy?'도착한 마음을 불러오고 있어요…':'고마움·후일담 확인하기'}<span aria-hidden="true">›</span></button><p className="helper">열면 받은 마음 목록도 함께 읽음 처리돼요.</p></>}{error&&<p className="error" role="alert">{error}</p>}{items?.length===0&&<p className="helper">현재 이 답장에 표시할 마음이 없어요.</p>}{items?.map((item,i)=><article className="reply-story" key={`${item.kind}-${item.createdAt}-${i}`}><div><h3>{item.kind==='FOLLOW_UP'?'후일담':'고마움'}</h3><time>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</time></div><div className="reply-story-paper">{item.stamp&&<strong>{thanksLabels[item.stamp]}</strong>}{item.content&&<p>{item.content}</p>}</div></article>)}</section>;
}
