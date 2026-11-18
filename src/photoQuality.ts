export type PhotoQuality={warning:'dark'|'low-detail'|null};
/** Conservative local hints, not an OCR result or a guarantee that a letter is readable. */
export function assessPhotoPixels(data:Uint8ClampedArray,width:number,height:number):PhotoQuality{
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<3||height<3||data.length!==width*height*4)throw new Error('사진 크기를 확인할 수 없어요.');
 const gray=new Float32Array(width*height);let total=0,dark=0;
 for(let i=0;i<gray.length;i++){const j=i*4,alpha=data[j+3]/255;const value=(data[j]*.2126+data[j+1]*.7152+data[j+2]*.0722)*alpha+255*(1-alpha);gray[i]=value;total+=value;if(value<50)dark++}
 if(total/gray.length<40&&dark/gray.length>.75)return {warning:'dark'};
 let lapSum=0,lapSquares=0,count=0;
 for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){const i=y*width+x;const lap=gray[i-1]+gray[i+1]+gray[i-width]+gray[i+width]-4*gray[i];lapSum+=lap;lapSquares+=lap*lap;count++}
 const variance=lapSquares/count-(lapSum/count)**2;
 return {warning:variance<12?'low-detail':null};
}
