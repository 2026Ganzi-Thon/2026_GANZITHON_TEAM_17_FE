/** Single source for supplied original Hanol brand artwork. */
const base=import.meta.env.BASE_URL;
export const brand={
 oni:`${base}brand/oni.png`,
 saebomi:`${base}brand/saebomi.png`,
 symbol:`${base}brand/logo-symbol.png`,
 wordmark:`${base}brand/logo-wordmark.png`,
};
let logoImages:Promise<{symbol:HTMLImageElement;wordmark:HTMLImageElement}>|null=null;
function loadImage(src:string){return new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('로고 이미지를 불러오지 못했어요. 다시 시도해주세요.'));image.src=src})}
export function loadBrandLogo(){
 if(!logoImages)logoImages=Promise.all([loadImage(brand.symbol),loadImage(brand.wordmark)]).then(([symbol,wordmark])=>({symbol,wordmark})).catch(e=>{logoImages=null;throw e});
 return logoImages;
}
