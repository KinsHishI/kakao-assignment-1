import Link from 'next/link';
import { getTodos } from '../actions';
import {
  addDaysToDateKey,
  formatDateKey,
  formatWeekRange,
  getWeekDates,
  getWeekStartDateKey,
} from '../../lib/date-utils';

type PageProps = {
  searchParams?: {
    dateKey?: string;
    filter?: 'all' | 'active' | 'completed';
  };
};

function getTodayKey() {
  return formatDateKey(new Date());
}

export default async function TodosPage({ searchParams }: PageProps) {
  const todayKey = getTodayKey();
  const selectedDateKey = searchParams?.dateKey ?? todayKey;
  const selectedFilter = searchParams?.filter ?? 'all';
  const weekStartKey = getWeekStartDateKey(new Date(selectedDateKey));
  const allTodos = await getTodos();
  const selectedTodos = allTodos.filter((todo) => {
    const matchesDate = todo.date_key === selectedDateKey;
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'active' && !todo.is_completed) ||
      (selectedFilter === 'completed' && todo.is_completed);

    return matchesDate && matchesFilter;
  });

  const weekDates = getWeekDates(weekStartKey);
  const weekTodoCountByDate = new Map(
    weekDates.map((dateKey) => [
      dateKey,
      allTodos.filter((todo) => todo.date_key === dateKey).length,
    ])
  );

  return (
    <main className="app">
      <header className="header">
        <h1 className="title">Todo</h1>
        <p className="subtitle">오늘 할 일을 깔끔하게 정리해요.</p>
      </header>

      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="section-title">목록</h2>
            <p className="section-desc">날짜를 선택하면 해당 날짜의 Todo만 볼 수 있어요.</p>
          </div>
          <Link href={`/todos/new?dateKey=${selectedDateKey}`} className="btn btn-primary">
            새 Todo
          </Link>
        </div>

        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px', alignItems: 'center' }}>
            <Link href={`/todos?dateKey=${addDaysToDateKey(weekStartKey, -7)}`} className="btn">
              이전 주
            </Link>
            <p className="section-desc" style={{ textAlign: 'center', margin: 0 }}>
              {formatWeekRange(weekStartKey)}
            </p>
            <Link href={`/todos?dateKey=${addDaysToDateKey(weekStartKey, 7)}`} className="btn">
              다음 주
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '8px' }}>
            {weekDates.map((dateKey, index) => {
              const labels = ['월', '화', '수', '목', '금', '토', '일'];
              const dateObj = new Date(dateKey);
              const isSelected = dateKey === selectedDateKey;
              const isToday = dateKey === todayKey;

              return (
                <Link
                  key={dateKey}
                  href={`/todos?dateKey=${dateKey}`}
                  className={`card ${isSelected ? 'btn-primary' : ''}`}
                  style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    borderColor: isToday ? 'rgba(45, 212, 191, 0.7)' : undefined,
                    background: isSelected ? 'rgba(103, 43, 224, 0.2)' : undefined,
                  }}
                >
                  <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{labels[index]}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{dateObj.getDate()}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '12px' }}>
                    {weekTodoCountByDate.get(dateKey) || 0}개
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="actions-row">
            <Link
              href={`/todos?dateKey=${selectedDateKey}`}
              className={`btn ${selectedFilter === 'all' ? 'btn-primary' : ''}`}
            >
              전체
            </Link>
            <Link
              href={`/todos?dateKey=${selectedDateKey}&filter=active`}
              className={`btn ${selectedFilter === 'active' ? 'btn-primary' : ''}`}
            >
              진행 중
            </Link>
            <Link
              href={`/todos?dateKey=${selectedDateKey}&filter=completed`}
              className={`btn ${selectedFilter === 'completed' ? 'btn-primary' : ''}`}
            >
              완료
            </Link>
          </div>

          <ul className="todo-list">
            {selectedTodos.length === 0 ? (
              <li className="empty-state">아직 선택된 날짜에 Todo가 없어요. 새 Todo를 추가해 보세요.</li>
            ) : (
              selectedTodos.map((todo) => (
                <li key={todo.id} className={`todo-item ${todo.is_completed ? 'is-completed' : ''}`}>
                  <p className="todo-text">{todo.text}</p>
                  <div className="actions">
                    <Link href={`/todos/${todo.id}`} className="btn">
                      수정
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
