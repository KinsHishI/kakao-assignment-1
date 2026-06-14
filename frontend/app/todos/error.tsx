'use client';

export default function TodosError({ error }: { error: Error }) {
  return (
    <main className="app">
      <section className="card">
        <h1 className="section-title">오류가 발생했습니다</h1>
        <p className="section-desc">{error.message}</p>
      </section>
    </main>
  );
}
