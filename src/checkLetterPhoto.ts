import {assessPhotoPixels,type PhotoQuality} from './photoQuality';
/** Only a temporary analysis canvas is resized. The uploaded file remains the original. */
export async function checkLetterPhoto(file:File):Promise<PhotoQuality>{
 const url=URL.createObjectURL(file);
 try{
  const image=await new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('사진을 열 수 없어요.'));image.src=url});
  if(image.naturalWidth<3||image.naturalHeight<3)throw new Error('사진 크기를 확인할 수 없어요.');
  const scale=Math.min(1,512/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(3,Math.round(image.naturalWidth*scale));canvas.height=Math.max(3,Math.round(image.naturalHeight*scale));
  const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw new Error('사진 자동 확인을 사용할 수 없어요.');
  ctx.drawImage(image,0,0,canvas.width,canvas.height);
  return assessPhotoPixels(ctx.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height);
 }finally{URL.revokeObjectURL(url)}
}
