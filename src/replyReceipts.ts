/** Device-side receipts are not a replacement for the server reply list. */
export type ReplyReceipt={replyId:number;worryId:number;title:string;content:string;type:'TEXT'|'VOICE'|'LETTER';imageUrl?:string;sentAt:string;deleted?:boolean};
const key=(userId:string)=>`hanol-reply-receipts:${userId}`;
export function readReceipts(userId:string):ReplyReceipt[]{
 try{const value:unknown=JSON.parse(localStorage.getItem(key(userId))||'[]');return Array.isArray(value)?value.filter((r):r is ReplyReceipt=>Boolean(r&&typeof r==='object'&&Number.isSafeInteger(r.replyId)&&Number.isSafeInteger(r.worryId)&&typeof r.title==='string'&&typeof r.content==='string'&&['TEXT','VOICE','LETTER'].includes(r.type)&&typeof r.sentAt==='string')):[]}catch{return []}
}
export function writeReceipts(userId:string,receipts:ReplyReceipt[]):boolean{try{localStorage.setItem(key(userId),JSON.stringify(receipts));return true}catch{return false}}
export function addReceipt(receipts:ReplyReceipt[],receipt:ReplyReceipt){return [receipt,...receipts.filter(r=>r.replyId!==receipt.replyId)]}
