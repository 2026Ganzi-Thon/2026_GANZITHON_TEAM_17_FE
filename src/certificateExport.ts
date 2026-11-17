/** One raster image on an A4 page; Korean glyphs are embedded in the image. */
export function imagePdf(jpeg:Uint8Array,width:number,height:number):Uint8Array{
 if(!jpeg.length||width<=0||height<=0)throw new Error('잘못된 감사장 이미지예요.');
 const encoder=new TextEncoder();const chunks:Uint8Array[]=[];const offsets=[0];let length=0;
 const append=(value:string|Uint8Array)=>{const bytes=typeof value==='string'?encoder.encode(value):value;chunks.push(bytes);length+=bytes.length};
 const object=(id:number,body:string)=>{offsets[id]=length;append(`${id} 0 obj\n${body}\nendobj\n`)};
 append('%PDF-1.4\n');object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 object(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
 offsets[4]=length;append(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);append(jpeg);append('\nendstream\nendobj\n');
 const scale=Math.min(555.28/width,801.89/height);const w=width*scale,h=height*scale;const content=`q\n${w.toFixed(3)} 0 0 ${h.toFixed(3)} ${((595.28-w)/2).toFixed(3)} ${((841.89-h)/2).toFixed(3)} cm\n/Im0 Do\nQ\n`;
 object(5,`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`);
 const xref=length;append('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)append(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);append(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
 const result=new Uint8Array(length);let position=0;for(const chunk of chunks){result.set(chunk,position);position+=chunk.length}return result;
}
export function saveBlob(blob:Blob,name:string){const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}
