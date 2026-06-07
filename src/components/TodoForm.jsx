import { useState } from 'react';

export default function TodoForm({ onSubmit, helperText, isError }) {
  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(text, () => setText(''));
  };

  return (
    <section className="card" aria-label="Todo 입력">
      <form className="todo-form" onSubmit={handleSubmit} autoComplete="off">
        <label className="sr-only" htmlFor="todoInput">
          할 일 입력
        </label>
        <input
          id="todoInput"
          className="todo-input"
          type="text"
          placeholder="할 일을 입력하세요"
          maxLength={80}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          추가
        </button>
      </form>
      <p className={`helper ${isError ? 'is-error' : ''}`} role="status" aria-live="polite">
        {helperText}
      </p>
    </section>
  );
}
