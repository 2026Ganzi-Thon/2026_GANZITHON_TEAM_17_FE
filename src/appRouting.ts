/** Server-backed youth sessions enter the supplied YouthApp after onboarding. */
export function shouldOpenYouth(role:string|undefined,screen:string,userId:string|null){
 return role==='young'&&Boolean(userId?.trim())&&!['start','role','onboarding'].includes(screen);
}
