import Link from 'next/link';
import { fetchTodos } from '../../lib/todos';

export default async function TodosPage() {
  const todos = await fetchTodos();

  return (
    <main style={{ padding: '32px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Todo 목록</h1>
          <p>FastAPI에서 불러온 Todo를 보여줍니다.</p>
        </div>
        <Link href="/todos/new">새 Todo</Link>
      </header>

      <ul style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '12px' }}>
            <p style={{ margin: 0, textDecoration: todo.is_completed ? 'line-through' : 'none' }}>
              {todo.text}
            </p>
            <Link href={`/todos/${todo.id}`}>수정하기</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
