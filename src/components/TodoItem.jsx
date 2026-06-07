import { useEffect, useRef, useState } from 'react';

export default function TodoItem({
  todo,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onToggle,
  onDelete,
}) {
  const [draftText, setDraftText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      setDraftText(todo.text);
      queueMicrotask(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isEditing, todo.text]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSaveEdit(todo.id, draftText);
  };

  return (
    <li className={`todo-item ${todo.isCompleted ? 'is-completed' : ''}`}>
      {isEditing ? (
        <form className="todo-edit-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={`edit-${todo.id}`}>
            할 일 수정
          </label>
          <input
            ref={inputRef}
            id={`edit-${todo.id}`}
            className="todo-edit-input"
            type="text"
            value={draftText}
            maxLength={80}
            onChange={(event) => setDraftText(event.target.value)}
          />
          <div className="actions" aria-label="수정 작업">
            <button className="btn btn-primary" type="submit">
              저장
            </button>
            <button className="btn" type="button" onClick={() => onCancelEdit(todo.id)}>
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="todo-text">{todo.text}</p>
          <div className="actions" aria-label="할 일 작업">
            <button className="btn" type="button" onClick={() => onStartEdit(todo.id)}>
              수정
            </button>
            <button className="btn btn-success" type="button" onClick={() => onToggle(todo.id)}>
              {todo.isCompleted ? '되돌리기' : '완료'}
            </button>
            <button className="btn btn-danger" type="button" onClick={() => onDelete(todo.id)}>
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
}
