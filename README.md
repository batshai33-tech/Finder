# my-app

React + Vite 프로젝트

## Render에 배포하기

이 저장소는 프론트엔드다. Render에서는 **Static Site**로 배포한다.

### Blueprint로 배포

1. Render 대시보드에서 **New → Blueprint**를 선택한다.
2. `batshai33-tech/Finder` 저장소의 `main` 브랜치를 연결한다.
3. 저장소 루트의 `render.yaml` 설정으로 배포한다.

`main`에 푸시하면 자동으로 다시 빌드한다. `/login`, `/home`, `/items/1` 같은 경로는
`index.html`로 rewrite해서 직접 접속하거나 새로고침해도 React Router가 화면을 표시한다.

### Static Site를 직접 만들거나 기존 설정을 수정할 때

| 항목 | 값 |
| --- | --- |
| Branch | `main` |
| Root Directory | 비워 두기 (저장소 루트) |
| Build Command | `npm ci --include=dev && npm run build` |
| Publish Directory | `dist` |
| Redirects/Rewrites | Source: `/*`, Destination: `/index.html`, Action: **Rewrite** |

Static Site에는 Start Command가 필요 없다. Web Service로 만들어 두었다면 Static Site로 새로 만든다.
배포 후 Render가 제공하는 `https://…onrender.com` 주소로 접속한다.

### 백엔드 연결

배포된 페이지의 `localhost`는 **방문자의 컴퓨터**를 가리킨다.
개발자 컴퓨터에서 실행 중인 Spring Boot에 다른 방문자가 접속할 수 없으므로,
로그인과 회원가입을 사용하려면 백엔드도 공개 HTTPS 주소로 배포해야 한다.

Render의 해당 Static Site → **Environment**에 다음 값을 추가하고 다시 빌드·배포한다.

| 환경 변수 | 값 |
| --- | --- |
| `VITE_API_BASE_URL` | 실제 백엔드의 HTTPS 주소 (`/api` 없이 입력) |
| `VITE_USE_MOCK_API` | 실제 물품 API를 사용하려면 `false` |

예를 들어 백엔드 주소가 `https://your-backend.onrender.com`이면
로그인 요청은 `https://your-backend.onrender.com/api/auth/login`으로 전송된다.
백엔드의 CORS 허용 출처에도 프론트엔드의 Render 주소를 등록해야 한다.

- `VITE_*` 값은 빌드할 때 적용되므로, 값을 변경한 뒤에는 다시 빌드·배포한다.
- 배포 환경에서는 API 주소가 없을 때 `localhost`로 요청하지 않고 연결 오류를 표시한다.
- `VITE_USE_MOCK_API`의 기본값은 `true`다. 이때 물품 데이터는 브라우저에만 저장되고 다른 방문자와 공유되지 않는다.
- 예시 물품 모드에서도 로그인·회원가입에는 실제 백엔드가 필요하다. 백엔드 없이 화면을 보려면 `/home`으로 접속한다.

관련 문서: [Render Blueprint](https://render.com/docs/blueprint-spec),
[Render Rewrite](https://render.com/docs/redirects-rewrites),
[Vite 환경 변수](https://vite.dev/guide/env-and-mode).

## 시작하기

```bash
cp .env.example .env.local
npm ci
npm run dev
```

로컬에서는 `.env.local`의 백엔드 주소를 사용한다. 환경 변수를 바꾸면 개발 서버를 다시 시작한다.

## 폴더 구조

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Button.jsx
│   │   └── Input.jsx
│   └── item/
│       ├── ItemCard.jsx
│       ├── ItemList.jsx
│       └── SearchBar.jsx
├── pages/
│   ├── Auth/
│   │   └── Login.jsx
│   ├── Home/
│   │   └── Home.jsx
│   ├── Items/
│   │   └── ItemCreatePage.jsx
│   └── MyPage/
│       └── MyPage.jsx
├── App.jsx
├── main.jsx
├── App.css
└── index.css
```

## 추가된 패키지

- `react-router-dom` - 페이지 라우팅
- `axios` - API 통신
