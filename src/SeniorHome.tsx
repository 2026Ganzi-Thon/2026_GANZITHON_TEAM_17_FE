import {ArrowRight,Mail} from 'lucide-react';

type Props={nickname:string;loading:boolean;failed:boolean;worryCount:number|null;receivedCount:number|null;onBrowse:()=>void;onReceived:()=>void};
export default function SeniorHome({nickname,loading,failed,worryCount,receivedCount,onBrowse,onReceived}:Props){
 return <section className="home-page">
  <div className="greeting"><h1>안녕하세요,<br/>{nickname}님</h1></div>
  <div className="news-heading"><h2>오늘 도착한 소식이에요</h2></div>
  <button className="news-card" onClick={onBrowse}>
   <h2>{failed?'고민을 불러오지 못했어요':worryCount!==null?`새로운 고민 ${worryCount}개`:loading?'고민을 불러오는 중이에요':'새 고민 확인 중'}</h2>
   <p>청년들이 답장을<br/>기다리고 있어요</p>
   <span className="text-link">둘러보기 <span className="round-arrow" aria-hidden="true"><ArrowRight size={18}/></span></span>
  </button>
  <button className="news-card gratitude" onClick={onReceived}>
   <h2>{receivedCount===null?'새로운 고마움 소식 확인 중':`새로운 고마움 소식 ${receivedCount}개`}</h2>
   <p>내 답장에 고마운<br/>마음이 도착했어요</p>
   <span className="text-link">읽어보기 <span className="round-arrow" aria-hidden="true"><ArrowRight size={18}/></span></span>
  </button>
  <div className="gentle-note"><Mail size={18} aria-hidden="true"/><span aria-hidden="true"/>답장은 편할 때 천천히 해도 괜찮아요</div>
 </section>;
}
