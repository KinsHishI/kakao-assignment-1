import { notFound } from 'next/navigation';
import { fetchTodo } from '../../../lib/todos';

type PageProps = {
  params: { todoId: string };
};

export default async function TodoDetailPage({ params }: PageProps) {
  const { todoId } = params;
  const todo = await fetchTodo(todoId);

  if (!todo) {
    notFound();
  }

  return (
    <main style={{ padding: '32px' }}>
      <h1>Todo 수정</h1>
      <p>ID: {todo.id}</p>
      <p>텍스트: {todo.text}</p>
      <p>완료 여부: {todo.is_completed ? '완료' : '진행 중'}</p>
      <p>이 페이지는 수정 페이지의 기본 구조만 보여줍니다.</p>
    </main>
  );
}
