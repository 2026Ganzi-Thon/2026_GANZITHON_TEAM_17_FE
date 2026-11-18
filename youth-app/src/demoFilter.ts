import bannedSource from './banned-words.txt?raw';
import crisisSource from './crisis-keywords.txt?raw';

function keywords(source: string) {
  return source.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#'));
}

const bannedWords = keywords(bannedSource);
export function demoNicknameBlocked(value: string) {
  return bannedWords.some(word => value.normalize('NFKC').includes(word));
}
const crisisWords = keywords(crisisSource);
const phone = /(?<!\d)(?:0|(?:\+|00)82[\s.-]*0?)(?:1[016789]|70|50[2-8]?|2|[3-6][1-5])[\s()./-]*\d{3,4}[\s()./-]*\d{4}(?!\d)/u;
const externalContact = /(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|kr|io|me|app|link|dev|site)\b|(?:카카오톡|카톡|오픈채팅|인스타그램)\s*(?:아이디|id\b|링크|계정|주소)/iu;

export function demoWorryWarning(title: string, content: string) {
  // 검사용 사본만 정규화하고, 작성한 원문은 그대로 둬요.
  for (const value of [title, content]) {
    const text = value.normalize('NFKC');
    if (bannedWords.some(word => text.includes(word))) return '사용할 수 없는 표현이 포함되어 있어요.';
    if (phone.test(text)) return '전화번호는 적을 수 없어요.';
    if (externalContact.test(text)) return '링크나 외부 연락처는 적을 수 없어요.';
  }
  return '';
}

export function demoCrisisDetected(content: string) {
  const compact = content.normalize('NFKC').replace(/[\p{P}\p{Z}\s]/gu, '');
  return crisisWords.some(word => {
    const key = word.replace(/\s/g, '');
    const index = compact.indexOf(key);
    return index !== -1 && !compact.slice(index + key.length).startsWith('지않');
  });
}
