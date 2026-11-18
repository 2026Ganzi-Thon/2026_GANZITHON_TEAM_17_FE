/** The server makes the final content decision; local checks only guide editing. */
export function letterFileError(file:{type:string;size:number}){
 if(!['image/jpeg','image/png'].includes(file.type))return 'JPG 또는 PNG 사진을 선택해주세요.';
 if(file.size===0||file.size>10*1024*1024)return '10MB 이하의 비어 있지 않은 사진을 선택해주세요.';
 return '';
}
export function replyTextWarning(text:string){
 if(!text.trim())return '답장을 입력해주세요.';
 if(Array.from(text).length>1000)return '답장은 1,000자 이내로 입력해주세요.';
 if(/(?:01[016789][\s-]?\d{3,4}[\s-]?\d{4}|https?:\/\/|www\.|@[a-zA-Z0-9_]+|카카오톡\s*아이디)/i.test(text))return '전화번호나 외부 연락처가 포함되어 있어요. 내용을 수정해주세요.';
 return '';
}
