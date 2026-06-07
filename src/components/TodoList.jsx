import TodoItem from './TodoItem';

export default function TodoList({
  todos,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onToggle,
  onDelete,
  emptyMessage,
}) {
  return (
    <>
      <ul className="todo-list" aria-label="Todo 리스트">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={isEditing === todo.id}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
      {todos.length === 0 ? <p className="empty-state">{emptyMessage}</p> : null}
    </>
  );
}
