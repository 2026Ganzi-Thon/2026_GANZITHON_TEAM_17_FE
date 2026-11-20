import {brand} from './brand';
/** Supplied original artwork; keep its alpha channel and natural aspect ratio. */
export default function Mascot({bird=false,scene=false}:{bird?:boolean;scene?:boolean}){
 const showScene=scene&&!bird;
 return <img className={`mascot mascot-original ${bird?'mascot-saebomi':'mascot-oni'}${showScene?' mascot-scene':''}`} src={bird?brand.saebomi:showScene?brand.oniScene:brand.oni} alt={bird?'편지를 전하는 새봄이':'따뜻한 인생 선배 온이'} width={bird?1214:showScene?279:1259} height={bird?1311:showScene?208:1344} decoding="async"/>;
}
