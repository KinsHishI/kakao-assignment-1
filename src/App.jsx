import { useEffect, useMemo, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import WeekDayButton from './components/WeekDayButton';
import {
  createTodoId,
  addDaysToDateKey,
  formatDateKey,
  formatWeekRange,
  getWeekDates,
  getWeekStartDateKey,
  normalizeTodoText,
} from './todoUtils';

const STORAGE_KEY = 'kakao-assignment.todos.v1';

function loadTodosFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: String(item.id ?? createTodoId()),
        text: String(item.text ?? ''),
        isCompleted: Boolean(item.isCompleted),
        createdAt: Number(item.createdAt ?? Date.now()),
        dateKey: typeof item.dateKey === 'string' ? item.dateKey : formatDateKey(new Date()),
      }))
      .filter((todo) => todo.text.trim().length > 0);
  } catch {
    return [];
  }
}

export default function App() {
  const [todos, setTodos] = useState(() => loadTodosFromStorage());
  const [helper, setHelper] = useState({ message: '할 일을 추가해 보세요.', type: 'info' });
  const [selectedDateKey, setSelectedDateKey] = useState(() => formatDateKey(new Date()));
  const [currentWeekStartKey, setCurrentWeekStartKey] = useState(() => getWeekStartDateKey(new Date()));
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // 저장 실패는 UI 흐름을 끊지 않는다.
    }
  }, [todos]);

  const weekDates = useMemo(() => getWeekDates(currentWeekStartKey), [currentWeekStartKey]);
  const todayKey = useMemo(() => formatDateKey(new Date()), []);

  const dayTodos = useMemo(
    () => todos.filter((todo) => (todo.dateKey || '') === selectedDateKey),
    [todos, selectedDateKey]
  );

  const visibleTodos = useMemo(() => {
    if (currentFilter === 'active') return dayTodos.filter((todo) => !todo.isCompleted);
    if (currentFilter === 'completed') return dayTodos.filter((todo) => todo.isCompleted);
    return dayTodos;
  }, [dayTodos, currentFilter]);

  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const activeCount = totalCount - completedCount;

  const weekTodoCountByDate = useMemo(() => {
    return new Map(
      weekDates.map((dateKey) => [
        dateKey,
        todos.filter((todo) => (todo.dateKey || '') === dateKey).length,
      ])
    );
  }, [todos, weekDates]);

  const emptyMessage =
    currentFilter === 'completed'
      ? '아직 완료한 할 일이 없어요. 완료한 Todo가 생기면 여기에 표시돼요.'
      : currentFilter === 'active'
        ? '아직 진행 중인 할 일이 없어요. 새 Todo를 추가해 보세요.'
        : '아직 할 일이 없어요. 새로운 Todo를 추가해 보세요.';

  const handleAddTodo = (rawText, clearInput) => {
    const text = normalizeTodoText(rawText);
    if (!text) {
      setHelper({ message: '할 일을 입력해 주세요.', type: 'error' });
      return;
    }

    setTodos((prev) => [
      {
        id: createTodoId(),
        text,
        isCompleted: false,
        createdAt: Date.now(),
        dateKey: selectedDateKey,
      },
      ...prev,
    ]);
    setHelper({ message: '추가했어요.', type: 'info' });
    clearInput();
  };

  const handleDeleteTodo = (todoId) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    setIsEditing((current) => (current === todoId ? null : current));
    setHelper({ message: '삭제했어요.', type: 'info' });
  };

  const handleToggleTodo = (todoId) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
    setHelper({ message: '상태를 변경했어요.', type: 'info' });
  };

  const handleStartEdit = (todoId) => {
    setIsEditing(todoId);
    setHelper({ message: '수정할 내용을 입력해 주세요.', type: 'info' });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setHelper({ message: '수정을 취소했어요.', type: 'info' });
  };

  const handleSaveEdit = (todoId, rawText) => {
    const editedText = normalizeTodoText(rawText);
    if (!editedText) {
      setHelper({ message: '수정 값이 비어있어서 변경하지 않았어요.', type: 'error' });
      return;
    }

    setTodos((prev) =>
      prev.map((todo) => (todo.id === todoId ? { ...todo, text: editedText } : todo))
    );
    setIsEditing(null);
    setHelper({ message: '수정했어요.', type: 'info' });
  };

  return (
    <main className="app" aria-label="Todo 앱">
      <header className="header">
        <h1 className="title">Todo</h1>
        <p className="subtitle">오늘 할 일을 깔끔하게 정리해요.</p>
      </header>

      <TodoForm
        onSubmit={handleAddTodo}
        helperText={helper.message}
        isError={helper.type === 'error'}
      />

      <section className="card" aria-label="Todo 목록">
        <div className="list-header">
          <h2 className="list-title">목록</h2>
          <p className="counter" aria-label="카운터">
            전체 {totalCount} · 진행 {activeCount} · 완료 {completedCount}
          </p>
        </div>

        <div className="week-header" aria-label="주간 뷰">
          <button
            id="prevWeekBtn"
            className="btn"
            type="button"
            onClick={() => {
              const movedDate = addDaysToDateKey(currentWeekStartKey, -7);
              setCurrentWeekStartKey(getWeekStartDateKey(new Date(movedDate)));
              setSelectedDateKey(movedDate);
              setIsEditing(null);
            }}
          >
            이전 주
          </button>
          <p className="week-range" aria-live="polite">
            {formatWeekRange(currentWeekStartKey)}
          </p>
          <button
            id="nextWeekBtn"
            className="btn"
            type="button"
            onClick={() => {
              const movedDate = addDaysToDateKey(currentWeekStartKey, 7);
              setCurrentWeekStartKey(getWeekStartDateKey(new Date(movedDate)));
              setSelectedDateKey(movedDate);
              setIsEditing(null);
            }}
          >
            다음 주
          </button>
        </div>

        <div id="weekDays" className="week-days" aria-label="요일별 날짜 목록">
          {weekDates.map((dateKey, index) => (
            <WeekDayButton
              key={dateKey}
              dateKey={dateKey}
              label={['월', '화', '수', '목', '금', '토', '일'][index]}
              isSelected={dateKey === selectedDateKey}
              isToday={dateKey === todayKey}
              count={weekTodoCountByDate.get(dateKey) || 0}
              onSelect={(nextDateKey) => {
                setSelectedDateKey(nextDateKey);
                setIsEditing(null);
              }}
            />
          ))}
        </div>

        <nav className="filters" aria-label="상태 필터">
          {[
            ['all', '전체'],
            ['active', '진행 중'],
            ['completed', '완료'],
          ].map(([filterKey, label]) => (
            <button
              key={filterKey}
              className={`filter-tab ${currentFilter === filterKey ? 'is-active' : ''}`}
              type="button"
              aria-pressed={currentFilter === filterKey}
              onClick={() => setCurrentFilter(filterKey)}
            >
              {label}
            </button>
          ))}
        </nav>

        <TodoList
          todos={visibleTodos}
          isEditing={isEditing}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          emptyMessage={emptyMessage}
        />
      </section>

      <footer className="footer">
        <small>kakaoTechCampus Assignment • React Todo</small>
      </footer>
    </main>
  );
}
