'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

export default function NewTodoPage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedText = text.trim();

    if (!normalizedText) return;

    setIsSubmitting(true);

    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: normalizedText }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      router.push('/todos');
      router.refresh();
    }
  };

  return (
    <main style={{ padding: '32px' }}>
      <h1>Todo 생성</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', maxWidth: '420px' }}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '저장'}
        </button>
      </form>
    </main>
  );
}
