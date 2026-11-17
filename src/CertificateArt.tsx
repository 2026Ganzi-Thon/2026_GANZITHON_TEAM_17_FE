import {useEffect,useRef} from 'react';
export type CertificateData={certificateId:number;nickname:string;replyCount:number;issuedAt:string};
export function drawCertificate(canvas:HTMLCanvasElement,detail:CertificateData){
 canvas.width=1200;canvas.height=1660;const c=canvas.getContext('2d');if(!c)throw new Error('감사장 이미지를 만들 수 없어요.');
 const g=c.createLinearGradient(0,0,1200,1660);g.addColorStop(0,'#eee1fb');g.addColorStop(1,'#fff0e4');c.fillStyle=g;c.fillRect(0,0,1200,1660);
 c.strokeStyle='#bda0f3';c.lineWidth=3;c.beginPath();c.roundRect(35,35,1130,1590,95);c.stroke();c.lineWidth=1;c.beginPath();c.roundRect(52,52,1096,1556,86);c.stroke();
 c.textAlign='center';c.fillStyle='#8259ce';c.font='600 35px sans-serif';c.fillText('한 올',600,135);c.font='24px sans-serif';c.fillText('스무 통의 온기를 기억하며',600,188);c.fillStyle='#6033a0';c.font='bold 125px serif';c.fillText('감사장',600,365);
 // Original vector sweater illustration, drawn into the same exported card.
 c.save();c.translate(600,575);const wool=c.createLinearGradient(-150,-100,150,180);wool.addColorStop(0,'#cbb0fa');wool.addColorStop(1,'#8b59c0');c.fillStyle=wool;c.beginPath();c.moveTo(-90,-100);c.lineTo(-145,-65);c.lineTo(-215,115);c.lineTo(-145,145);c.lineTo(-100,45);c.lineTo(-100,180);c.quadraticCurveTo(0,205,100,180);c.lineTo(100,45);c.lineTo(145,145);c.lineTo(215,115);c.lineTo(145,-65);c.lineTo(90,-100);c.quadraticCurveTo(0,-55,-90,-100);c.fill();c.strokeStyle='#9768c9';c.lineWidth=4;for(let x=-75;x<=75;x+=15){c.beginPath();c.moveTo(x,-50);c.lineTo(x,178);c.stroke()}c.beginPath();c.ellipse(0,-98,72,23,0,0,Math.PI*2);c.fillStyle='#704693';c.fill();c.strokeStyle='#d7bdf8';c.lineWidth=13;c.stroke();c.restore();
 c.fillStyle='#6033a0';c.font='bold 49px serif';c.fillText(`${detail.nickname} 선배님께`,600,875,1040);
 c.fillStyle='#865cb0';c.font='29px sans-serif';const lines=['선배님이 건넨 스무 통의 답장에는','살아온 시간과 다정한 마음이 담겨 있습니다.','','청년의 고민에 귀 기울이고, 자신의 경험을','기꺼이 나누어주신 그 따뜻한 마음에 감사드립니다.','','한 올 한 올 모인 선배님의 이야기가','누군가의 내일을 조금 더 포근하게 만듭니다.'];lines.forEach((line,i)=>c.fillText(line,600,980+i*48));
 c.font='26px sans-serif';c.fillText(`누적 답장 ${detail.replyCount}통 · ${Math.floor(detail.replyCount/20)}번째 감사장`,600,1435);c.font='26px serif';c.fillText(new Date(detail.issuedAt).toLocaleDateString('ko-KR'),600,1505);c.font='bold 28px serif';c.fillText('마음을 건네고, 온기를 잇다',600,1565);
}
export default function CertificateArt({detail}:{detail:CertificateData}){const ref=useRef<HTMLCanvasElement>(null);useEffect(()=>{if(ref.current)drawCertificate(ref.current,detail)},[detail]);return <canvas ref={ref} className="certificate-preview" role="img" aria-label={`${detail.nickname} 선배님께 드리는 누적 답장 ${detail.replyCount}통 감사장, ${new Date(detail.issuedAt).toLocaleDateString('ko-KR')} 발급`}/>}
