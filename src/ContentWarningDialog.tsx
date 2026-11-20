import {useEffect,useId,useRef} from 'react';
import {CircleAlert} from 'lucide-react';
import {contentCheckItems} from './contentWarning';
import './contentWarning.css';

export default function ContentWarningDialog({message,code,onNext,worry=false}:{message:string;code?:string;onNext:()=>void;worry?:boolean}){
 const titleId=useId(),descriptionId=useId(),button=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  const root=button.current?.getRootNode() as Document|ShadowRoot|undefined;
  const previous=root?.activeElement as HTMLElement|null;
  button.current?.focus();
  return()=>{if(previous?.isConnected)previous.focus()};
 },[]);
 return <div className="content-warning-overlay" onKeyDown={event=>{
  if(event.key==='Tab'){event.preventDefault();button.current?.focus()}
  if(event.key==='Escape'){event.preventDefault();onNext()}
 }}>
  <section className={`content-warning-dialog ${worry?'youth-content-warning':'senior-content-warning'}`} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
   <span className="content-warning-icon" aria-hidden="true"><CircleAlert/></span>
   <h2 id={titleId}>내용을 한 번 더 확인해 주세요</h2>
   <p id={descriptionId}>외부 연락처나 부적절한 표현이 포함되어 있어 {worry?'고민을 올릴 수 없어요.':'답장을 보낼 수 없어요.'}</p>
   <div className="content-warning-items"><strong>확인 항목</strong><p>{contentCheckItems(code,message).join(' · ')}</p></div>
   <button ref={button} type="button" className="content-warning-next" onClick={onNext}>다음</button>
  </section>
 </div>;
}
