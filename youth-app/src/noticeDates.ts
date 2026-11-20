const timeZone='Asia/Seoul';

export function noticeDay(value:string|Date):string{
 const date=value instanceof Date?value:new Date(value);
 if(!Number.isFinite(date.getTime()))return '';
 return new Intl.DateTimeFormat('sv-SE',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}

export function noticeTime(value:string,now=new Date()):string{
 const date=new Date(value);
 if(!Number.isFinite(date.getTime()))return '';
 if(noticeDay(date)===noticeDay(now)){
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone,hour:'numeric',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
  const hour=Number(parts.find(part=>part.type==='hour')?.value);
  const minute=parts.find(part=>part.type==='minute')?.value||'00';
  return `${hour<12?'오전':'오후'} ${hour%12||12}:${minute}`;
 }
 const [,month,day]=noticeDay(date).split('-');
 return `${Number(month)}월 ${Number(day)}일`;
}
