import {Home,MessageSquareMore,UserRound} from 'lucide-react';
import {useLayoutEffect,useRef} from 'react';
import {navigationFrame} from './navigationFrame';

export type NavigationTab='home'|'replies'|'profile';
export default function BottomNavigation({active,onSelect,youth=false}:{active:NavigationTab;onSelect:(tab:NavigationTab)=>void;youth?:boolean}){
 const navRef=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{
  // Youth uses the app's flex footer; senior screens retain frame-bounded fixed positioning.
  if(youth)return;
  const nav=navRef.current,frame=nav?.closest('.app,.youth-app');
  if(!nav||!frame)return;
  let pending=0;
  const update=()=>{
   pending=0;
   const viewport=window.visualViewport;
   const bottom=viewport?viewport.offsetTop+viewport.height:window.innerHeight;
   const bounds=navigationFrame(frame.getBoundingClientRect(),bottom,viewport?.offsetTop??0);
   Object.assign(nav.style,{left:`${bounds.left}px`,width:`${bounds.width}px`,bottom:`${Math.max(0,window.innerHeight-bottom)+bounds.bottom}px`,transform:'none',visibility:bounds.visible?'visible':'hidden'});
  };
  const schedule=()=>{if(!pending)pending=requestAnimationFrame(update)};
  const observer=new ResizeObserver(schedule);
  observer.observe(frame);
  window.addEventListener('resize',schedule);
  window.addEventListener('scroll',schedule,true);
  window.visualViewport?.addEventListener('resize',schedule);
  window.visualViewport?.addEventListener('scroll',schedule);
  update();
  return()=>{
   observer.disconnect();cancelAnimationFrame(pending);
   window.removeEventListener('resize',schedule);window.removeEventListener('scroll',schedule,true);
   window.visualViewport?.removeEventListener('resize',schedule);window.visualViewport?.removeEventListener('scroll',schedule);
  };
 },[youth]);
 return <nav ref={navRef} className={`bottom-navigation ${youth?'youth-navigation':'senior-navigation'}`} aria-label={youth?'청년 메뉴':'주요 메뉴'}>
  {(['home','replies','profile'] as const).map(tab=><button type="button" key={tab} className={active===tab?'active':''} aria-current={active===tab?'page':undefined} onClick={()=>onSelect(tab)}>
   <span className="nav-icon" aria-hidden="true">{tab==='home'?<Home className="nav-home" fill="currentColor"><path d="M9 21v-8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8Z" fill="var(--nav-icon-cutout)" stroke="none"/></Home>:tab==='replies'?<MessageSquareMore/>:<UserRound/>}</span>
   <span className="nav-label">{tab==='home'?'홈':tab==='replies'?(youth?'답장':'내 답장'):'내 한 올'}</span>
  </button>)}
 </nav>;
}
