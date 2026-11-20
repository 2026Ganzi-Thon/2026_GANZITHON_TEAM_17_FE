const serverItems: Record<string,string> = {
  FILTER_422_001: '금지 표현',
  FILTER_422_002: '전화번호',
  FILTER_422_003: 'SNS ID·링크',
};

/** Server codes take precedence; local guidance never invents a server decision. */
export function contentCheckItems(code?: string, message = ''): string[] {
  if (code && serverItems[code]) return [serverItems[code]];
  const items: string[] = [];
  if (/전화번호/.test(message)) items.push('전화번호');
  if (/SNS|아이디|링크|외부 연락처/i.test(message)) items.push('SNS ID·링크');
  if (/금지|사용할 수 없는 표현|부적절한 표현/.test(message)) items.push('금지 표현');
  return items.length ? items : ['전화번호','SNS ID·링크','금지 표현'];
}
