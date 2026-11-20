import {brand} from './brand';

/** Supplied medal and glow exports, kept as separate images at their natural ratios. */
export default function CertificateMedal({size=70,glow=false}:{size?:number;glow?:boolean}){
 return <span className="certificate-medal" style={{width:size,height:size*94/70}} aria-hidden="true">
  {glow&&<img className="certificate-medal-glow" src={brand.certificateMedalGlow} alt="" width={264} height={262}/>}
  <img className="certificate-medal-icon" src={brand.certificateMedal} alt="" width={70} height={94}/>
 </span>;
}
