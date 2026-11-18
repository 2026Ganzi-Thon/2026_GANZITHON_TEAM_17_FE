import {ChevronRight,LockKeyhole,Sparkles} from 'lucide-react';
import Mascot from './Mascot';
type Role='senior'|'young';
export default function RoleSelection({onSelect}:{onSelect:(role:Role)=>void}){
 return <section className="role-page role-selection" aria-labelledby="role-title">
  <div className="intro"><h1 id="role-title">어떤 마음으로 오셨나요?</h1><p>나에게 맞는 역할을 선택해주세요</p></div>
  <div className="role-choices">{(['senior','young'] as const).map(role=><button type="button" className={`role-card ${role}`} key={role} onClick={()=>onSelect(role)}>
   <div className="role-copy"><h2>{role==='senior'?'인생 선배로':'청년으로'}<br/>참여하기</h2><p>{role==='senior'?<>살아온 이야기를<br/>청년에게 전해요</>:<>고민을 공유해<br/>답장을 받아요</>}</p><span className="round-arrow" aria-hidden="true"><ChevronRight size={22}/></span></div>
   <div className="role-art" aria-hidden="true"><span className="role-ground"/><Mascot bird={role==='young'}/><Sparkles className="role-stars"/><span className="role-cheer">〃</span></div>
  </button>)}</div>
  <p className="privacy"><LockKeyhole size={14}/>닉네임으로 편하게 시작할 수 있어요</p>
 </section>;
}
