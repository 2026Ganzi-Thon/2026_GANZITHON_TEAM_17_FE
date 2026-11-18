import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import profileArt from './brand/saebomi.png';
import oniArt from './brand/oni.png';
import wordmarkArt from './brand/logo-wordmark.png';
import brandArt from './brand/logo-symbol.png';
import gratefulArt from './stamp-0.png';
import helpedArt from './stamp-1.png';
import cheeredArt from './stamp-2.png';
import careerIcon from './topic-career.png';
import mindIcon from './topic-mind.png';
import { demoCrisisDetected, demoNicknameBlocked, demoWorryWarning } from './demoFilter';
import { api, ApiError, createWorry, demoAges, demoLetter, getDetail, sample, tags, type Draft, type FeedResponse, type MineResponse,
  type Notification, type Reply, type Worry } from './model';

type Page = 'home' | 'mine' | 'received' | 'feed' | 'profile' | 'info' | 'nickname' | 'alerts' | 'form' | 'detail' | 'done';
type Action = 'heart' | 'update' | 'report';
const empty: Draft = { title: '', content: '', tag: 'CAREER', visibility: 'SENIORS_ONLY' };
const stamps = ['감사해요', '도움 받았어요', '응원 받았어요'];
const stampArt = [gratefulArt, helpedArt, cheeredArt];
const topicPaths: Partial<Record<Draft['tag'], string>> = {
  LOVE: 'M8 13.2 2.9 8.1a3 3 0 0 1 4.2-4.2l.9.9.9-.9a3 3 0 0 1 4.2 4.2z',
  FAMILY: 'M1.5 7.5 8 2l6.5 5.5M3.2 6.3v7h9.6v-7M6.4 13.3V9h3.2v4.3',
  RELATIONSHIP: 'M7 5.2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.5 13v-.8a3.5 3.5 0 0 1 7 0v.8m.2-3.1a3.4 3.4 0 0 1 5.8 2.3v.8',
  LIVING: 'M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 1.5v1m0 11v1M1.5 8h1m11 0h1M3.4 3.4l.7.7m7.8 7.8.7.7m0-9.2-.7.7m-7.8 7.8-.7.7',
  HEALTH: 'M6 2.5h4V6h3.5v4H10v3.5H6V10H2.5V6H6z',
  OTHER: 'M8 2.5 9.6 6l3.9 2-3.9 2L8 13.5 6.4 10 2.5 8l3.9-2z',
};
const youthAges = ['20대', '30대', '40대', '50대', '60대', '70대 이상'];

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return <svg viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
    <path d="M10 16.5 3.7 10.2a4 4 0 0 1 5.7-5.6l.6.6.6-.6a4 4 0 0 1 5.7 5.6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>;
}

function CommentCount({ count }: { count: number }) {
  return <small className="comment-count" aria-label={`댓글 및 답장 ${count}개`}>
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M17.5 9.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-2.7-.5l-3.8 1 .9-3.3a7.5 7.5 0 1 1 13.1-4.7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
    {count}
  </small>;
}

function Topic({ tag }: { tag: Draft['tag'] }) {
  const asset = tag === 'CAREER' ? careerIcon : tag === 'MIND' ? mindIcon : undefined;
  return <span className="pill topic">
    {asset ? <img src={asset} alt="" /> : <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={topicPaths[tag]} stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>}
    {tags[tag]}
  </span>;
}

function restore<T,>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
}

export function YouthApp({ userId }: { userId?: string } = {}) {
  const key = userId ? 'on-youth-server-' + userId : 'on-youth-demo';
  const [items, setItems] = useState<Worry[]>(() => {
    const saved = restore<Worry[]>(key, []);
    if (userId) return saved;
    // 시연 글이 추가되어도 기존에 작성한 글과 신고 상태를 보존해요.
    const savedIds = new Set(saved.map(item => item.id));
    const deletedIds = new Set(restore<number[]>(key + '-deleted', []));
    return [...saved, ...sample.filter(item => !savedIds.has(item.id) && !deletedIds.has(item.id))]
      .map(item => {
        if (!item.mine || ![1, 3].includes(item.id) || !item.replies.length ||
          item.replies.some(reply => reply.image) || restore<number[]>(key + '-reported-replies', []).includes(item.id * 10 + 2)) return item;
        return { ...item, replies: [...item.replies, { id: item.id * 10 + 2, author: '포근한 양', content: '', image: demoLetter }] };
      });
  });
  const [read, setRead] = useState<number[]>(() => restore(key + '-read', []));
  const [page, setPage] = useState<Page>('home');
  const [from, setFrom] = useState<Page>('mine');
  const [selected, select] = useState<number>();
  const [replyId, selectReply] = useState<number>();
  const [filter, setFilter] = useState('');
  const [oldestFirst, setOldestFirst] = useState(false);
  const [draft, setDraft] = useState<Draft>(empty);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [crisisNotice, setCrisisNotice] = useState(false);
  const [action, setAction] = useState<Action>();
  const [completed, setCompleted] = useState<Action>();
  const [confirmReport, setConfirmReport] = useState(false);
  const [nickname, setNickname] = useState(() => restore(key + '-nickname', '포근한 양 312'));
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [age, setAge] = useState(() => restore(key + '-age', ''));
  const [showMenu, setShowMenu] = useState(false);
  const [letterZoom, setLetterZoom] = useState(false);
  const [draftWarning, setDraftWarning] = useState('');
  const [checkedDraft, setCheckedDraft] = useState(false);
  const [activeCard, setActiveCard] = useState<number>();
  const [replyList, setReplyList] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [comments, setComments] = useState<Record<number, string[]>>(() => restore(key + '-comments', {}));
  const [keyboardInset, setKeyboardInset] = useState(0);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const sync = () => setKeyboardInset(Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop));
    viewport.addEventListener('resize', sync);
    viewport.addEventListener('scroll', sync);
    return () => {
      viewport.removeEventListener('resize', sync);
      viewport.removeEventListener('scroll', sync);
    };
  }, []);
  useEffect(() => {
    if (!userId) return;
    let current = true;
    api<{ nickname: string }>(userId, '/api/users/me').then(profile => {
      if (current) setNickname(profile.nickname);
    }).catch(() => {});
    return () => { current = false; };
  }, [userId]);
  const [choice, setChoice] = useState('');
  const [note, setNote] = useState('');
  const [isPublic, setPublic] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [serverAlerts, setServerAlerts] = useState<Notification[]>([]);
  useEffect(() => {
    if (!userId) return;
    let current = true;
    api<MineResponse>(userId, '/api/worries/me').then(({ items: rows }) => {
      if (!current) return;
      setItems(previous => rows.map(row => ({
        id: row.worryId, title: row.title, tag: row.tag, visibility: row.visibility,
        date: row.createdAt, hidden: row.hidden, replyCount: row.replyCount,
        content: previous.find(item => item.id === row.worryId)?.content ?? '',
        mine: true, author: '나', replies: [],
      })));
      setLoadError('');
    }).catch((failure: Error) => { if (current) setLoadError(failure.message); });
    return () => { current = false; };
  }, [userId]);
  useEffect(() => {
    if (!userId || (page !== 'feed' && page !== 'alerts')) return;
    let current = true;
    setLoadError('');
    const request = page === 'feed'
      ? api<FeedResponse>(userId, '/api/worries/public').then(({ items: rows }) => {
        if (!current) return;
        setItems(previous => {
          const mine = previous.filter(item => item.mine);
          return [...mine, ...rows.filter(row => !mine.some(item => item.id === row.worryId)).map(row => ({
            id: row.worryId, title: row.title, tag: row.tag, date: row.createdAt,
            replyCount: row.replyCount, mine: false, visibility: 'PUBLIC' as const,
            author: '', content: '', replies: [],
          }))];
        });
      })
      : api<{ items: Notification[] }>(userId, '/api/notifications').then(({ items: rows }) => {
        if (current) setServerAlerts(rows);
      });
    request.catch((failure: Error) => { if (current) setLoadError(failure.message); });
    return () => { current = false; };
  }, [page, userId]);
  const worry = items.find(item => item.id === selected);
  const authorAge = worry && (worry.authorAge || (!userId ? (worry.mine && age) || demoAges[worry.id] : undefined));
  const reply = worry?.replies.find(item => item.id === replyId);
  const myItems = items.filter(item => item.mine);
  const notifications = myItems.filter(item => !item.hidden && item.replies.length);
  const titles: Record<Page, string> = {
    home: '한 올', mine: '한 올', received: '한 올', feed: '한 올', profile: '한 올',
    info: '프로필 수정', nickname: '프로필 수정', alerts: '알림', form: editing ? '고민 수정' : '고민 작성하기', detail: reply ? '답장' : '고민 읽기', done: '고민 전달 완료',
  };

  function save(next: Worry[]) {
    localStorage.setItem(key, JSON.stringify(next));
    setItems(next);
  }
  function go(next: Page) {
    setCommentDraft('');
    setPage(next);
    setError('');
    setAction(undefined);
    setCompleted(undefined);
    setFilter('');
    setLoadError('');
    setShowMenu(false);
    setActiveCard(undefined);
    setDraftWarning('');
    setCrisisNotice(false);
    setReplyList(false);
  }
  async function open(item: Worry, source: Page, targetReply?: number) {
    if (pending) return;
    setError('');
    try {
      if (userId) {
        setPending(true);
        const detail = await getDetail(userId, item.id);
        const cachedReplies = item.replies;
        detail.replies = detail.replies.map(row => ({
          ...row, heart: cachedReplies.find(cached => cached.id === row.id)?.heart,
        }));
        setItems(previous => previous.map(row => row.id === item.id ? detail : row));
        item = detail;
      }
      select(item.id);
      selectReply(undefined);
      setFrom(source);
      go('detail');
      const target = item.replies.find(row => row.id === targetReply) ?? (source === 'received' ? item.replies[0] : undefined);
      if (target) openReply(target);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : '고민을 불러오지 못했어요.');
    } finally { setPending(false); }
  }
  function edit(item?: Worry) {
    setCheckedDraft(false);
    setEditing(Boolean(item));
    setDraft(item ? { title: item.title, content: item.content, tag: item.tag, visibility: item.visibility } : empty);
    go('form');
  }
  function demoOnly() {
    if (!userId) return true;
    setError('이 기능의 서버 연동은 아직 준비 중이에요.');
    return false;
  }
  async function mutate(path: string, method: string, after: (result?: { likedByMe?: boolean; nickname?: string }) => void, data?: object) {
    if (pending) return;
    if (!userId) { after(); return; }
    setPending(true);
    setError('');
    try {
      const result = await api<{ likedByMe?: boolean; nickname?: string }>(userId, path, method, data);
      after(result);
    } catch (failure) {
      if (page === 'form') showWritingError(failure);
      else setError(failure instanceof Error ? failure.message : '다시 시도해 주세요.');
    } finally { setPending(false); }
  }
  function changeWorry(changes: Partial<Worry>) {
    if (worry) save(items.map(item => item.id === worry.id ? { ...item, ...changes } : item));
  }
  function changeReply(changes: Partial<Reply>) {
    if (worry && reply) changeWorry({
      replies: worry.replies.map(item => item.id === reply.id ? { ...item, ...changes } : item),
    });
  }
  function openReply(item: Reply) {
    setReplyList(true);
    selectReply(item.id);
    setLetterZoom(false);
    setError('');
  }
  function showWritingError(failure: unknown) {
    const message = failure instanceof Error ? failure.message : '다시 시도해 주세요.';
    if (failure instanceof ApiError && /^FILTER_422_00[123]$/.test(failure.code ?? '')) setDraftWarning(message);
    else setError(message);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setCheckedDraft(true);
    if (!draft.title.trim() || !draft.content.trim()) return;
    setError('');
    setDraftWarning('');
    if (!userId) {
      const warning = demoWorryWarning(draft.title, draft.content);
      if (warning) { setDraftWarning(warning); return; }
    }
    if (editing) {
      if (!worry || worry.hidden || (worry.replyCount ?? worry.replies.length)) return;
      const { title, content, tag } = draft;
      await mutate('/api/worries/' + worry.id, 'PATCH', () => {
        changeWorry(draft);
        go('detail');
      }, { title, content, tag });
      return;
    }
    setPending(true);
    try {
      const result = userId ? await createWorry(userId, draft) : {
        worryId: Date.now(), createdAt: new Date().toISOString(), crisisDetected: demoCrisisDetected(draft.content),
      };
      const item = { ...draft, id: result.worryId, date: result.createdAt, mine: true, author: '나', replies: [] };
      // 서버 등록 성공을 받은 뒤에만 목록에 추가해요.
      save([item, ...items]);
      select(item.id);
      selectReply(undefined);
      go('done');
      setCrisisNotice(result.crisisDetected);
    } catch (failure) {
      showWritingError(failure);
    } finally {
      setPending(false);
    }
  }
  function startAction(next: Action) {
    setError('');
    setChoice('');
    setNote('');
    setPublic(false);
    setConfirmReport(false);
    setAction(next);
  }
  function submitAction(event: FormEvent) {
    event.preventDefault();
    if (!worry || !action || pending) return;
    if (action === 'report') {
      if (!confirmReport) { setConfirmReport(true); return; }
      if (reply) {
        const codes: Record<string, string> = { '욕설 및 비방': 'ABUSE', 성희롱: 'SEXUAL', '광고·홍보': 'AD', '관련 없는 내용': 'IRRELEVANT', 기타: 'ETC' };
        void mutate('/api/replies/' + reply.id + '/reports', 'POST', () => {
          if (!userId) {
            const reported = restore<number[]>(key + '-reported-replies', []);
            localStorage.setItem(key + '-reported-replies', JSON.stringify([...reported, reply.id]));
          }
          changeWorry({ replies: worry.replies.filter(item => item.id !== reply.id) });
          selectReply(undefined);
          setAction(undefined);
          setCompleted('report');
        }, { reason: codes[choice] });
      } else if (demoOnly()) {
        changeWorry({ hidden: true });
        setAction(undefined);
        setCompleted('report');
      }
    }
    if (action === 'heart' && reply && worry.mine && !reply.heart) {
      const codes: Record<string, string> = { 감사해요: 'GRATEFUL', '도움 받았어요': 'HELPED', '응원 받았어요': 'CHEERED' };
      void mutate('/api/replies/' + reply.id + '/thanks', 'POST', () => {
        changeReply({ heart: { stamp: choice, note } });
        setAction(undefined);
        setCompleted('heart');
      }, { stamp: codes[choice], message: note || undefined });
    }
    if (action === 'update' && reply && worry.mine && !reply.update) {
      const publicUpdate = worry.visibility === 'PUBLIC' && isPublic;
      void mutate('/api/replies/' + reply.id + '/follow-ups', 'POST', () => {
        changeReply({ update: { content: note, public: publicUpdate } });
        setAction(undefined);
        setCompleted('update');
      }, { content: note, visibility: publicUpdate ? 'PUBLIC' : 'SENIORS_ONLY' });
    }
  }
  function card(item: Worry, source: Page) {
    const expanded = activeCard === item.id || (activeCard === undefined && source === 'feed' &&
      items.filter(row => !row.mine && !row.hidden && (!filter || row.tag === filter))
        .sort((a, b) => b.date.localeCompare(a.date))[0]?.id === item.id);
    return <article className={`card story${expanded ? ' story-expanded' : ''}`} key={item.id}>
      <span className="story-meta"><Topic tag={item.tag} /><time>{item.date.slice(0, 10).replaceAll('-', '.')}</time></span>
      <button className="story-title" onClick={() => setActiveCard(expanded ? 0 : item.id)} aria-expanded={expanded}>
        <strong>{item.title}</strong>{!expanded && <span className="chevron-circle" aria-hidden="true" />}
      </button>
      {item.hidden && <small>선배님들께 보이지 않는 글이에요</small>}
      {expanded && <div className="story-meta"><div className="story-counts"><small className="heart-count"><HeartIcon filled={item.liked} />{item.liked ? 1 : 0}</small>
        <CommentCount count={(item.replyCount ?? item.replies.length) + (comments[item.id]?.length ?? 0)} /></div>
        <button className="primary story-link" disabled={pending} onClick={() => open(item, source)}>{source === 'received' ? '답장읽기' : '고민읽기'}</button>
      </div>}
    </article>;
  }
  function list(source: 'mine' | 'received' | 'feed') {
    const available = source === 'feed'
      ? items.filter(item => !item.mine && !item.hidden && item.visibility === 'PUBLIC')
      : source === 'received' ? myItems.filter(item => !item.hidden && (item.replyCount ?? item.replies.length)) : myItems;
    const visible = available.filter(item => !filter || item.tag === filter).sort((a, b) =>
      oldestFirst ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    return <>
      <div className="tag-picker" role="group" aria-label="고민 주제">
        {[['', '전체'], ...Object.entries(tags)].map(([value, label]) =>
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {label}
          </button>)}
      </div>
      <div className="list-toolbar">
        <span className="pill">{source === 'received' || source === 'mine' && visible.every(item => (item.replyCount ?? item.replies.length) > 0) ? '답장을 받은 고민' : '답장을 기다리는 고민'}</span>
        <select aria-label="정렬 순서" value={oldestFirst ? 'oldest' : 'latest'}
          onChange={event => setOldestFirst(event.target.value === 'oldest')}>
          <option value="latest">최신순</option><option value="oldest">오래된순</option>
        </select>
      </div>
      {visible.length ? visible.map(item => card(item, source)) : <div className="empty"><img className="empty-mascot" src={profileArt} alt="새봄이"/><p>아직 표시할 고민이 없어요.</p></div>}
    </>;
  }

  let body: ReactNode;
  if (page === 'home' || page === 'mine' || page === 'feed') body = <>
    <div className="page-intro"><h1>오늘은 어떤 마음인가요?</h1><p>현재의 고민을 털어놓아보세요.</p></div>
    <div className="switcher" role="group" aria-label="고민 목록 선택">
      <button aria-pressed={page !== 'feed'} onClick={() => go('mine')}>내 고민</button>
      <button aria-pressed={page === 'feed'} onClick={() => go('feed')}>둘러보기</button>
    </div>
    {list(page === 'feed' ? 'feed' : 'mine')}
    {page !== 'feed' && <button className="primary full-width write-button" onClick={() => edit()}>고민 작성하기</button>}
  </>;
  if (page === 'received') body = <>
    <div className="page-intro"><h1>인생 선배께 받은 답장이에요.</h1><p>천천히 받은 답장을 살펴보세요.</p></div>
    {list('received')}
  </>;
  if (page === 'profile') body = <section className="profile-links">
    <img className="profile-art" src={profileArt} alt="편지를 전하는 청년 캐릭터 새봄이" />
    <button className="card story" onClick={() => { setNicknameDraft(nickname); go(userId ? 'nickname' : 'info'); }}>프로필 수정 <span className="chevron-circle" aria-hidden="true" /></button>
    <button className="card story" onClick={() => go('alerts')}>알림 <span className="chevron-circle" aria-hidden="true" /></button>
  </section>;
  if (page === 'info') body = <form className="stack youth-info" onSubmit={event => {
    event.preventDefault();
    const value = nicknameDraft.trim();
    if (value && (value.length < 2 || value.length > 10)) { setError('닉네임은 2~10자로 입력해주세요.'); return; }
    if (demoNicknameBlocked(value)) { setError('닉네임에 사용할 수 없는 표현이 포함되어 있어요.'); return; }
    if (value && items.some(item => !item.mine && item.author === value)) { setError('이미 사용 중인 닉네임입니다.'); return; }
    if (!age) { setError('나이대를 선택해주세요.'); return; }
    const assigned = value || nickname;
    setNickname(assigned);
    localStorage.setItem(key + '-nickname', JSON.stringify(assigned));
    localStorage.setItem(key + '-age', JSON.stringify(age));
    go('profile');
  }}>
    <img className="profile-art" src={profileArt} alt="편지를 전하는 청년 캐릭터 새봄이" />
    <div className="info-intro"><h1>반가워요, <span>청년</span></h1><p>인생 선배께 전할 이름을 알려주세요</p></div>
    <label>닉네임 <input placeholder="예: 따뜻한마음" aria-invalid={Boolean(error && error.includes('닉네임'))}
      value={nicknameDraft} onChange={event => { setNicknameDraft(event.target.value); setError(''); }} /></label>
    <small>실명 대신 편한 이름을 사용해도 돼요.</small>
    <fieldset><legend>나이</legend><div className="age-options">
      {youthAges.map(value => <button type="button" key={value} aria-pressed={value === age}
        onClick={() => { setAge(value); setError(''); }}>{value}</button>)}
    </div></fieldset>
    <button className="primary full-width">다음으로</button>
  </form>;
  if (page === 'nickname') body = <form className="stack" onSubmit={event => {
    event.preventDefault();
    const value = nicknameDraft.trim();
    if (value.length < 2 || value.length > 10) { setError('닉네임은 2~10자로 입력해주세요.'); return; }
    void mutate('/api/users/me/nickname', 'PATCH', result => {
      const saved = result?.nickname ?? value;
      setNickname(saved);
      if (!userId) localStorage.setItem(key + '-nickname', JSON.stringify(saved));
      go('profile');
    }, { nickname: value });
  }}>
    <label>닉네임 <input value={nicknameDraft} maxLength={10} onChange={event => setNicknameDraft(event.target.value)} /></label>
    <small>2~10자로 입력해주세요.</small>
    <button className="primary" disabled={pending}>저장하기</button>
  </form>;
  const serverAlertCard = (item: Notification) =>
    <button className="card story" key={item.notificationId} disabled={pending} onClick={() => {
      void mutate('/api/notifications/' + item.notificationId + '/read', 'PATCH', () => {
        setServerAlerts(previous => previous.map(row => row.notificationId === item.notificationId ? { ...row, read: true } : row));
        go('received');
      });
    }}><span className="alert-icon" aria-hidden="true">✉</span><span><strong>{item.title}</strong><small>{item.read ? '읽음' : '새 알림'}</small></span><time>{item.createdAt.slice(0, 10)}</time></button>;
  const demoAlertCard = (item: Worry) =>
    <button className="card story" key={item.id} onClick={() => {
      const next = [...new Set([...read, item.id])];
      setRead(next);
      localStorage.setItem(key + '-read', JSON.stringify(next));
      open(item, 'alerts');
    }}><span className="alert-icon" aria-hidden="true">✉</span><span><strong>{read.includes(item.id) ? '답장이 왔어요' : '새 답장이 왔어요'}</strong><small>‘{item.title}’에 답장이 왔어요.</small></span></button>;
  if (page === 'alerts') {
    const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
    const current = userId
      ? serverAlerts.filter(item => item.createdAt.startsWith(today)).map(serverAlertCard)
      : notifications.filter(item => !read.includes(item.id)).map(demoAlertCard);
    const earlier = userId
      ? serverAlerts.filter(item => !item.createdAt.startsWith(today)).map(serverAlertCard)
      : notifications.filter(item => read.includes(item.id)).map(demoAlertCard);
    body = <section className="alert-list">
      {current.length > 0 && <><h2>오늘</h2>{current}</>}
      {earlier.length > 0 && <><h2>이전 알림</h2>{earlier}</>}
      {!current.length && !earlier.length && <div className="empty"><img className="empty-mascot" src={profileArt} alt="새봄이"/><p>지금은 알림이 없어요.</p></div>}
    </section>;
  }
  const titleMissing = checkedDraft && !draft.title.trim();
  const contentMissing = checkedDraft && !draft.content.trim();
  if (page === 'form' || crisisNotice) body = <form noValidate onSubmit={submit} className="stack writing-form" inert={crisisNotice || Boolean(draftWarning)}>
    <label className="writing-field"><input aria-label="제목" aria-invalid={titleMissing} aria-describedby={titleMissing ? 'title-required' : undefined} placeholder="제목을 입력해주세요." required maxLength={40} value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} /><small className="counter">{draft.title.length}/40자</small></label>
    {titleMissing && <p className="field-note" id="title-required" role="alert">고민 제목을 입력해주세요.</p>}
    <label className="writing-field"><textarea aria-label="본문" aria-invalid={contentMissing} aria-describedby={contentMissing ? 'content-required' : undefined} placeholder="인생선배님에게 도움을 받고 싶은 내용을 작성해주세요." required maxLength={1000} value={draft.content} onChange={event => setDraft({ ...draft, content: event.target.value })} /><small className="counter">{draft.content.length}/1000자</small></label>
    {contentMissing && <p className="field-note" id="content-required" role="alert">인생 선배께 전할 고민을 적어주세요.</p>}
    <fieldset><legend>태그를 선택해주세요.</legend><div className="tag-picker">
      {Object.entries(tags).map(([value, label]) => <button key={value} type="button" aria-pressed={draft.tag === value}
        onClick={() => setDraft({ ...draft, tag: value as Draft['tag'] })}>{label}</button>)}
    </div></fieldset>
    {!editing && <fieldset><legend>공개 범위를 설정해주세요.</legend><div className="choices">
      {(['PUBLIC', 'SENIORS_ONLY'] as const).map(value => <label key={value}>
        <input name="visibility" type="radio" checked={draft.visibility === value} onChange={() => setDraft({ ...draft, visibility: value })} />
        {value === 'PUBLIC' ? '전체 공개' : '인생 선배와 나만 보기'}
      </label>)}
    </div></fieldset>}
    <div className="writing-guide"><p>아래는 주의사항입니다. 꼭 읽어주세요.</p>
      <p>전화번호나 외부 연락처는 적지 말아주세요.<br />서로를 존중하는 표현으로 고민을 나눠주세요.<br />부적절한 표현이나 링크가 포함되면 등록할 수 없어요.</p>
    </div>
    <button className="primary full-width" disabled={pending}>{pending ? '보내는 중…' : editing ? '수정 완료' : '작성 완료'}</button>
  </form>;
  if (page === 'done' && !crisisNotice) body = <section className="completion"><span aria-hidden="true">✓</span><h1>고민을 올렸어요</h1>
    <p>인생 선배께 글이 전해졌어요.</p>
    <div className="completion-buttons"><button className="primary full-width" onClick={() => go('mine')}>내 고민 보러가기</button>
      <button className="primary full-width home-button" onClick={() => go('home')}><i className="nav-glyph glyph-home" aria-hidden="true" />홈으로 돌아가기</button></div>
  </section>;
  if (page === 'detail' && worry) body = reply ? <>
    <div className="switcher" role="group" aria-label="답장 유형">
      {['글 답장', '종이 답장'].map((label, index) => <button key={label}
        aria-pressed={Boolean(reply.image) === Boolean(index)}
        disabled={!worry.replies.some(item => Boolean(item.image) === Boolean(index))}
        onClick={() => {
          const target = worry.replies.find(item => Boolean(item.image) === Boolean(index));
          if (target && target.id !== reply.id) openReply(target);
        }}>{label}</button>)}
    </div>
    <article className={`card detail-card reply-content${reply.image ? ' paper-content' : ''}`} aria-label={reply.author + ' 선배님의 답장'}>
      {reply.image ? <button className="letter-preview" onClick={() => setLetterZoom(true)} aria-label="손편지 확대">
        <img className="letter" src={reply.image} alt="선배님의 손편지 답장" /><span aria-hidden="true">⌕</span>
      </button> : <p className="original">{reply.content}</p>}
      <small className="reply-disclaimer">선배님의 경험에서 나온 이야기예요. 건강·돈·법 문제는 꼭 전문가와 상의하세요.</small>
      {!reply.image && <small className="reply-length">{reply.content.length}/1000자</small>}
    </article>
    {worry.mine ? <div className="reply-actions">
      {!reply.heart && <button className="primary full-width" onClick={() => startAction('heart')}>고마움 전하기</button>}
      {!reply.update && <button className="primary full-width" onClick={() => startAction('update')}>후일담 전하기</button>}
      {worry.visibility === 'PUBLIC' && reply.update?.public && <button onClick={() => {
        if (reply.update && demoOnly()) changeReply({ update: { ...reply.update, public: false } });
      }}>후일담 선배님께만 공개</button>}
      <button className="text-button" onClick={() => startAction('report')}>신고하기</button>
    </div> : <button aria-pressed={Boolean(reply.liked)} disabled={pending} onClick={() => {
      void mutate('/api/replies/' + reply.id + '/likes', 'POST', result => changeReply({ liked: result?.likedByMe ?? !reply.liked }));
    }}>{reply.liked ? '♥' : '♡'} 공감</button>}
    {reply.update && (worry.mine || reply.update.public) && <section className="card"><h3>후일담</h3><p className="original">{reply.update.content}</p></section>}
  </> : replyList ? <section className="reply-list" aria-label="답장 목록">
    {worry.replies.map(item => <button className="card story" key={item.id} onClick={() => openReply(item)}>
      <span className="reply-avatar" aria-hidden="true">✉</span><strong>{item.author} 선배님의 답장</strong><span aria-hidden="true">›</span>
    </button>)}
    {worry.replies.length === 0 && <div className="empty"><img className="empty-mascot" src={oniArt} alt="답장을 전하는 인생 선배 온이"/><p>지금은 표시할 답장이 없어요.</p></div>}
  </section> : <>
    <div className="detail-intro"><h1>{worry.mine ? '내 고민이에요' : '천천히 읽어보세요'}</h1><p>인생 선배님이 전해준 이야기를 읽어보세요.</p></div>
    <article className="card detail-card worry-detail">
      <span className="pill visibility-pill">{worry.visibility === 'PUBLIC' ? '모두가 보는 고민' : '인생 선배와 나만 보기'}</span>
      {worry.mine ? <button className="text-button worry-menu-button" aria-label="고민 메뉴" aria-expanded={showMenu} onClick={() => setShowMenu(!showMenu)}>···</button>
        : <button className="text-button worry-menu-button" onClick={() => startAction('report')}>신고하기</button>}
      <div className="story-meta"><small>{worry.author}{authorAge && <span className="author-age"> · {authorAge}</span>}</small><time>{worry.date.slice(0, 10).replaceAll('-', '.')}</time></div><h2>{worry.title}</h2>
      <p className="original">{worry.content}</p>{worry.hidden && <p>선배님들께 보이지 않는 글이에요.</p>}
      <div className="detail-metrics"><Topic tag={worry.tag} />
        {!worry.mine && <button className="text-button heart-count" aria-label="공감" aria-pressed={Boolean(worry.liked)} disabled={pending} onClick={() => {
          void mutate('/api/worries/' + worry.id + '/likes', 'POST', result => changeWorry({ liked: result?.likedByMe ?? !worry.liked }));
        }}><HeartIcon filled={worry.liked} />{worry.liked ? 1 : 0}</button>}
        <CommentCount count={(worry.replyCount ?? worry.replies.length) + (comments[worry.id]?.length ?? 0)} />
      </div>
    {worry.mine && showMenu && <div className="worry-menu">
      <button disabled={pending || worry.hidden || Boolean(worry.replyCount ?? worry.replies.length)} onClick={() => edit(worry)}>수정</button>
      {!worry.hidden && worry.visibility === 'PUBLIC' && <button onClick={() => {
        if (!confirm('고민과 후일담을 선배님께만 공개할까요?')) return;
        void mutate('/api/worries/' + worry.id + '/visibility', 'PATCH', () => {
          changeWorry({ visibility: 'SENIORS_ONLY', replies: worry.replies.map(item =>
            item.update ? { ...item, update: { ...item.update, public: false } } : item) });
        }, { visibility: 'SENIORS_ONLY' });
      }}>공개 범위 변경</button>}
      <button className="menu-delete" onClick={() => {
        if (!confirm('고민을 삭제할까요? 삭제하면 되돌릴 수 없어요.')) return;
        void mutate('/api/worries/' + worry.id, 'DELETE', () => {
          if (!userId) {
            const deleted = restore<number[]>(key + '-deleted', []);
            localStorage.setItem(key + '-deleted', JSON.stringify([...deleted, worry.id]));
          }
          save(items.filter(item => item.id !== worry.id));
          go('mine');
        });
      }}>삭제</button>
    </div>}
    </article>
    {!worry.hidden && (worry.mine || (worry.replyCount ?? worry.replies.length) > 0) && <section className="inline-replies"><h3>선배 답장 {worry.replyCount ?? worry.replies.length}통</h3>
      {worry.replies.map(item => <button className="inline-reply" key={item.id} onClick={() => openReply(item)}>
        <span className="reply-avatar" aria-hidden="true" /><span><strong>{item.author} 선배님</strong>
          <small>{item.image ? '종이 답장이 도착했어요.' : item.content}</small></span>
        <span className="chevron-circle" aria-hidden="true" />
      </button>)}
      {worry.replies.length > 0 && <div className="reply-dock"><button className="primary full-width" onClick={() => setReplyList(true)}>답장 확인하기</button></div>}
    </section>}
    {!userId && !worry.hidden && worry.visibility === 'PUBLIC' && <section className="demo-comments" aria-label="댓글">
      {(comments[worry.id]?.length ?? 0) > 0 && <div className="demo-comment-list">
        {(comments[worry.id] ?? []).map((comment, index) => <article key={index}>
          <span className="comment-avatar" aria-hidden="true" /><div><strong>{nickname}</strong><p>{comment}</p></div>
        </article>)}
      </div>}
      <form className="comment-dock" style={{ bottom: keyboardInset }} onSubmit={event => {
        event.preventDefault();
        const content = commentDraft.trim();
        if (!content) return;
        const next = { ...comments, [worry.id]: [...(comments[worry.id] ?? []), content] };
        setComments(next);
        localStorage.setItem(key + '-comments', JSON.stringify(next));
        setCommentDraft('');
      }}>
        <input aria-label="댓글" placeholder="따뜻한 한마디를 남겨주세요" maxLength={255}
          value={commentDraft} onChange={event => setCommentDraft(event.target.value)} />
        <button className="primary" aria-label="댓글 보내기" disabled={!commentDraft.trim()}>↑</button>
      </form>
    </section>}
  </>;

  const actionTitle = action === 'heart' ? '고마움 전하기' : action === 'update' ? '후일담 전하기' : '신고하기';
  const reasons = reply ? ['욕설 및 비방', '성희롱', '광고·홍보', '관련 없는 내용', '기타'] : ['광고·홍보', '욕설', '기타'];
  const canGoBack = ['form', 'detail', 'done', 'alerts', 'nickname', 'info'].includes(page);
  const actionSheet = action === 'heart' || action === 'update';
  const activeTab = page === 'received' ? 'received' : page === 'profile' || page === 'alerts' ? 'profile' : 'home';
  return <div className={`youth-app screen-${crisisNotice ? 'form' : page}${replyList && !reply ? ' screen-reply-list' : ''}${reply ? ' screen-reply' : ''}${actionSheet ? ' feedback-screen feedback-' + action : ''}${completed && completed !== 'report' ? ' result-screen' : ''}`}>
    <header>
      {canGoBack && <button aria-label="뒤로" disabled={pending || crisisNotice || Boolean(draftWarning)} onClick={() => {
        if (completed || action) { setCompleted(undefined); setAction(undefined); setError(''); }
        else if (page === 'alerts' || page === 'nickname' || page === 'info') go('profile');
        else if (page === 'detail' && (reply || replyList)) { selectReply(undefined); go(from); }
        else go(page === 'detail' ? from : editing && page === 'form' ? 'detail' : 'home');
      }}>‹</button>}
      <strong>{titles[page] === '한 올' && <span className="youth-brand" role="img" aria-label="한 올"><img className="brand-art" src={brandArt} alt="" /><img className="wordmark-art" src={wordmarkArt} alt="" /></span>}
        {crisisNotice ? titles.form : completed && completed !== 'report' ? completed === 'heart' ? '고마움 전달 완료' : '후일담 전달 완료' : actionSheet ? actionTitle : replyList ? '답장' : titles[page] === '한 올' ? null : titles[page]}</strong>
    </header>
    <main>{!actionSheet && (!completed || completed === 'report') && body}
      {letterZoom && reply?.image && <div className="letter-zoom" role="dialog" aria-modal="true" aria-label="손편지 크게 보기">
        <button aria-label="닫기" onClick={() => setLetterZoom(false)}>×</button><img src={reply.image} alt="선배님의 손편지 답장" />
      </div>}
      {draftWarning && <div className="dialog-backdrop"><section className="writing-dialog" role="alertdialog" aria-modal="true" aria-labelledby="writing-warning">
        <span aria-hidden="true">!</span><h2 id="writing-warning">내용을 한 번 더 확인해 주세요</h2>
        <p>외부 연락처나 부적절한 표현이 포함되어 있어요. 내용을 수정해 주세요.</p>
        <div className="writing-reason"><strong>확인 항목</strong><p>{draftWarning}</p></div>
        <button className="primary full-width" autoFocus onClick={() => setDraftWarning('')}>다음</button>
      </section></div>}
      {crisisNotice && <div className="dialog-backdrop"><section className="writing-dialog crisis-dialog" role="alertdialog" aria-modal="true" aria-labelledby="crisis-notice">
        <span aria-hidden="true">!</span><h2 id="crisis-notice">혼자 감당하기 힘들 때는<br />전문 상담사와 이야기해보세요.</h2>
        <p><a href="tel:109">자살예방상담전화 109</a></p>
        <button className="primary full-width" autoFocus onClick={() => setCrisisNotice(false)}>다음</button>
      </section></div>}
      {!action && (error || loadError) && <p role="alert" className="error">{error || loadError}</p>}
      {action && <div className={actionSheet ? 'feedback-content' : 'dialog-backdrop report-backdrop'}>
      <section className={actionSheet ? 'feedback-form' : 'card action'} role={actionSheet ? undefined : 'dialog'}
        aria-modal={actionSheet ? undefined : true} aria-label={actionTitle}>
      <form className="stack" onSubmit={submitAction}>
        {action === 'report' && confirmReport && <span className="report-symbol" aria-hidden="true">!</span>}
        <h2>{actionSheet ? <>인생 선배님께<br />{action === 'heart' ? '고마움을 전해볼까요?' : '후일담을 전해볼까요?'}</>
          : confirmReport ? '이 내용으로 신고할까요?' : '어떤 이유로 신고하시나요?'}</h2>
        {action === 'heart' && <fieldset><legend>감사 도장 고르기</legend><div className="stamp-picker">
          {stamps.map((stamp, index) => <button key={stamp} type="button" aria-pressed={choice === stamp}
            onClick={() => setChoice(stamp)}><img src={stampArt[index]} alt="" />{stamp}</button>)}
        </div></fieldset>}
        {action === 'report' && !confirmReport && <fieldset className="report-reasons"><legend>해당하는 사유 하나를 선택해주세요.</legend>
          {reasons.map(reason => <label key={reason}><input type="radio" name="reason" checked={choice === reason}
            onChange={() => setChoice(reason)} />{reason}</label>)}
        </fieldset>}
        {action === 'report' && confirmReport && <><span className="pill report-choice">{choice}</span><p>신고 내용은 운영팀이 확인합니다.</p></>}
        {action !== 'report' && <label>{action === 'heart' ? '고마움 한마디 (선택)' : '후일담'}
          <textarea placeholder={action === 'heart' ? '예: 덕분에 큰 도움을 받았어요.' : '예: 덕분에 이후에 상황이 나아졌어요.'}
            maxLength={action === 'heart' ? 255 : 1000} value={note} onChange={event => setNote(event.target.value)} />
          <small className="counter">{note.length}/{action === 'heart' ? '255' : '1,000'}자</small>
        </label>}
        {action === 'update' && worry?.visibility === 'PUBLIC' && <label>공개 범위
          <select value={String(isPublic)} onChange={event => setPublic(event.target.value === 'true')}>
            <option value="false">선배님께만</option><option value="true">전체 공개</option>
          </select>{isPublic && <small>다른 청년 사용자도 이 후일담을 볼 수 있어요.</small>}
        </label>}
        {action === 'update' && <small>후일담은 한 번만 보낼 수 있어요.</small>}
        {error && <p className="error" role="alert">{error}</p>}
        <div className="row dialog-buttons">{action === 'report' && confirmReport && <button type="button" disabled={pending}
          onClick={() => { setAction(undefined); setError(''); }}>취소</button>}
          <button className="primary" disabled={pending || (action === 'update' ? !note.trim() : !choice)}>
            {action === 'report' && !confirmReport ? '다음' : actionTitle}</button></div>
        {action === 'report' && !confirmReport && <button className="text-button report-cancel" type="button"
          onClick={() => { setAction(undefined); setError(''); }}>취소</button>}
      </form></section></div>}
      {completed === 'report' && <div className="dialog-backdrop report-backdrop">
        <section className="report-receipt" role="dialog" aria-modal="true" aria-labelledby="report-receipt-title">
          <span className="report-symbol" aria-hidden="true">✓</span>
          <h2 id="report-receipt-title">신고가 접수됐어요</h2>
          <p>{worry?.mine ? '신고한 답장이 숨겨졌어요.' : '신고한 고민이 숨겨졌어요.'}</p>
          <button className="primary full-width" autoFocus onClick={() => worry?.mine ? setCompleted(undefined) : go('feed')}>
            {worry?.mine ? '닫기' : '고민 목록으로'}
          </button>
        </section>
      </div>}
      {completed && completed !== 'report' && <div className="feedback-result">
        <section className="completion" role="status"><span aria-hidden="true">✓</span>
          <h1>{completed === 'heart' ? '고마움을 전달했어요' : '후일담을 전달했어요'}</h1>
          <p>인생 선배께 마음이 전해졌어요.</p>
          <button className="primary full-width home-button" onClick={() => go('home')}><i className="nav-glyph glyph-home" aria-hidden="true" />홈으로 돌아가기</button>
        </section>
      </div>}
    </main>
    {(!canGoBack || page === 'alerts') && <nav aria-label="청년 메뉴">
      {(['home', 'received', 'profile'] as const).map(tab => <button key={tab}
        aria-current={activeTab === tab ? 'page' : undefined} onClick={() => go(tab)}>
        <span aria-hidden="true"><i className={`nav-glyph glyph-${tab}`} /></span>
        {{ home: '홈', received: '답장', profile: '내 한 올' }[tab]}
      </button>)}
    </nav>}
  </div>;
}
