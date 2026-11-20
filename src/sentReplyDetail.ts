import type {ReplyReceipt} from './replyReceipts';

type Target={replyId:number;worryId:number;worryTitle:string;type:'TEXT'|'VOICE'|'LETTER'};
/** Only a missing route may use the device fallback; a denied/deleted reply may not. */
export function isDetailEndpointUnavailable(error:unknown):boolean{
 if(!error||typeof error!=='object')return false;
 const e=error as {status?:unknown;code?:unknown};
 return e.status===404&&e.code==='COMMON_404';
}
/** Reject mismatched IDs rather than displaying another reply's original. */
export function parseSentReplyDetail(value:unknown,target:Target):ReplyReceipt{
 if(!value||typeof value!=='object')throw new Error('답장 원본 응답을 확인할 수 없어요.');
 const row=value as Record<string,unknown>;
 if(row.replyId!==target.replyId||row.worryId!==target.worryId||row.type!==target.type||typeof row.createdAt!=='string')throw new Error('답장 원본 정보가 목록과 일치하지 않아요.');
 if(row.type==='LETTER'?(typeof row.imageUrl!=='string'||!row.imageUrl.trim()):(typeof row.content!=='string'||!row.content.trim()))throw new Error('답장 원본이 비어 있어요.');
 return {replyId:target.replyId,worryId:target.worryId,title:target.worryTitle,type:target.type,
  content:typeof row.content==='string'?row.content:'',imageUrl:typeof row.imageUrl==='string'?row.imageUrl:undefined,sentAt:row.createdAt};
}
