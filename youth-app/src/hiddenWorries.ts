type Store=Pick<Storage,'getItem'|'setItem'>;

export function hiddenWorryIds(userKey:string,storage:Store=localStorage):number[]{
 try{
  const value:unknown=JSON.parse(storage.getItem(userKey+'-hidden')||'[]');
  return Array.isArray(value)?value.filter((id):id is number=>typeof id==='number'&&Number.isSafeInteger(id)&&id>0):[];
 }catch{return []}
}

/** Hiding is an explicit, device-local choice, independent of reporting. */
export function hideWorry(userKey:string,id:number,storage:Store=localStorage){
 const ids=new Set(hiddenWorryIds(userKey,storage));
 ids.add(id);
 storage.setItem(userKey+'-hidden',JSON.stringify([...ids]));
}
