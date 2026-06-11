export type Todo = {
  id: number;
  text: string;
  is_completed: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Todo 목록을 불러오지 못했습니다.');
  }

  return response.json();
}

export async function fetchTodo(todoId: string): Promise<Todo | null> {
  const todos = await fetchTodos();
  return todos.find((todo) => String(todo.id) === todoId) ?? null;
}
