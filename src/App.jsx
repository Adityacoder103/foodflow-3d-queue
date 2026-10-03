import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'taskflow-todos-v1';

const defaultTodos = [
  { id: 1, text: 'Plan daily priorities', completed: false },
  { id: 2, text: 'Review JavaScript notes', completed: true },
  { id: 3, text: 'Finish project checklist', completed: false },
];

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
    } catch (error) {
      console.warn('Unable to load saved todos:', error);
    }

    return defaultTodos;
  });

  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  const remaining = todos.filter((todo) => !todo.completed).length;
  const completed = todos.length - remaining;

  const handleAddTodo = (event) => {
    event.preventDefault();

    const value = newTodo.trim();
    if (!value) return;

    setTodos((current) => [
      { id: Date.now() + Math.random(), text: value, completed: false },
      ...current,
    ]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((current) => current.filter((todo) => !todo.completed));
  };

  return (
    <div className="todo-app-shell">
      <div className="todo-card">
        <header className="todo-header">
          <div>
            <p className="eyebrow">Productivity</p>
            <h1>TaskFlow</h1>
          </div>
          <div className="task-badge">{remaining} left</div>
        </header>

        <section className="stats-grid">
          <div className="stat-box">
            <span>Total</span>
            <strong>{todos.length}</strong>
          </div>
          <div className="stat-box">
            <span>Active</span>
            <strong>{remaining}</strong>
          </div>
          <div className="stat-box">
            <span>Done</span>
            <strong>{completed}</strong>
          </div>
        </section>

        <form className="todo-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Add a new task..."
            aria-label="Add a new task"
          />
          <button type="submit">Add</button>
        </form>

        <div className="filter-row" aria-label="Task filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            All
          </button>
          <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>
            Active
          </button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>
            Done
          </button>
        </div>

        <ul className="todo-list">
          {visibleTodos.length === 0 ? (
            <li className="empty-state">No tasks in this view.</li>
          ) : (
            visibleTodos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.text}</span>
                </label>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete ${todo.text}`}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="footer-row">
          <span>{remaining} task(s) remaining</span>
          <button type="button" className="clear-btn" onClick={clearCompleted}>
            Clear completed
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
