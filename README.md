# Todo App (Next.js + FastAPI)

Next.js App Router와 FastAPI를 분리한 구조로 Todo 앱을 마이그레이션하기 위한 프로젝트입니다.  
프론트엔드는 화면과 사용자 인터랙션을 담당하고, 백엔드는 Todo 데이터를 관리하는 역할로 나눕니다.

---

## 3차 과제 기능 분리 정리

### 프론트엔드(Next.js)
- Todo 목록, 생성, 수정, 삭제 화면 렌더링
- `/todos`, `/todos/new`, `/todos/[todoId]` 페이지 구성
- Server Actions 또는 API Route를 통한 데이터 요청
- 로딩, 에러, 빈 상태 UI 처리
- 입력 폼과 버튼 클릭 이벤트 처리
- 화면 이동과 라우팅 처리

### 백엔드(FastAPI)
- Todo 데이터 저장, 조회, 수정, 삭제 API 제공
- 요청 데이터 검증
- 프론트엔드에서 전달한 CRUD 요청 처리
- 서버 상태 관리와 응답 포맷 구성

### 2차 과제에서 역할이 바뀌는 부분
- `localStorage` 저장/복원 -> FastAPI 서버 저장/조회
- 프론트 상태 관리 중심 CRUD -> 서버 요청 기반 CRUD
- 날짜/필터 화면 렌더링 -> 프론트 유지
- 데이터 영속성 책임 -> 백엔드로 이동

---

## 프로젝트 구조

```markdown
kakao-assignment-3/
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   └── todos/
│   │   │       └── route.ts
│   │   ├── todos/
│   │   │   ├── [todoId]/
│   │   │   │   └── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── actions.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── .env.local
│   ├── .gitignore
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── postcss.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── backend/
    ├── main.py
    ├── requirements.txt
    └── .env.local
```

---

## 0. 전체 구조 잡기

### 구현한 부분
- **프로젝트 루트 분리**
  - `frontend/`와 `backend/` 디렉토리를 분리하여 역할이 섞이지 않도록 구성
- **Next.js App Router 구조 생성**
  - `app/` 디렉토리 기반으로 페이지와 라우트를 나눌 수 있도록 기본 파일을 생성
- **FastAPI 단일 엔트리 구성**
  - 이번 과제 범위에서는 `main.py` 하나에 API, 라우터, 데이터 로직을 담을 수 있게 기본 파일을 생성
- **과제 기능 분리 정리**
  - 2차 과제에서 하던 기능을 프론트엔드와 백엔드로 어떻게 나눌지 정리

### 알게된 부분
- **프론트와 백엔드가 분리되면 책임 경계가 명확해진다**
  - 화면 렌더링과 데이터 저장 책임이 분리되어 구조를 이해하기 쉬워진다.
- **초기 구조를 먼저 잡아두면 이후 구현이 편하다**
  - 파일 구조와 역할을 먼저 정리해두면, 다음 단계에서 기능을 넣을 때 기준이 명확해진다.

### AI 활용 내역
- **AI 활용 내용 :**
  Next.js와 FastAPI를 완전히 분리하는 디렉토리 구조와, 각 폴더에 어떤 파일이 들어가야 하는지 기본 뼈대를 참고했습니다.
- **직접 수정한 부분 :**
  2차 과제의 기능을 프론트와 백엔드로 나누는 기준을 직접 정리하고, 프로젝트 구조를 과제 요구사항에 맞게 구성했습니다.