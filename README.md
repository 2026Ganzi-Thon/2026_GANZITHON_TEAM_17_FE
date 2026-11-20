# 한 올 · 청년–어르신 조언 플랫폼

공식 저장소: https://github.com/2026Ganzi-Thon/2026_GANZITHON_TEAM_17_FE

배포 서비스: https://hanol-ganzi-team17.web.app

React 19, TypeScript, Vite 6 기반 모바일 웹입니다. 공통 역할 선택·가입과 어르신 화면, 청년 화면을 통합합니다. 청년 화면은 스타일 충돌을 피하도록 Shadow DOM에서 실행하며 서버 사용자 ID를 공유합니다.

## 실행

Node.js 22를 기준으로 합니다.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

`VITE_API_BASE_URL`은 배포된 API 서버 주소입니다. `.env.local` 등 실제 환경 설정과 인증 파일은 커밋하지 않습니다.

```sh
npm test
npm run build
```

청년 단독 시연은 `youth-app` 폴더에서 `npm ci` 및 `npm run dev`로 실행합니다. 상위 폴더의 공통 환경변수를 읽습니다.

## 구성

- `src/`: 공통 가입·어르신 화면, 청년 호스트, 공통 메뉴·정렬·이미지 경로 처리
- `youth-app/src/`: 청년 홈·고민·답장·프로필·알림
- `public/`: 제공받은 원본 이미지, 파비콘, 글꼴과 라이선스
- `tests/`: API 계약과 주요 데이터·이미지·메뉴 위치 회귀 테스트
- `docs/design-feedback-status.md`: 피드백 반영 범위와 검증 한계

가입 후 기기에 저장된 UUID를 `X-User-Id`로 전달합니다. 초기화 버튼은 활성 ID를 지우고 역할 선택으로 돌아가며 서버 기록은 삭제하지 않습니다. 실제 알림이 없으면 빈 목록을 표시합니다.

## 배포

Firebase Hosting 설정은 `firebase.json`, 대상 프로젝트는 `.firebaserc`에 있습니다. 인증된 환경에서 실행합니다.

```sh
npx firebase-tools deploy --only hosting --project hanol-ganzi-team17
```

배포 전에 소스·빌드·필수 이미지를 검사합니다. Firebase 인증 정보는 저장소에 넣지 않습니다.

GitHub Pages는 `main`에 푸시하면 기존 Actions로 빌드·배포합니다. 로컬 확인은 `npm run build -- --mode github-pages`로 가능합니다.

## 검증 범위

단위 테스트와 통합·청년 단독 빌드를 확인했습니다. 실제 휴대폰의 카메라·마이크, 손편지 전송 및 전체 화면의 시각 비교는 추가 확인이 필요합니다. 세부 내용은 피드백 문서에 기록합니다.

어르신 원본 답장 재조회에 필요한 서버 변경과 적용 방법은 [백엔드 적용 안내](docs/backend/senior-reply-detail.md)를 확인하세요.
