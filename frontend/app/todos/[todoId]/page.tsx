import { notFound } from 'next/navigation';
import Link from 'next/link';
import { deleteTodo, getTodo, updateTodo } from '../../actions';
import { formatDateKey } from '../../../lib/date-utils';

type PageProps = {
  params: { todoId: string };
};

export default async function TodoDetailPage({ params }: PageProps) {
  const { todoId } = params;
  const todo = await getTodo(todoId);

  if (!todo) {
    notFound();
  }

  return (
    <main className="app">
      <header className="header">
        <h1 className="title">Todo</h1>
        <p className="subtitle">선택한 할 일을 수정하거나 삭제해요.</p>
      </header>

      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="section-title">Todo 수정</h2>
            <p className="section-desc">서버에서 가져온 Todo를 수정합니다.</p>
          </div>
          <Link href={`/todos?dateKey=${todo.date_key}`} className="btn">
            목록으로
          </Link>
        </div>

        <div className="detail-grid" style={{ marginTop: '16px' }}>
          <div className="status">ID {todo.id}</div>
          <form action={updateTodo} className="page-stack">
            <input type="hidden" name="todoId" value={todo.id} />
            <input type="hidden" name="date_key" value={todo.date_key ?? formatDateKey(new Date())} />
            <input type="hidden" name="returnTo" value={`/todos?dateKey=${todo.date_key}`} />
            <label className="label">
              텍스트
              <input name="text" defaultValue={todo.text} className="field" />
            </label>
            <label className="label">
              완료 여부
              <select name="isCompleted" defaultValue={String(todo.is_completed)} className="select">
                <option value="false">진행 중</option>
                <option value="true">완료</option>
              </select>
            </label>
            <div className="actions-row">
              <button type="submit" className="btn btn-primary">
                수정 저장
              </button>
            </div>
          </form>

          <form action={deleteTodo}>
            <input type="hidden" name="todoId" value={todo.id} />
            <input type="hidden" name="returnTo" value={`/todos?dateKey=${todo.date_key}`} />
            <button type="submit" className="btn btn-danger">
              삭제
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
