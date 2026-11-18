import {useEffect,useRef,useState} from 'react';
import {loadBrandLogo,loadWoolSweater} from './brand';
export type CertificateData={certificateId:number;nickname:string;replyCount:number;issuedAt:string};
export async function drawCertificate(canvas:HTMLCanvasElement,detail:CertificateData){
 const [logo,sweater]=await Promise.all([loadBrandLogo(),loadWoolSweater()]);
 await document.fonts.ready;
 canvas.width=1200;canvas.height=1660;const c=canvas.getContext('2d');if(!c)throw new Error('감사장 이미지를 만들 수 없어요.');
 const g=c.createLinearGradient(0,0,1200,1660);g.addColorStop(0,'#eee1fb');g.addColorStop(1,'#fff0e4');c.fillStyle=g;c.fillRect(0,0,1200,1660);
 c.strokeStyle='#bda0f3';c.lineWidth=3;c.beginPath();c.roundRect(35,35,1130,1590,95);c.stroke();c.lineWidth=1;c.beginPath();c.roundRect(52,52,1096,1556,86);c.stroke();
 const logoHeight=58;const symbolWidth=logo.symbol.naturalWidth/ logo.symbol.naturalHeight*logoHeight;const wordWidth=logo.wordmark.naturalWidth/logo.wordmark.naturalHeight*46;const logoLeft=(1200-symbolWidth-wordWidth-22)/2;c.drawImage(logo.symbol,logoLeft,95,symbolWidth,logoHeight);c.drawImage(logo.wordmark,logoLeft+symbolWidth+22,101,wordWidth,46);c.textAlign='center';c.fillStyle='#8259ce';c.font='24px sans-serif';c.fillText('스무 통의 온기를 기억하며',600,188);c.fillStyle='#6033a0';c.font='bold 125px serif';c.fillText('감사장',600,365);
 // Use the same supplied sweater artwork in the preview and exported document.
 const sweaterHeight=310;const sweaterWidth=sweater.naturalWidth/sweater.naturalHeight*sweaterHeight;c.drawImage(sweater,(1200-sweaterWidth)/2,430,sweaterWidth,sweaterHeight);
 c.fillStyle='#6033a0';c.font='bold 49px serif';c.fillText(`${detail.nickname} 선배님께`,600,875,1040);
 c.fillStyle='#865cb0';c.font='29px sans-serif';const lines=['선배님이 건넨 스무 통의 답장에는','살아온 시간과 다정한 마음이 담겨 있습니다.','','청년의 고민에 귀 기울이고, 자신의 경험을','기꺼이 나누어주신 그 따뜻한 마음에 감사드립니다.','','한 올 한 올 모인 선배님의 이야기가','누군가의 내일을 조금 더 포근하게 만듭니다.'];lines.forEach((line,i)=>c.fillText(line,600,980+i*48));
 c.font='26px sans-serif';c.fillText(`누적 답장 ${detail.replyCount}통 · ${Math.floor(detail.replyCount/20)}번째 감사장`,600,1435);c.font='26px serif';c.fillText(new Date(detail.issuedAt).toLocaleDateString('ko-KR'),600,1505);c.font='bold 28px serif';c.fillText('마음을 건네고, 온기를 잇다',600,1565);
}
export default function CertificateArt({detail}:{detail:CertificateData}){
 const ref=useRef<HTMLCanvasElement>(null);const [error,setError]=useState('');const [ready,setReady]=useState(false);const [attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;setError('');setReady(false);const canvas=document.createElement('canvas');drawCertificate(canvas,detail).then(()=>{if(!active||!ref.current)return;ref.current.width=canvas.width;ref.current.height=canvas.height;const context=ref.current.getContext('2d');if(!context)throw new Error('감사장을 표시할 수 없어요.');context.drawImage(canvas,0,0);setReady(true)}).catch(e=>{if(active)setError(e instanceof Error?e.message:'감사장을 불러오지 못했어요.')});return()=>{active=false}},[detail,attempt]);
 return <>{error?<div className="notice" role="alert"><p>{error}</p><button className="secondary" onClick={()=>setAttempt(n=>n+1)}>다시 불러오기</button></div>:!ready&&<p className="helper" role="status">감사장 디자인을 준비하고 있어요…</p>}<canvas ref={ref} hidden={!ready} className="certificate-preview" role="img" aria-label={`${detail.nickname} 선배님께 드리는 누적 답장 ${detail.replyCount}통 감사장, ${new Date(detail.issuedAt).toLocaleDateString('ko-KR')} 발급`}/></>;
}
