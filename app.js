// Todo 앱 - Vanilla JS CRUD
// - 상태(todos)를 기반으로 화면을 매번 렌더링

// --- DOM 참조 ---
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const helperText = document.getElementById("helperText");
const counterText = document.getElementById("counterText");
const todoList = document.getElementById("todoList");

// --- 앱 상태 ---
let todos = [];

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
    const totalCount = todos.length;
    const completedCount = todos.filter((todo) => todo.isCompleted).length;
    const activeCount = totalCount - completedCount;

    counterText.textContent = `전체 ${totalCount} · 진행 ${activeCount} · 완료 ${completedCount}`;
}

// --- 렌더링 ---
function renderTodoList() {
    // 상태(todos)를 기반으로 목록을 다시 그린다.
    todoList.innerHTML = todos
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
    };

    todos = [newTodo, ...todos];
    setHelperMessage("추가했어요.");
    renderTodoList();

    // UX: 입력창 비우고 focus 유지
    todoInput.value = "";
    todoInput.focus();
}

function deleteTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId);
    setHelperMessage("삭제했어요.");
    renderTodoList();
}

function toggleTodoCompleted(todoId) {
    todos = todos.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
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

    setHelperMessage("수정했어요.");
    renderTodoList();
}

// --- 이벤트 바인딩 ---
function handleTodoFormSubmit(event) {
    event.preventDefault();
    addTodo(todoInput.value);
}

todoForm.addEventListener("submit", handleTodoFormSubmit);

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

// 초기 렌더
renderTodoList();
setHelperMessage("할 일을 추가해 보세요.");