# Todo App (Vanilla JS)

HTML / CSS / Vanilla JS만 사용한 미니멀 Todo 웹 앱입니다.  
메인 컬러는 `#672be0`이며, 상태 기반 렌더링으로 기본 CRUD를 제공합니다.

---

## 2주차. 첫 번째 커밋

### 구현한 부분
- **Vanilla JS 앱을 React로 마이그레이션**
  - `app.js`에서 처리하던 렌더링/상태 갱신 로직을 React 컴포넌트 구조로 옮김
  - `App`을 기준으로 화면을 다시 구성하고, `src/components/` 아래로 역할별 컴포넌트를 분리함
- **컴포넌트 단위 UI 분리**
  - 입력 영역, 주간 날짜 영역, Todo 목록을 각각 분리해 props로 연결
  - `TodoForm`, `WeekDayButton`, `TodoList`, `TodoItem`으로 UI 책임을 나눠 유지보수성을 높임
- **상태(state) 기반 렌더링 유지**
  - `todos`, `selectedDateKey`, `currentWeekStartKey`, `currentFilter`, `isEditing`을 React state로 관리
  - 추가/수정/삭제/토글/필터 변경 시 화면이 자동으로 갱신되도록 구성
- **인라인 수정 UI 구현**
  - `prompt()`를 제거하고, 수정 버튼 클릭 시 해당 Todo가 인라인 input으로 전환되도록 구성
  - 저장/취소 버튼으로 수정 흐름을 제어하고, `isEditing` 상태로 화면이 자동 전환되도록 구현
- **localStorage 연동 이관**
  - 기존 저장/복원 로직을 React의 초기 state와 `useEffect` 기반 저장으로 옮김
  - 새로고침 후에도 Todo 데이터가 유지되도록 구성
- **기존 기능의 동작 유지**
  - Todo 생성/수정/삭제/완료 토글, 날짜 선택, 주간 이동, 상태 필터, 카운터, 빈 상태 메시지를 동일하게 유지
- **Tailwind v4 적용 준비**
  - React/Vite 환경에서 동작할 수 있도록 `src/index.css`에 Tailwind v4 import를 포함하고, 기존 스타일을 옮김

### 알게된 부분
- **Vanilla JS와 React의 렌더링 방식 차이**
  - 직접 DOM을 찾고 `innerHTML`을 갱신하는 방식보다, 상태가 바뀌면 화면이 다시 그려지는 React 방식이 구조적으로 분리하기 좋았다.
- **props와 state의 역할 분리**
  - 공통 상태는 상위 컴포넌트에서 관리하고, 하위 컴포넌트는 필요한 값과 이벤트만 props로 받는 구조가 더 명확했다.
- **`prompt()` 대신 인라인 편집이 더 React스럽다**
  - 단일 상태 값(`isEditing`)만 바꿔도 수정 UI가 자동으로 전환되므로, 모달/팝업보다 흐름이 예측 가능했다.
- **마이그레이션은 기능 복사보다 구조 재설계에 가깝다**
  - 기존 기능을 그대로 옮기되, 렌더링 책임과 상태 책임을 컴포넌트 단위로 다시 나누는 과정이 핵심이었다.

### AI의 도움을 받은 부분
- React/Vite 프로젝트의 **기본 진입점 구조(src/main.jsx, App.jsx)** 정리
- Vanilla JS의 렌더링 로직을 React의 **state / props / 컴포넌트 분리 구조**로 옮기는 방식 참고
- `prompt()`를 대체하는 **인라인 수정 UI와 isEditing 상태 흐름** 정리 참고
- `localStorage`를 React에서 다루는 **초기값 로딩 + useEffect 저장 패턴** 정리 참고
- (주의) 기능의 동작 방식은 원본 코드를 직접 확인하며 옮겼고, 컴포넌트 분리와 파일 구조 정리에 AI를 활용함

---

## 2주차. 두 번째 커밋

### 구현한 부분
- **상태별 필터링 기능을 React로 마이그레이션**
  - `전체 / 진행 중 / 완료` 탭을 React state(`currentFilter`)로 관리하도록 구성
  - 필터 상태만 바꾸면 `TodoList`가 자동으로 다시 렌더링되도록 구현
- **필터 탭 활성화 UI 구현**
  - 현재 선택된 탭에 `.is-active` 클래스를 적용해 시각적으로 구분
  - `aria-pressed`를 함께 갱신해 접근성도 고려함
- **필터 유지 동작**
  - 탭 전환 후 새 Todo를 추가해도 현재 필터가 유지되도록 상태를 분리함
  - 날짜 필터와 상태 필터를 함께 적용해, 선택된 날짜 안에서만 상태별로 볼 수 있게 구성

### 알게된 부분
- **React에서는 DOM을 직접 숨기고 보여주는 대신 상태만 바꾸면 된다**
  - `querySelectorAll`로 요소를 조작하지 않아도, `currentFilter`가 바뀌면 목록이 자동으로 다시 그려졌다.
- **표시 조건은 상태에서 계산하는 것이 더 자연스럽다**
  - 원본 `todos`를 건드리지 않고, 렌더링 단계에서 `visibleTodos`를 계산하는 방식이 예측 가능했다.
- **UI 상태도 데이터처럼 관리해야 한다**
  - 현재 어떤 탭을 보는지 자체가 화면의 중요한 상태라서, 추가/수정/삭제와 함께 유지되어야 했다.

### AI의 도움을 받은 부분
- Vanilla JS의 `querySelectorAll` 기반 필터링을 React의 **state 기반 필터링**으로 옮기는 구조 참고
- 필터 탭의 활성화 표시와 `aria-pressed` 갱신 방식 참고
- 날짜 필터와 상태 필터를 함께 적용하는 순서 정리 참고
