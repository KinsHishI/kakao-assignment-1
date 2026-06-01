// Todo 앱 - Vanilla JS CRUD
// - 상태(todos)를 기반으로 화면을 매번 렌더링

// --- DOM 참조 ---
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const helperText = document.getElementById("helperText");
const counterText = document.getElementById("counterText");
const todoList = document.getElementById("todoList");

const STORAGE_KEY = "kakao-assignment.todos.v1";

function saveTodosToStorage() {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.warn("Failed to save todos to localStorage", error);
    }
}

function loadTodosFromStorage() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed
            .filter((item) => item && typeof item === "object")
            .map((item) => ({
                id: String(item.id ?? createTodoId()),
                text: String(item.text ?? ""),
                isCompleted: Boolean(item.isCompleted),
                createdAt: Number(item.createdAt ?? Date.now()),
                dateKey:
                    typeof item.dateKey === "string" ? item.dateKey : selectedDateKey,
            }))
            .filter((todo) => todo.text.trim().length > 0);
    } catch (error) {
        console.warn("Failed to load todos from localStorage", error);
        return [];
    }
}

// 상태 필터 탭 컨테이너(2번 요구사항)
const filterTabContainer = document.querySelector(".filters");

// 일간 뷰(3번 요구사항) DOM 참조
const currentDateText = document.getElementById("currentDateText");
const prevDayBtn = document.getElementById("prevDayBtn");
const nextDayBtn = document.getElementById("nextDayBtn");

// --- 앱 상태 ---
let todos = [];

// 일간 뷰에서 현재 선택된 날짜(로컬 기준)를 YYYY-MM-DD 형태로 관리
let selectedDateKey = formatDateKey(new Date());

// 현재 선택된 필터(탭 전환 후 새 Todo를 추가해도 유지되도록 상태로 관리)
// - all: 전체
// - active: 진행 중
// - completed: 완료
let currentFilter = "all";

// --- 유틸 ---
function createTodoId() {
    // 충돌 가능성이 낮은 간단한 ID 생성(라이브러리 없이 구현)
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function setHelperMessage(message, type = "info") {
    // 안내 메시지 출력
    helperText.textContent = message;
    helperText.classList.toggle("is-error", type === "error");
}

function normalizeTodoText(rawText) {
    // 앞뒤 공백 제거 + 여러 공백을 단일 공백으로 축소
    return rawText.trim().replace(/\s+/g, " ");
}

function updateCounter() {
    // 카운터는 전체 상태 기준으로 표시(필터와 무관)
    const totalCount = todos.length;
    const completedCount = todos.filter((todo) => todo.isCompleted).length;
    const activeCount = totalCount - completedCount;

    counterText.textContent = `전체 ${totalCount} · 진행 ${activeCount} · 완료 ${completedCount}`;
}

function formatDateKey(date) {
    // 로컬 기준 'YYYY-MM-DD'
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function addDaysToDateKey(dateKey, diff) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + diff);
    return formatDateKey(date);
}

function renderSelectedDate() {
    if (!currentDateText) return;

    // 표시용 포맷(간단): YYYY.MM.DD
    currentDateText.textContent = selectedDateKey.replaceAll("-", ".");
}

function getDayTodos() {
    // 선택된 날짜의 Todo만 추린다.
    // (이 변경은 3번 요구사항 때문에 필요: 기존 getFilteredTodos가 '전체 todos' 기준이라 날짜 조건을 먼저 적용해야 함)
    return todos.filter((todo) => (todo.dateKey || "") === selectedDateKey);
}

function getFilteredTodos() {
    // currentFilter에 따라 화면에 보여줄 목록만 골라낸다.
    // (3번 요구사항 추가) 먼저 날짜 필터링을 적용한 뒤, 상태 필터를 적용한다.
    const dayTodos = getDayTodos();

    if (currentFilter === "active") {
        return dayTodos.filter((todo) => !todo.isCompleted);
    }

    if (currentFilter === "completed") {
        return dayTodos.filter((todo) => todo.isCompleted);
    }

    return dayTodos;
}

function setActiveFilterTab(nextFilter) {
    // 필터 상태 변경 + 탭 스타일(활성) 갱신
    currentFilter = nextFilter;

    if (!filterTabContainer) return;

    const tabs = filterTabContainer.querySelectorAll("button[data-filter]");
    tabs.forEach((tab) => {
        const isActive = tab.dataset.filter === currentFilter;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-pressed", String(isActive));
    });
}

// --- 렌더링 ---
function renderTodoList() {
    // 상태(todos) + 필터(currentFilter)를 기반으로 목록을 다시 그린다.
    const visibleTodos = getFilteredTodos();

    todoList.innerHTML = visibleTodos
        .map((todo) => {
            const completedClass = todo.isCompleted ? "is-completed" : "";

            return `
        <li class="todo-item ${completedClass}" data-todo-id="${todo.id}">
          <p class="todo-text">${escapeHtml(todo.text)}</p>
          <div class="actions" aria-label="할 일 작업">
            <button class="btn" data-action="edit" type="button">수정</button>
            <button class="btn btn-success" data-action="toggle" type="button">
              ${todo.isCompleted ? "되돌리기" : "완료"}
            </button>
            <button class="btn btn-danger" data-action="delete" type="button">삭제</button>
          </div>
        </li>
      `;
        })
        .join("");

    updateCounter();
}

function escapeHtml(text) {
    // 사용자 입력을 HTML로 주입할 때 XSS를 막기 위한 최소 이스케이프
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// --- CRUD ---
function addTodo(rawText) {
    const text = normalizeTodoText(rawText);

    // 입력값이 비어있으면 생성하지 않고 안내 메시지 표시
    if (!text) {
        setHelperMessage("할 일을 입력해 주세요.", "error");
        return;
    }

    const newTodo = {
        id: createTodoId(),
        text,
        isCompleted: false,
        createdAt: Date.now(),
        // 3번 요구사항: 생성 시점에 '현재 선택된 날짜'를 저장
        dateKey: selectedDateKey,
    };

    todos = [newTodo, ...todos];

    saveTodosToStorage();

    setHelperMessage("추가했어요.");

    // 현재 필터 상태를 유지한 채로 목록 갱신
    renderTodoList();

    // UX: 입력창 비우고 focus 유지
    todoInput.value = "";
    todoInput.focus();
}

function deleteTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId);

    saveTodosToStorage();

    setHelperMessage("삭제했어요.");
    renderTodoList();
}

function toggleTodoCompleted(todoId) {
    todos = todos.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );

    saveTodosToStorage();

    setHelperMessage("상태를 변경했어요.");
    renderTodoList();
}

function editTodoText(todoId) {
    const targetTodo = todos.find((todo) => todo.id === todoId);
    if (!targetTodo) return;

    // 기본 prompt로 수정 UI 제공
    const editedRawText = window.prompt("할 일을 수정하세요.", targetTodo.text);
    if (editedRawText === null) return; // 취소

    const editedText = normalizeTodoText(editedRawText);
    if (!editedText) {
        setHelperMessage("수정 값이 비어있어서 변경하지 않았어요.", "error");
        return;
    }

    todos = todos.map((todo) =>
        todo.id === todoId ? { ...todo, text: editedText } : todo
    );

    saveTodosToStorage();

    setHelperMessage("수정했어요.");
    renderTodoList();
}

// --- 이벤트 바인딩 ---
function handleTodoFormSubmit(event) {
    event.preventDefault();
    addTodo(todoInput.value);
}

todoForm.addEventListener("submit", handleTodoFormSubmit);

// 상태 필터 탭 클릭 처리(이벤트 위임)
if (filterTabContainer) {
    filterTabContainer.addEventListener("click", (event) => {
        const tabButton = event.target.closest("button[data-filter]");
        if (!tabButton) return;

        const nextFilter = tabButton.dataset.filter;
        setActiveFilterTab(nextFilter);
        renderTodoList();
    });
}

// 일간 뷰: 이전/다음 날짜 이동
if (prevDayBtn) {
    prevDayBtn.addEventListener("click", () => {
        selectedDateKey = addDaysToDateKey(selectedDateKey, -1);
        renderSelectedDate();
        renderTodoList();
    });
}

if (nextDayBtn) {
    nextDayBtn.addEventListener("click", () => {
        selectedDateKey = addDaysToDateKey(selectedDateKey, 1);
        renderSelectedDate();
        renderTodoList();
    });
}

// 버튼이 동적으로 생성되므로, 목록(ul)에 이벤트를 위임한다.
todoList.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) return;

    const todoItem = actionButton.closest("li[data-todo-id]");
    if (!todoItem) return;

    const todoId = todoItem.dataset.todoId;
    const action = actionButton.dataset.action;

    if (action === "delete") {
        deleteTodo(todoId);
        return;
    }

    if (action === "toggle") {
        toggleTodoCompleted(todoId);
        return;
    }

    if (action === "edit") {
        editTodoText(todoId);
    }
});

todos = loadTodosFromStorage();

setActiveFilterTab(currentFilter);
renderSelectedDate();
renderTodoList();
setHelperMessage("할 일을 추가해 보세요.");
