import {useEffect,useRef,useState,type KeyboardEvent} from 'react';
import {Check,ChevronDown,ListFilter} from 'lucide-react';

const options=[['latest','최신순'],['oldest','오래된순'],['topic','주제별']] as const;
export type SortOrder=typeof options[number][0];
export default function SortDropdown({value,onChange,label='정렬 순서'}:{value:SortOrder;onChange:(value:SortOrder)=>void;label?:string}){
 const [open,setOpen]=useState(false);
 const root=useRef<HTMLDivElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!open)return;const close=(event:PointerEvent)=>{if(root.current&&!event.composedPath().includes(root.current))setOpen(false)};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close)},[open]);
 useEffect(()=>{if(open)root.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus()},[open]);
 const keydown=(event:KeyboardEvent)=>{
  if(event.key==='Escape'){setOpen(false);trigger.current?.focus();event.preventDefault();return}
  if(event.key==='Tab'){setOpen(false);return}
  if(!open||!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
  const buttons=Array.from(root.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')||[]);
  const current=buttons.indexOf(event.target as HTMLButtonElement);
  const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(current+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
  buttons[next]?.focus();event.preventDefault();
 };
 return <div className="sort-dropdown" ref={root} onKeyDown={keydown}>
  <button ref={trigger} type="button" className="sort-trigger" aria-label={`${label}: ${options.find(([id])=>id===value)?.[1]}`} aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(!open)} onKeyDown={event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();setOpen(true)}}}>
   <ListFilter size={13} aria-hidden="true"/><span>{options.find(([id])=>id===value)?.[1]}</span><ChevronDown size={13} aria-hidden="true"/>
  </button>
  {open&&<div className="sort-options" role="menu" aria-label={label}>{options.map(([id,text])=><button key={id} type="button" role="menuitemradio" aria-checked={value===id} onClick={()=>{onChange(id);setOpen(false);trigger.current?.focus()}}><span>{text}</span>{value===id&&<Check size={13} aria-hidden="true"/>}</button>)}</div>}
 </div>;
}
