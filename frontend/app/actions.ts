'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type Todo = {
  id: number;
  text: string;
  is_completed: boolean;
  date_key: string;
};

const API_BASE_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getTodos(): Promise<Todo[]> {
  return fetchJson<Todo[]>('/todos');
}

export async function getTodo(todoId: string): Promise<Todo | null> {
  const todos = await getTodos();
  return todos.find((todo) => String(todo.id) === todoId) ?? null;
}

export async function createTodo(formData: FormData) {
  const text = String(formData.get('text') ?? '').trim();
  const dateKey = String(formData.get('date_key') ?? '').trim();
  const returnTo = String(formData.get('returnTo') ?? '/todos');
  if (!text) return;

  await fetchJson('/todos', {
    method: 'POST',
    body: JSON.stringify({ text, date_key: dateKey }),
  });

  revalidatePath('/todos');
  redirect(returnTo || '/todos');
}

export async function updateTodo(formData: FormData) {
  const todoId = String(formData.get('todoId') ?? '');
  const text = String(formData.get('text') ?? '').trim();
  const isCompleted = String(formData.get('isCompleted') ?? 'false') === 'true';
  const dateKey = String(formData.get('date_key') ?? '').trim();
  const returnTo = String(formData.get('returnTo') ?? '/todos');

  if (!todoId || !text) return;

  await fetchJson(`/todos/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify({
      text,
      is_completed: isCompleted,
      date_key: dateKey || null,
    }),
  });

  revalidatePath('/todos');
  revalidatePath(`/todos/${todoId}`);
  redirect(returnTo || '/todos');
}

export async function deleteTodo(formData: FormData) {
  const todoId = String(formData.get('todoId') ?? '');
  const returnTo = String(formData.get('returnTo') ?? '/todos');
  if (!todoId) return;

  await fetchJson(`/todos/${todoId}`, {
    method: 'DELETE',
  });

  revalidatePath('/todos');
  redirect(returnTo || '/todos');
}
