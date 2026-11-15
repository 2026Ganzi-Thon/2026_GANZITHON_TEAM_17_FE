export type Sanction={level:'NONE'|'WARNED'|'RESTRICTED'|'BANNED';restrictedUntil?:string|null};
export function sanctionNotice(sanction?:Sanction|null):string|null{
 if(!sanction||sanction.level==='NONE')return null;
 if(sanction.level==='WARNED')return '신고로 경고가 적용됐어요. 상대를 존중하며 선배님의 경험을 나눠주세요.';
 if(sanction.level==='BANNED')return '답장 기능이 영구 제한되어 있어요.';
 if(sanction.restrictedUntil){const end=new Date(sanction.restrictedUntil);if(Number.isFinite(end.getTime()))return `${end.toLocaleString('ko-KR')}까지 답장할 수 없어요. 기간이 지나면 다시 확인해주세요.`}
 return '현재 답장 기능이 제한되어 있어요. 잠시 후 다시 확인해주세요.';
}
export function replyBlocked(sanction?:Sanction|null){return sanction?.level==='RESTRICTED'||sanction?.level==='BANNED'}
