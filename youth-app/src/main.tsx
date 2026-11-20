import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { YouthApp } from './YouthApp';
import { sample, type Worry } from './model';
import brandArt from './brand.png';
import './youth.css';

const demoKey = 'on-youth-demo';
const resetKey = demoKey + '-authored-reset-20261120';
if (!localStorage.getItem(resetKey)) {
  try {
    const stored: Worry[] = JSON.parse(localStorage.getItem(demoKey) ?? '[]');
    const sampleIds = new Set(sample.map(item => item.id));
    const cleaned = stored.filter(item => !item.mine || sampleIds.has(item.id)).map(item => {
      const original = sample.find(row => row.id === item.id);
      return {
        ...item,
        ...(item.mine && original ? {
          title: original.title, content: original.content, tag: original.tag,
        } : {}),
        replies: item.replies.map(({ heart, update, ...reply }) => reply),
      };
    });
    localStorage.setItem(demoKey, JSON.stringify(cleaned));
    localStorage.removeItem(demoKey + '-comments');
    localStorage.setItem(resetKey, '1');
  } catch {
    localStorage.removeItem(demoKey);
    localStorage.removeItem(demoKey + '-comments');
    localStorage.setItem(resetKey, '1');
  }
}

function DemoEntry() {
  const [choosingRole, setChoosingRole] = useState(false);
  if (!choosingRole) return <YouthApp onRestart={() => setChoosingRole(true)} />;
  return <div className="youth-app role-entry">
    <header><strong><img className="brand-art" src={brandArt} alt="" />한 올</strong></header>
    <main>
      <h1>어떤 마음으로 오셨나요?</h1>
      <p>나에게 맞는 역할을 선택해주세요.</p>
      <button className="role-card" onClick={() => setChoosingRole(false)}>
        <strong>청년으로 참여하기</strong><span>고민을 공유해 답장을 받아요</span>
      </button>
      <p className="role-demo-note">청년 파트 미리보기입니다. 어르신 역할 전환은 공통 가입 화면에서 제공됩니다.</p>
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<div className="youth-host"><DemoEntry /></div>);
