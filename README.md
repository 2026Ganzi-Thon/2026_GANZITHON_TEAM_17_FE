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
- 홈 요약, 받은 마음(고마움·후일담), 서버 내 답장 목록·반응 표시
- 조건에 따른 답장 수정·삭제, 고민 신고 및 숨김
- 알림 목록·읽음 처리와 대상 화면 이동
- 프로필 전용 닉네임 수정 화면
- 보라·피치 그라디언트 모바일 UI (캐릭터·로고는 임시 SVG)

## 미완료 및 연동 대기

다른 기기에서 보낸 답장의 본문 조회 API가 없어 해당 본문의 읽기·수정은 제한됩니다. 현재 기기에 본문이 있고 고마움·후일담을 받지 않은 글·음성 답장은 수정할 수 있으며, 서버가 최종 권한을 판단합니다.

서버 STT는 미제공이므로 브라우저 음성 인식을 사용합니다. HTTPS 또는 localhost와 마이크 권한이 필요합니다. 청년 화면은 팀원 구현과 연결이 필요합니다. 캐릭터(양 온이·새 새봄이)와 털 단계 이미지는 임시 코드 그림이며 최종 디자인 검수가 남아 있습니다.

감사장은 동일한 Canvas 그림을 화면·PNG·PDF에 사용하며 직접 다운로드합니다. 테스트 17개, TypeScript/Vite 빌드, PDF strict 파싱·페이지 렌더링을 확인했습니다. 실제 서버 통신·모바일 마이크/카메라·다운로드 검증은 미완료입니다. 운영 서버에 쓰기 테스트는 수행하지 않았습니다.

텍스트 크기 설정, 읽어주기, 손편지 OCR은 현재 범위에서 제외합니다.

## 파일 구조

- `src/main.tsx`: 가입, 홈, 목록, 프로필
- `src/SeniorFlow.tsx`: 상세·답장 작성
- `src/api.ts`: API 요청·사용자 헤더·오류 처리
- `src/WoolRecord.tsx`, `src/Certificates.tsx`: 털 기록·감사장
- `src/SentReplies.tsx`, `src/replyReceipts.ts`: 서버 답장 목록·수정·삭제 및 기기 본문 보관
- `src/Notifications.tsx`, `src/ReceivedHearts.tsx`: 알림·받은 마음
- `src/CertificateArt.tsx`, `src/certificateExport.ts`: 공통 감사장 그림·파일 저장
- `tests/`: API·정책·전송 기록·PDF·음성 처리 테스트

## GitHub Pages 배포

`main`에 푸시하면 GitHub Actions가 테스트·빌드 후 Pages에 자동 배포합니다.
배포 주소: https://2026Ganzi-Thon.github.io/2026_GANZITHON_TEAM_17_FE/

Pages 빌드는 `npm run build -- --mode github-pages`를 사용하며 저장소 하위 경로를 적용합니다.
백엔드 주소는 워크플로의 공개 환경변수로 지정합니다. 로컬 개발과 기본 빌드는 `/` 경로를 유지합니다.

## Firebase 및 원본 캐릭터

공개 주소: https://hanol-ganzi-team17.web.app
`firebase.json`과 `.firebaserc`는 Firebase Hosting 배포 설정입니다. `npm run build` 후 `npx firebase-tools deploy --only hosting`으로 배포합니다.

온이·새봄이는 제공받은 원본 투명 PNG를 `public/brand/`에서 사용합니다. 역할 선택·가입·프로필·빈 목록에 공통 Mascot 컴포넌트를 적용합니다. 파비콘은 로고 시안을 참고한 SVG입니다.
