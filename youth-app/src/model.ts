import demoLetter from './demo-letter.jpg';
export { demoLetter };

export const tags = {
  CAREER: '일·진로', LOVE: '연애', FAMILY: '가족', RELATIONSHIP: '친구·관계',
  LIVING: '생활', MIND: '마음', HEALTH: '건강', OTHER: '기타',
};
export type Draft = {
  title: string;
  content: string;
  tag: keyof typeof tags;
  visibility: 'PUBLIC' | 'SENIORS_ONLY';
};
export type Reply = {
  id: number;
  author: string;
  content: string;
  image?: string;
  liked?: boolean;
  heart?: { stamp: string; note: string };
  update?: { content: string; public: boolean };
};
export type Worry = Draft & {
  id: number;
  mine: boolean;
  author: string;
  authorAge?: string;
  date: string;
  hidden?: boolean;
  replyCount?: number;
  liked?: boolean;
  replies: Reply[];
};
const ageLabels: Record<string, string> = {
  '20S': '20대', '30S': '30대', '40S': '40대', '50S': '50대', '60S': '60대', '70S': '70대', '80S_PLUS': '80대 이상',
};
export const ageLabel = (code?: string) => code ? ageLabels[code] : undefined;
export const demoAges: Record<number, string> = { 1: '20대', 2: '30대', 3: '20대', 4: '20대', 5: '20대', 6: '30대', 7: '20대', 8: '30대', 9: '20대' };
export const sample: Worry[] = [
  { id: 1, mine: true, author: '포근한 양 312', title: '요즘 어떤 일을 해야 할지 막막해요.',
    content: '하고 싶은 일이 생겼는데, 지금 시작해도 괜찮을지 자꾸 망설이게 돼요.',
    tag: 'CAREER', visibility: 'SENIORS_ONLY', date: '2026-11-15',
    replies: [{ id: 11, author: '다정한 양', content: '저도 처음에는 많이 망설였어요. 큰 결정을 내리기보다 오늘 할 수 있는 작은 일부터 시작해 보세요. 천천히 가도 괜찮아요.' }] },
  { id: 2, mine: false, author: '차분한 양', title: '가족과 대화를 나누기가 어려워요.',
    content: '오랫동안 연락하지 않은 친구가 생각나요. 어떻게 말을 꺼내면 좋을까요?',
    tag: 'FAMILY', visibility: 'PUBLIC', date: '2026-11-14',
    replies: [{ id: 21, author: '따뜻한 양', content: '문득 생각났다는 말이면 충분할 때가 있어요.' }] },
  { id: 3, mine: true, author: '포근한 양 312', title: '이걸 잘 모르겠어요.',
    content: '요즘 마음이 복잡해요. 선배님은 고민이 많을 때 어떻게 하셨나요?',
    tag: 'MIND', visibility: 'PUBLIC', date: '2026-11-13',
    replies: [{ id: 31, author: '포근한 양', content: '하루에 한 가지씩 마음 쓰이는 일을 적어보면 정리가 될 때가 있어요.' }] },
  { id: 4, mine: false, author: '따뜻한 양', title: '요즘 어떤 일을 해야 할지 막막해요.',
    content: '지금 하는 일이 저와 맞는 건지 고민이에요. 선배님께서는 어떻게 방향을 정하셨나요?',
    tag: 'CAREER', visibility: 'PUBLIC', date: '2026-11-15',
    replies: [{ id: 41, author: '다정한 양', content: '마음이 가는 일을 작은 단위로 경험해보면 도움이 돼요.' }] },
  { id: 5, mine: false, author: '느긋한 양', title: '오랜 친구에게 먼저 연락해도 될까요?',
    content: '예전엔 매일 연락하던 친구인데 서로 바빠지면서 반년 넘게 소식을 못 들었어요. 별일 없이 안부만 물어봐도 괜찮을까요?',
    tag: 'RELATIONSHIP', visibility: 'PUBLIC', date: '2026-11-16T10:00:00+09:00',
    replies: [{ id: 51, author: '소박한 양', content: '부담 없이 “오늘 문득 네 생각이 났어”라고 시작해 보세요. 그 한마디가 반가울 수도 있어요.' }] },
  { id: 6, mine: false, author: '차근차근 양', title: '혼자 사니까 끼니를 자꾸 거르게 돼요.',
    content: '퇴근하고 나면 장 볼 힘도 없어서 저녁을 대충 넘겨요. 혼자서도 부담 없이 꾸준히 챙겨 먹는 방법이 있을까요?',
    tag: 'LIVING', visibility: 'PUBLIC', date: '2026-11-15T20:00:00+09:00',
    replies: [] },
  { id: 7, mine: false, author: '산뜻한 양', title: '주말에 쉬어도 마음이 편하지 않아요.',
    content: '가만히 쉬고 있으면 시간을 허비하는 느낌이 들어요. 쉬는 날을 어떻게 보내야 월요일에 덜 지칠까요?',
    tag: 'MIND', visibility: 'PUBLIC', date: '2026-11-15T14:00:00+09:00',
    replies: [{ id: 71, author: '온화한 양', content: '저는 주말에 꼭 할 일을 하나만 정해요. 나머지 시간은 미리 비워두면 쉴 때 마음이 좀 편해지더라고요.' }] },
  { id: 8, mine: false, author: '수줍은 양', title: '연인에게 서운한 마음을 어떻게 말할까요?',
    content: '약속이 미뤄질 때마다 괜찮다고 했는데 사실 많이 서운했어요. 상대를 탓하는 것처럼 들리지 않게 제 마음을 전하고 싶어요.',
    tag: 'LOVE', visibility: 'PUBLIC', date: '2026-11-14T18:00:00+09:00',
    replies: [] },
  { id: 9, mine: true, author: '나', title: '일을 시작할 때 마음이 불안해요.',
    content: '첫 출근을 앞두고 잘할 수 있을지 걱정돼요. 선배님은 새로운 일을 시작할 때 어떻게 마음을 다잡으셨나요?',
    tag: 'CAREER', visibility: 'SENIORS_ONLY', date: '2026-11-12',
    replies: [
      { id: 91, author: '다정한 양', content: '처음부터 모든 걸 잘할 필요는 없어요. 하루에 하나씩 익혀간다고 생각해 보세요.' },
      { id: 92, author: '포근한 양', content: '', image: demoLetter },
    ] },
];
export class ApiError extends Error {
  constructor(message: string, readonly code?: string) { super(message); }
}

export async function api<T>(userId: string, path: string, method = 'GET', body?: object): Promise<T> {
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
  if (!base) throw new Error('API 서버 주소를 설정해 주세요.');
  const response = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.data) {
    throw new ApiError(result?.message || '요청을 처리하지 못했어요. 다시 시도해 주세요.', result?.code);
  }
  return result.data as T;
}

export function createWorry(userId: string, draft: Draft) {
  return api<{ worryId: number; crisisDetected: boolean; createdAt: string }>(userId, '/api/worries', 'POST', draft);
}

export type MineResponse = { items: Array<Omit<Draft, 'content'> & {
  worryId: number; replyCount: number; hidden: boolean; createdAt: string;
}> };
export type FeedResponse = { items: Array<{
  worryId: number; title: string; tag: Draft['tag']; replyCount: number; createdAt: string;
}> };
type Detail = Draft & {
  worryId: number; createdAt: string; isMine: boolean; hidden: boolean; likedByMe: boolean;
  author: { nickname: string; ageGroup?: string };
  replies: Array<{
    replyId: number; content: string | null; imageUrl: string | null; likedByMe: boolean;
    senior: { nickname: string }; followUp: { content: string; visibility: Draft['visibility'] } | null;
  }>;
};
export type Notification = {
  notificationId: number; title: string; read: boolean; createdAt: string;
  target: { kind: string; id: number | null };
};
export async function getDetail(userId: string, id: number): Promise<Worry> {
  const row = await api<Detail>(userId, '/api/worries/' + id);
  return {
    id: row.worryId, title: row.title, content: row.content, tag: row.tag,
    visibility: row.visibility, mine: row.isMine, author: row.author.nickname, authorAge: ageLabel(row.author.ageGroup),
    hidden: row.hidden, liked: row.likedByMe, date: row.createdAt,
    replies: row.replies.map(reply => ({
      id: reply.replyId, author: reply.senior.nickname, content: reply.content ?? '',
      image: reply.imageUrl ?? undefined, liked: reply.likedByMe,
      update: reply.followUp ? {
        content: reply.followUp.content, public: reply.followUp.visibility === 'PUBLIC',
      } : undefined,
    })),
  };
}
