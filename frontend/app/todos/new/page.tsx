import { createTodo } from '../../actions';
import { formatDateKey } from '../../../lib/date-utils';

type PageProps = {
  searchParams?: {
    dateKey?: string;
  };
};

export default function NewTodoPage({ searchParams }: PageProps) {
  const dateKey = searchParams?.dateKey ?? formatDateKey(new Date());

  return (
    <main className="app">
      <header className="header">
        <h1 className="title">Todo</h1>
        <p className="subtitle">새로운 할 일을 등록해요.</p>
      </header>

      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="section-title">Todo 생성</h2>
            <p className="section-desc">입력 후 저장하면 FastAPI DB에 바로 반영됩니다.</p>
          </div>
        </div>

        <form action={createTodo} className="page-stack" style={{ marginTop: '16px' }}>
          <input type="hidden" name="date_key" value={dateKey} />
          <input type="hidden" name="returnTo" value={`/todos?dateKey=${dateKey}`} />
          <input
            name="text"
            placeholder="할 일을 입력하세요"
            className="field"
          />
          <div className="actions-row">
            <button type="submit" className="btn btn-primary">
              저장
            </button>
            <a href="/todos" className="btn">
              목록으로
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}
