# 털 한 올 — Frontend

청년과 인생 선배가 마음을 나누는 서비스의 공통 가입 및 어르신 화면입니다.
React 19 · TypeScript · Vite.

## 실행

```sh
npm ci
cp .env.example .env.local
npm run dev
```

터미널에 표시되는 로컬 주소를 엽니다. API 주소는 `.env.local`의 `VITE_API_BASE_URL`로 관리합니다. 가입하면 실제 서버 사용자가 생성되며, 사용자 ID는 현재 브라우저에 보관됩니다.

## 확인

```sh
npm test
npm run build
```

## 구현 범위

- 역할 선택, 닉네임 추천·가입·수정, 나이대 설정, 재접속 사용자 조회
- 어르신 고민 목록·상세, 글 답장 등록, 손편지 원본 업로드·등록
- 브라우저 음성 인식, 제재 안내 및 중복 전송 방지
- 내 털 기록, 감사장 목록·상세 및 PNG/PDF 저장
- 현재 기기에서 전송이 확인된 답장 기록과 서버 삭제
- 보라·피치 그라디언트 모바일 UI (캐릭터·로고는 임시 SVG)

## 미완료 및 연동 대기

제공된 OpenAPI에 없는 홈 요약, 전체 보낸 답장 목록·수정, 받은 마음, 고민 신고, STT는 연결 대기입니다. 신고는 서버 사용자에게 비활성화됩니다. 내 답장은 전체 서버 목록이 아닌 현재 기기 전송 기록입니다. 감사장 문구는 임시이며 목록 응답 스키마 확인이 필요합니다. 실제 서버 통신·모바일 브라우저·PNG/PDF 시각 검증은 미완료입니다.

텍스트 크기 설정, 읽어주기, 손편지 OCR은 현재 범위에서 제외합니다.

## 파일 구조

- `src/main.tsx`: 가입, 홈, 목록, 프로필
- `src/SeniorFlow.tsx`: 상세·답장 작성
- `src/api.ts`: API 요청·사용자 헤더·오류 처리
- `src/WoolRecord.tsx`, `src/Certificates.tsx`: 털 기록·감사장
- `src/SentReplies.tsx`, `src/replyReceipts.ts`: 전송 확인 기록·삭제
- `tests/`: API·정책·전송 기록 테스트
