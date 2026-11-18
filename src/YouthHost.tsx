import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {YouthApp} from '../youth-app/src/YouthApp';
import youthStyles from '../youth-app/src/youth.css?inline';
/** Keep both existing interfaces' styles isolated while sharing server identity. */
export default function YouthHost({userId,nickname,age}:{userId:string;nickname:string;age:string}){
 const host=useRef<HTMLDivElement>(null);const [root,setRoot]=useState<ShadowRoot|null>(null);
 useEffect(()=>{if(host.current)setRoot(host.current.shadowRoot||host.current.attachShadow({mode:'open'}))},[]);
 return <div className="youth-host" ref={host}>{root?createPortal(<><style>{`:host{display:block;max-width:440px;min-height:100dvh;margin:auto;color:#211c25}*{box-sizing:border-box}button,input,textarea,select{font:inherit}button{cursor:pointer}img{max-width:100%}${youthStyles}`}</style><YouthApp key={userId} userId={userId} initialNickname={nickname} initialAge={age}/></>,root):<p role="status">청년 화면을 불러오고 있어요…</p>}</div>;
}
