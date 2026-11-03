import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { validBirthDate, validPhone } from './validation.js';
import './style.css';

const screens = [
  ['profile', '내 정보 기본'], ['login', '로그인/회원가입 기본'],
  ['social', 'SNS 계정 약관'], ['socialDone', 'SNS 계정 약관 완료'],
  ['name', '이름/생년월일'], ['nameDone', '이름/생년월일 완료'],
  ['phone', '휴대폰번호'], ['phoneDone', '휴대폰번호 완료'],
  ['address', '주소'], ['detail', '세부 주소'], ['addressDone', '주소 완료'],
  ['terms', '서비스 이용약관'], ['termsDone', '서비스 이용약관 완료'],
];
const empty = { name: '', birthDate: '', phone: '', address: '', addressDetail: '', socialConsent: false, serviceConsent: false };
const stages = ['login', 'social', 'name', 'phone', 'address', 'terms'];
function App() {
  const [screen, setScreen] = useState('profile');
  const [data, setData] = useState(empty);
  const [sample, setSample] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState('');
  const [connected, setConnected] = useState(false);
  const titleRef = useRef(null);
  async function load() {
    setLoadError(false);
    try {
      const response = await fetch('/mocks/profile.json');
      if (!response.ok) throw Error();
      const json = await response.json();
      if (!json.name || !json.birthDate || !json.phone || !json.address) throw Error();
      setSample(json);
    } catch { setLoadError(true); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { titleRef.current?.focus(); }, [screen]);
  function go(next) { setError(''); setExpanded(''); setScreen(next); }
  function field(key, value) { setData(previous => ({ ...previous, [key]: value })); setError(''); }
  function submit(event, next, check = true, message = '') {
    event.preventDefault();
    if (!check) { setError(message); return; }
    go(next);
  }
  function useExample() { if (sample) { setData({ ...empty, name: sample.name, birthDate: sample.birthDate, phone: sample.phone, address: sample.address, addressDetail: sample.addressDetail }); setError(''); } }
  const titles = { profile: '내 정보', login: '반가워요, 함께 시작해요', social: 'SNS 계정 이용에 동의해 주세요', socialDone: 'SNS 약관 선택을 마쳤어요', name: '어떻게 불러드릴까요?', nameDone: '이름과 생년월일을 입력했어요', phone: '연락처를 알려주세요', phoneDone: '휴대폰번호를 입력했어요', address: '어디에 살고 계신가요?', detail: '세부 주소를 입력해 주세요', addressDone: '주소를 입력했어요', terms: '마지막으로 약관을 확인해 주세요', termsDone: '내 정보 입력을 마쳤어요' };
  const descriptions = { profile: '입양을 준비하는 나의 정보를 관리해요.', login: '로그인과 회원가입의 화면 흐름을 체험해 보세요.', social: '선택한 항목을 확인한 후 다음으로 이동해요.', name: '이름과 생년월일을 입력해 주세요.', phone: '숫자만 입력하거나 하이픈을 함께 입력해도 돼요.', address: '현재는 주소를 직접 입력하는 화면이에요.', detail: '동·호수 등 나머지 주소를 입력해 주세요.', terms: '아래 내용은 화면 확인용 예시이며 정식 약관이 아니에요.' };
  const done = screen.endsWith('Done');
  const currentStage = screen === 'detail' ? 'address' : screen.replace('Done', '');
  function consent(kind, label, description) {
    return <div className="consent-box"><label className="check-row"><input type="checkbox" checked={data[kind]} onChange={e => field(kind, e.target.checked)}/><span>[필수] {label} <small>화면 체험용</small></span></label><button type="button" className="text-button" aria-expanded={expanded === kind} onClick={() => setExpanded(expanded === kind ? '' : kind)}>예시 내용 {expanded === kind ? '접기 −' : '보기 +'}</button>{expanded === kind && <p className="terms-copy">{description} 실제 서비스의 약관 내용과 동의 범위는 추후 확정될 예정이에요. 여기서 선택한 값은 서버로 전송되지 않아요.</p>}</div>;
  }
  function summary(label, value) { return <div className="info-row"><dt>{label}</dt><dd>{value || '아직 입력하지 않았어요'}</dd></div>; }
  return <div className="shell">
    <aside className="sidebar"><a className="brand" href="#" onClick={e => { e.preventDefault(); go('profile'); }}>✳ <span>서비스명</span></a><p className="brand-caption">함께하는 삶의 첫걸음</p><div className="side-label">MY SPACE</div><button className="selected nav-button" onClick={() => go('profile')}>♧ <span>내 정보</span><span className="dot"/></button><div className="side-note"><span>작은 관심이<br/>좋은 가족을 만들어요.</span><div>🐾</div></div><small>© 2026 서비스명</small></aside>
    <main><header><span>마이페이지 <span className="crumb">/ 내 정보</span></span><span className="demo">화면 체험 · 서버 연결 전</span></header>
      <div className="content"><div className="page-heading"><div><p className="eyebrow">MY INFORMATION</p><h1 ref={titleRef} tabIndex={-1}>{titles[screen]}<span>.</span></h1><p>{descriptions[screen] || '입력 내용을 확인하고 다음 단계로 이동해 주세요.'}</p></div><span className="heading-art" aria-hidden="true">✳</span></div>
      <p className="demo-note">실제 로그인·회원가입·휴대폰 인증은 진행되지 않아요. 예시 정보로 체험할 수 있고, 입력값은 새로고침하면 초기화돼요.</p>
      {screen === 'profile' ? <>
        <section className="card"><div className="card-top"><h2>나의 계정</h2><span className="badge">{connected ? '체험 중' : '로그인 전'}</span></div><div className="profile-body"><div className="avatar" aria-hidden="true">☺</div><div className="identity"><h3>{data.name || '새로운 만남을 준비해요'}</h3><p>{connected ? '가입 흐름을 이어서 체험할 수 있어요.' : '계정을 연결하고 내 정보를 입력해 주세요.'}</p></div><button className="primary" onClick={() => go('login')}>{connected ? '가입 흐름 다시 보기' : '로그인 / 회원가입'}</button></div></section>
        <section className="card information"><div className="card-top"><h2>기본 정보</h2><button className="outline" onClick={() => go('name')}>정보 입력 / 수정 ↗</button></div><dl>{summary('이름', data.name)}{summary('생년월일', data.birthDate)}{summary('휴대폰번호', data.phone)}{summary('주소', [data.address, data.addressDetail].filter(Boolean).join(' '))}</dl></section>
        <section className="card information"><div className="card-top"><h2>약관 동의</h2><button className="outline" onClick={() => go('terms')}>확인하기 ↗</button></div><dl>{summary('SNS 계정 약관', data.socialConsent ? '체험용 동의 선택 완료' : '미선택')}{summary('서비스 이용약관', data.serviceConsent ? '체험용 동의 선택 완료' : '미선택')}</dl></section>
      </> : <section className="card flow-card">
        <ol className="stepper" aria-label="가입 단계">{stages.map((stage, index) => <li key={stage} className={currentStage === stage ? 'active' : ''} aria-current={currentStage === stage ? 'step' : undefined}>{index + 1}<span>{['계정','SNS 약관','이름','연락처','주소','이용약관'][index]}</span></li>)}</ol>
        {screen === 'login' && <div className="login-content"><div className="welcome-art" aria-hidden="true">🐾</div><h2>나와 꼭 맞는 만남의 시작</h2><p>입양 전, 함께할 일상을 준비해요.</p><button className="social-button" onClick={() => { setConnected(true); go('social'); }}>SNS 계정으로 시작하기 · 체험</button><p className="muted">SNS 제공자는 아직 정해지지 않았어요.<br/>실제 계정 연결 없이 다음 화면으로 이동해요.</p></div>}
        {screen === 'social' && <form onSubmit={e => submit(e, 'socialDone', data.socialConsent, '필수 약관을 선택해 주세요.')}><h2>SNS 계정 약관</h2>{consent('socialConsent', 'SNS 계정 정보 이용 동의', 'SNS 계정 연결 시 필요한 정보 이용 동의를 표시하는 예시 영역이에요.')}<button className="primary wide" disabled={!data.socialConsent}>동의하고 계속하기</button></form>}
        {screen === 'name' && <form onSubmit={e => submit(e, 'nameDone', !!data.name.trim() && validBirthDate(data.birthDate), '이름과 오늘 이전의 올바른 생년월일을 입력해 주세요.')}><label>이름<input required maxLength={30} autoComplete="name" value={data.name} onChange={e => field('name', e.target.value)} placeholder="예: 홍길동"/></label><label>생년월일<input required type="date" value={data.birthDate} onChange={e => field('birthDate', e.target.value)}/></label><button className="primary wide">입력 완료</button></form>}
        {screen === 'phone' && <form onSubmit={e => submit(e, 'phoneDone', validPhone(data.phone), '010으로 시작하는 휴대폰번호 11자리를 입력해 주세요.')}><label>휴대폰번호<input required type="tel" inputMode="tel" autoComplete="tel" maxLength={13} value={data.phone} onChange={e => field('phone', e.target.value)} placeholder="010-0000-0000"/></label><p className="muted">번호 입력만 확인해요. 인증 문자는 발송되지 않아요.</p><button className="primary wide">입력 완료</button></form>}
        {screen === 'address' && <form onSubmit={e => submit(e, 'detail', data.address.trim().length >= 5, '주소를 5자 이상 입력해 주세요.')}><label>주소<input required autoComplete="address-line1" maxLength={150} value={data.address} onChange={e => field('address', e.target.value)} placeholder="예: 서울특별시 예시로 17"/></label><p className="muted">주소 검색 서비스 연결 전에는 직접 입력해 주세요.</p><button className="primary wide">세부 주소 입력하기</button></form>}
        {screen === 'detail' && <form onSubmit={e => submit(e, 'addressDone', data.address.trim().length >= 5, '먼저 주소 화면에서 주소를 입력해 주세요.')}><div className="address-preview">{data.address || '입력된 주소가 없어요.'}</div><label>세부 주소 <span className="muted">(선택)</span><input autoComplete="address-line2" maxLength={100} value={data.addressDetail} onChange={e => field('addressDetail', e.target.value)} placeholder="동·호수, 건물명 등"/></label><button className="primary wide">주소 입력 완료</button></form>}
        {screen === 'terms' && <form onSubmit={e => submit(e, 'termsDone', data.serviceConsent, '필수 약관을 선택해 주세요.')}><h2>서비스 이용약관</h2>{consent('serviceConsent', '서비스 이용약관 동의', '서비스 이용약관을 확인할 수 있는 예시 영역이에요.')}<button className="primary wide" disabled={!data.serviceConsent}>선택 완료</button></form>}
        {done && <div className="completion"><div className="complete-icon" aria-hidden="true">✓</div><h2>{titles[screen]}</h2><dl>{screen === 'socialDone' && summary('SNS 약관', data.socialConsent ? '동의 선택 완료' : '아직 선택하지 않았어요')}{screen === 'nameDone' && <>{summary('이름', data.name)}{summary('생년월일', data.birthDate)}</>}{screen === 'phoneDone' && summary('휴대폰번호', data.phone)}{screen === 'addressDone' && summary('주소', [data.address, data.addressDetail].filter(Boolean).join(' '))}{screen === 'termsDone' && summary('서비스 약관', data.serviceConsent ? '동의 선택 완료' : '아직 선택하지 않았어요')}</dl><p className="muted">{screen === 'termsDone' ? '이것은 화면 체험이며 실제 회원가입 완료가 아니에요.' : '입력 완료 화면의 예시예요. 서버에는 저장되지 않아요.'}</p><button className="primary wide" onClick={() => go({socialDone:'name',nameDone:'phone',phoneDone:'address',addressDone:'terms',termsDone:'profile'}[screen])}>{screen === 'termsDone' ? '내 정보로 돌아가기' : '다음으로'}</button></div>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="text-button back-button" onClick={() => go(({login:'profile',social:'login',socialDone:'social',name:'socialDone',nameDone:'name',phone:'nameDone',phoneDone:'phone',address:'phoneDone',detail:'address',addressDone:'detail',terms:'addressDone',termsDone:'terms'})[screen])}>← 이전 화면</button>
      </section>}
      <details className="preview-tools"><summary>제작 화면 목록 · 13개 화면 확인</summary><p>각 화면을 직접 열어 입력 전·후 상태를 확인할 수 있어요. 완료 화면의 값은 현재 입력 상태를 따라가요.</p><div className="screen-list">{screens.map(([key, label]) => <button key={key} className={screen === key ? 'outline current' : 'outline'} aria-pressed={screen === key} onClick={() => go(key)}>{label}</button>)}</div><div className="example-tools"><button className="outline" disabled={!sample} onClick={useExample}>더미 정보 채우기</button><button className="text-button" onClick={() => { setData(empty); setConnected(false); go('profile'); }}>체험 초기화</button>{loadError ? <span role="alert">더미 파일을 불러오지 못했어요. <button className="text-button" onClick={load}>다시 시도</button></span> : !sample && <span role="status">더미 파일 로딩 중…</span>}</div></details>
      <div className="footer-note">🌱 반려 생활의 시작부터 함께할게요.</div>
      </div>
    </main>
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
