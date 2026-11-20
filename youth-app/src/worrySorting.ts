export type WorrySort = 'latest' | 'oldest' | 'topic';
/** Sort a copy so switching views never changes the stored feed. */
export function sortWorries<T extends {tag:string;date:string}>(items:readonly T[], order:WorrySort, topics:readonly string[]):T[]{
 const ranks=new Map(topics.map((tag,index)=>[tag,index]));
 return [...items].sort((a,b)=>{
  if(order==='topic'){
   const topic=(ranks.get(a.tag)??topics.length)-(ranks.get(b.tag)??topics.length);
   if(topic)return topic;
  }
  return order==='oldest'?a.date.localeCompare(b.date):b.date.localeCompare(a.date);
 });
}
