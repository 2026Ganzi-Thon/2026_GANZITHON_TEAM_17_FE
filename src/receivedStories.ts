export type ReceivedStory={kind:'THANKS'|'FOLLOW_UP';replyId:number;stamp:'GRATEFUL'|'HELPED'|'CHEERED'|null;content:string|null;createdAt:string};
export const thanksLabels={GRATEFUL:'고마워요',HELPED:'도움이 됐어요',CHEERED:'힘이 났어요'};
export function storiesForReply(value:unknown,replyId:number):ReceivedStory[]{
 if(!value||typeof value!=='object'||!Array.isArray((value as {items?:unknown}).items))throw new Error('받은 마음을 확인할 수 없어요.');
 return (value as {items:unknown[]}).items.filter((item):item is ReceivedStory=>{if(!item||typeof item!=='object')return false;const r=item as Partial<ReceivedStory>;return r.replyId===replyId&&(r.kind==='THANKS'||r.kind==='FOLLOW_UP')&&typeof r.createdAt==='string'&&!Number.isNaN(Date.parse(r.createdAt))&&(r.content===null||typeof r.content==='string')&&(r.stamp===null||r.stamp==='GRATEFUL'||r.stamp==='HELPED'||r.stamp==='CHEERED')}).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}
