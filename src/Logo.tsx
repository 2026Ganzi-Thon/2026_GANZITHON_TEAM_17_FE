import {brand} from './brand';
/** Shared original symbol and lettering, including the splash screen. */
export default function Logo({white=false}:{white?:boolean}){
 return <div className={`logo ${white?'white':''}`} role="img" aria-label="한 올"><img className="brand-symbol" src={brand.symbol} alt="" width={553} height={293}/><img className="brand-wordmark" src={brand.wordmark} alt="" width={452} height={213}/></div>;
}
