/** Supplied original artwork; keep its alpha channel and natural aspect ratio. */
export default function Mascot({bird=false}:{bird?:boolean}){
 return <img className={`mascot mascot-original ${bird?'mascot-saebomi':'mascot-oni'}`} src={`${import.meta.env.BASE_URL}brand/${bird?'saebomi':'oni'}.png`} alt={bird?'편지를 전하는 새봄이':'따뜻한 인생 선배 온이'} width={bird?1214:1259} height={bird?1311:1344} decoding="async"/>;
}
