/** Single source for supplied original Hanol brand artwork. */
const base=import.meta.env.BASE_URL;
export const brand={
 oni:`${base}brand/oni.png`,
 saebomi:`${base}brand/saebomi.png`,
 symbol:`${base}brand/logo-symbol.png`,
 wordmarkWhite:`${base}brand/wordmark-white.png`,
 sweater:`${base}brand/wool-sweater.png`,
 wordmark:`${base}brand/logo-wordmark.png`,
};
let logoImages:Promise<{symbol:HTMLImageElement;wordmark:HTMLImageElement}>|null=null;
function loadImage(src:string,label='로고'){return new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`${label} 이미지를 불러오지 못했어요. 다시 시도해주세요.`));image.src=src})}
export function loadBrandLogo(){
 if(!logoImages)logoImages=Promise.all([loadImage(brand.symbol),loadImage(brand.wordmark)]).then(([symbol,wordmark])=>({symbol,wordmark})).catch(e=>{logoImages=null;throw e});
 return logoImages;
}

export const woolAssets={THREAD:`${base}brand/wool-thread.png`,BALL:`${base}brand/wool-ball.png`,SCARF:`${base}brand/wool-scarf.png`,SWEATER:brand.sweater};
export const loadWoolSweater=()=>loadImage(brand.sweater,'스웨터');
