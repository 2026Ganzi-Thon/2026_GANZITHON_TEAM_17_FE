import {useEffect,useRef,useState} from 'react';
import {loadBrandLogo,loadWoolSweater} from './brand';
export type CertificateData={certificateId:number;nickname:string;replyCount:number;issuedAt:string};
export async function drawCertificate(canvas:HTMLCanvasElement,detail:CertificateData){
 const [logo,sweater]=await Promise.all([loadBrandLogo(),loadWoolSweater()]);
 // Canvas does not trigger web-font loading. Load each face before preview or export.
 await Promise.all([
  document.fonts.load('900 150px "Noto Serif KR"','감사장'),
  document.fonts.load('800 72px "Noto Serif KR"',`${detail.nickname} 선배님께 마음을 건네고, 온기를 잇다 0123456789년월일`),
  document.fonts.load('400 36px "Noto Sans KR"','스무 통의 온기를 기념하며 선배님이 건넨 답장에는 살아온 시간과 다정한 마음이 담겨 있습니다. 청년의 고민에 귀 기울이고, 자신의 경험을 기꺼이 나누어주신 그 따뜻한 마음에 감사드립니다. 한 올 한 올 모인 선배님의 이야기가 누군가의 내일을 조금 더 포근하게 만듭니다. 누적 답장 0123456789통 · 첫 번째 두 세 감사장'),
 ]);
 await document.fonts.ready;
 canvas.width=1200;canvas.height=1720;
 const c=canvas.getContext('2d');if(!c)throw new Error('감사장 이미지를 만들 수 없어요.');
 c.save();c.beginPath();c.roundRect(1,1,1198,1718,110);c.clip();
 const g=c.createLinearGradient(0,0,1000,1720);g.addColorStop(0,'#eeddf0');g.addColorStop(.48,'#f8efeb');g.addColorStop(1,'#f7ebf1');
 c.fillStyle=g;c.fillRect(0,0,1200,1720);
 c.strokeStyle='#ded8dc';c.lineWidth=3;c.beginPath();c.roundRect(1,1,1198,1718,110);c.stroke();
 c.strokeStyle='#a186ff';c.lineWidth=2;c.beginPath();
 c.moveTo(173,40);c.lineTo(1057,40);c.bezierCurveTo(1120,40,1167,82,1167,145);
 c.lineTo(1167,1570);c.bezierCurveTo(1167,1637,1085,1650,1044,1607);
 c.bezierCurveTo(1007,1568,1045,1532,1073,1565);c.bezierCurveTo(1083,1507,1141,1541,1123,1585);
 c.bezierCurveTo(1096,1655,1040,1680,977,1680);c.lineTo(133,1680);
 c.bezierCurveTo(74,1680,32,1638,32,1580);c.lineTo(32,240);
 c.bezierCurveTo(32,182,60,163,94,126);c.bezierCurveTo(128,87,87,36,51,85);
 c.bezierCurveTo(21,137,71,139,108,97);c.bezierCurveTo(128,74,147,50,173,40);c.stroke();
 const logoHeight=82;const symbolWidth=logo.symbol.naturalWidth/logo.symbol.naturalHeight*logoHeight;
 const wordHeight=60;const wordWidth=logo.wordmark.naturalWidth/logo.wordmark.naturalHeight*wordHeight;
 const logoLeft=(1200-symbolWidth-wordWidth-35)/2;
 c.drawImage(logo.symbol,logoLeft,78,symbolWidth,logoHeight);c.drawImage(logo.wordmark,logoLeft+symbolWidth+35,98,wordWidth,wordHeight);
 c.textAlign='center';c.fillStyle='#6234b2';
 c.font='400 36px "Noto Sans KR", sans-serif';
 const dedication='스무 통의 온기를 기념하며';
 // Draw spaced text without relying on browser-specific Canvas letterSpacing support.
 const spacing=9;const widths=Array.from(dedication).map(letter=>c.measureText(letter).width);
 let x=(1200-widths.reduce((sum,width)=>sum+width,0)-spacing*(widths.length-1))/2;
 c.textAlign='left';Array.from(dedication).forEach((letter,index)=>{c.fillText(letter,x,222);x+=widths[index]+spacing});c.textAlign='center';
 c.font='900 150px "Noto Serif KR", serif';c.fillText('감사장',600,438);
 const sweaterHeight=290;const sweaterWidth=sweater.naturalWidth/sweater.naturalHeight*sweaterHeight;
 c.drawImage(sweater,(1200-sweaterWidth)/2,487,sweaterWidth,sweaterHeight);
 const star=(x:number,y:number,size:number)=>{c.save();c.translate(x,y);c.fillStyle='#ff8147';c.beginPath();c.moveTo(0,-size);c.quadraticCurveTo(size*.16,-size*.16,size,0);c.quadraticCurveTo(size*.16,size*.16,0,size);c.quadraticCurveTo(-size*.16,size*.16,-size,0);c.quadraticCurveTo(-size*.16,-size*.16,0,-size);c.fill();c.restore()};
 star(438,540,27);star(768,728,18);
 c.font='800 72px "Noto Serif KR", serif';c.fillText(`${detail.nickname} 선배님께`,600,863,1040);
 c.strokeStyle='#ad91ff';c.lineWidth=2;c.beginPath();c.moveTo(524,921);c.lineTo(676,921);c.stroke();
 c.font='400 36px "Noto Sans KR", sans-serif';
 const lines=['선배님이 건넨 스무 통의 답장에는','살아온 시간과 다정한 마음이 담겨 있습니다.','','청년의 고민에 귀 기울이고, 자신의 경험을','기꺼이 나누어주신 그 따뜻한 마음에 감사드립니다.','','한 올 한 올 모인 선배님의 이야기가','누군가의 내일을 조금 더 포근하게 만듭니다.'];
 lines.forEach((line,i)=>c.fillText(line,600,997+i*46,1060));
 c.font='400 28px "Noto Sans KR", sans-serif';
 const edition=Math.floor(detail.replyCount/20);
 const editionText=({1:'첫 번째',2:'두 번째',3:'세 번째'} as Record<number,string>)[edition]||`${edition}번째`;
 const badge=`누적 답장 ${detail.replyCount}통  ·  ${editionText} 감사장`;
 const badgeWidth=Math.min(1040,c.measureText(badge).width+76);
 c.strokeStyle='#b49aff';c.lineWidth=1.3;c.beginPath();c.roundRect((1200-badgeWidth)/2,1368,badgeWidth,61,31);c.stroke();c.fillText(badge,600,1409,1000);
 const issued=new Date(detail.issuedAt);
 const issuedDate=new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long',day:'numeric',timeZone:'Asia/Seoul'}).format(issued);
 c.font='800 33px "Noto Serif KR", serif';c.fillText(issuedDate,600,1505);
 c.font='800 37px "Noto Serif KR", serif';c.fillText('마음을 건네고, 온기를 잇다',600,1579);
 c.restore();
}
export default function CertificateArt({detail}:{detail:CertificateData}){
 const ref=useRef<HTMLCanvasElement>(null);const [error,setError]=useState('');const [ready,setReady]=useState(false);const [attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;setError('');setReady(false);const canvas=document.createElement('canvas');drawCertificate(canvas,detail).then(()=>{if(!active||!ref.current)return;ref.current.width=canvas.width;ref.current.height=canvas.height;const context=ref.current.getContext('2d');if(!context)throw new Error('감사장을 표시할 수 없어요.');context.drawImage(canvas,0,0);setReady(true)}).catch(e=>{if(active)setError(e instanceof Error?e.message:'감사장을 불러오지 못했어요.')});return()=>{active=false}},[detail,attempt]);
 return <>{error?<div className="notice" role="alert"><p>{error}</p><button className="secondary" onClick={()=>setAttempt(n=>n+1)}>다시 불러오기</button></div>:!ready&&<p className="helper" role="status">감사장 디자인을 준비하고 있어요…</p>}<canvas ref={ref} hidden={!ready} className="certificate-preview" role="img" aria-label={`${detail.nickname} 선배님께 드리는 누적 답장 ${detail.replyCount}통 감사장, ${new Date(detail.issuedAt).toLocaleDateString('ko-KR')} 발급`}/></>;
}
