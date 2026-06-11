'use client';

export default function TodosError({ error }: { error: Error }) {
  return (
    <main style={{ padding: '32px' }}>
      <h1>오류가 발생했습니다</h1>
      <p>{error.message}</p>
    </main>
  );
}
