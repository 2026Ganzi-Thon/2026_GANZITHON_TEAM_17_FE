/** Endpoint paths and DTOs must come from the backend OpenAPI specification. */
import type {Sanction} from './policies';
const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const USER_ID_KEY = 'hanol-server-user-id';
export class ApiError extends Error {
  constructor(public status: number, public code: string | undefined, message: string) { super(message); }
}
export function saveServerUserId(userId: string) {
  if (!userId.trim()) throw new Error('서버 사용자 ID가 비어 있습니다.');
  localStorage.setItem(USER_ID_KEY, userId);
}
export async function apiRequest<T>(path: string, options: RequestInit = {}, requiresUser = true): Promise<T> {
  if (!baseUrl) throw new Error('API 서버 주소가 설정되지 않았습니다.');
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('API 경로가 올바르지 않습니다.');
  const headers = new Headers(options.headers);
  if (requiresUser) {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) throw new Error('서버 가입이 필요합니다.');
    headers.set('X-User-Id', userId);
  }
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${baseUrl}${path}`, {...options, headers, signal: options.signal ?? AbortSignal.timeout(15000)});
  const body = await response.text();
  let data: unknown;
  try { data = body ? JSON.parse(body) : undefined; } catch { throw new ApiError(response.status, undefined, '서버 응답 형식이 올바르지 않습니다.'); }
  if (!response.ok) {
    const detail = data as {code?: string; message?: string} | undefined;
    throw new ApiError(response.status, detail?.code, detail?.message || '요청을 처리하지 못했습니다.');
  }
  return data as T;
}

export type Envelope<T> = {status:number;code:string;message:string;data:T};
export type ServerProfile = {userId:string;role:'YOUTH'|'SENIOR';nickname:string;ageGroup:string;sanction?:Sanction};
export async function apiData<T>(path:string, options:RequestInit={}, requiresUser=true):Promise<T>{
  const result=await apiRequest<Envelope<T>>(path,options,requiresUser);
  if(!result||typeof result!=='object'||typeof result.status!=='number')throw new Error('서버 응답 형식이 올바르지 않습니다.');
  if(result.status<200||result.status>=300)throw new ApiError(result.status,result.code,result.message);
  if(result.data===undefined||result.data===null)throw new Error('서버 응답 데이터가 비어 있어요.');
  return result.data;
}
export const ageCodes:Record<string,string>={'20대':'20S','30대':'30S','40대':'40S','50대':'50S','60대':'60S','70대':'70S','80대 이상':'80S_PLUS'};
export const ageLabel=(code:string)=>Object.keys(ageCodes).find(label=>ageCodes[label]===code)||code;
export const tagLabel=(code:string)=>({CAREER:'일·진로',LOVE:'연애',FAMILY:'가족',RELATIONSHIP:'친구·관계',LIVING:'생활',MIND:'마음',HEALTH:'건강',OTHER:'기타'} as Record<string,string>)[code]||code;
export const getServerUserId=()=>localStorage.getItem(USER_ID_KEY);
export const describeError=(error:unknown)=>error instanceof TypeError?'서버에 연결하지 못했어요. 인터넷 연결을 확인하고 다시 시도해주세요.':error instanceof DOMException&&error.name==='TimeoutError'?'서버 응답이 늦어지고 있어요. 잠시 후 다시 시도해주세요.':error instanceof Error?error.message:'요청에 실패했어요. 다시 시도해주세요.';

export const agesByRole={young:['20대','30대','40대'],senior:['50대','60대','70대','80대 이상']};
/** Detach this device only; server records and per-user receipts remain intact. */
export function clearActiveIdentity(){localStorage.removeItem(USER_ID_KEY);localStorage.removeItem('hanol-profile');}
