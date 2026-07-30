import { useReducer, useRef, useState, useEffect } from 'react';
import './index.scss';
import TodoContext from './Todo context';

import AddTodoForm from './components/Add-todo-form';
import Input from './components/Input';
import Button from './components/Button';
import TodoItem from './components/TodoItem';
import TodosInfo from './components/TodosInfo';
import EditTodoWindow from './components/EditTodoWindow';
import replaceHtmlSymbols from './replaceHtmlSymbols';

const todosActions = (state, action) => {
  const { type, id, title } = action;

  switch (type) {
    case 'ADD': { return [...state, { id, title }]; };
    case 'DELETE': { return state.filter(todo => todo.id !== id); };
    case 'DELETE_ALL': { return []; };
    case 'SWITCH_COMPLETE_TODO': { return state.map(todo => todo.id === id ? { ...todo, isDone: !todo.isDone } : todo) };
    case 'EDIT': { return state.map(todo => todo.id === id ? { ...todo, title } : todo) }
    case 'SWITCH_FAVORITE': { return state.map(todo => todo.id === id ? { ...todo, isFav: !todo.isFav } : todo) }
    default: return state;
  }
}

const savedTodos = JSON.parse(localStorage.getItem('todos') || "[]");

const App = () => {
  const [searchTxt, setSearchTxt] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoNewTitle, setEditTodoNewTitle] = useState('');

  const [todos, dispatchTodos] = useReducer(todosActions, savedTodos);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const firstIncompleteTodoRef = useRef(null);

  const onAddTodo = (e) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) return;

    dispatchTodos({
      type: 'ADD',
      id: crypto?.randomUUID() ?? Date.now().toString(),
      title: newTodoTitle
    })

    setNewTodoTitle('');
  }

  const onConfirmEditTodo = (e) => {
    e.preventDefault();

    if (!editTodoNewTitle.trim()) return;

    dispatchTodos({ type: 'EDIT', id: editTodoId, title: editTodoNewTitle })
    setEditTodoId(null);
    setEditTodoNewTitle('');
  }

  const valueForContext = {
    todos,
    dispatchTodos,
    newTodoTitle,
    setNewTodoTitle,
    searchTxt,
    setSearchTxt,
    firstIncompleteTodoRef,
    setEditTodoId,
    onConfirmEditTodo,
    setEditTodoNewTitle
  }

  const todosLng = todos.length;
  const todosForRender = (
    searchTxt.trim()
      ? todos.filter(todo => todo.title.toLowerCase().includes(searchTxt.trim().toLowerCase()))
      : todos
  ).sort((a, b) => +!!b.isFav - +!!a.isFav);

  const firstIncompleteTodoId = todos.find(todo => !todo.isDone)?.id;

  return (
    <TodoContext.Provider value={valueForContext}>
      <div className="todo-wrap">
        <AddTodoForm onSubmit={onAddTodo} />

        <Input
          placeholder='Search todos...'
          className="search-todo-input"
          onInput={(e) => setSearchTxt(e.target.value)}
          value={searchTxt}
          limit={20}
        />

        <TodosInfo todos={todos} />

        <Button className="delete-all-btn" onClick={() => {
          if (confirm('Delete all todos?')) dispatchTodos({ type: 'DELETE_ALL' });
        }}>DELETE ALL</Button>

        <div className="todos-container">
          {!editTodoId
            ? <ul>
              {
                todosForRender.length
                  ? todosForRender.map(todo =>
                    <TodoItem key={todo.id}
                      className={todo.isFav ? 'fav-todo' : ''}
                      title={
                        searchTxt.trim()
                          ? replaceHtmlSymbols(todo.title).replace(new RegExp(searchTxt.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '<mark>$&</mark>')
                          : replaceHtmlSymbols(todo.title)
                      }
                      onDelete={() => dispatchTodos({ type: 'DELETE', id: todo.id })}
                      id={todo.id}
                      switchComplete={() => dispatchTodos({ type: 'SWITCH_COMPLETE_TODO', id: todo.id })}
                      checked={todo.isDone ?? false}
                      isFirstIncomplete={!!(firstIncompleteTodoId && todo.id === firstIncompleteTodoId)}
                      setEditTodoId={setEditTodoId}
                    />)
                  : !todosLng
                    ? <h3>No todos...</h3>
                    : <h3>Todos not found...</h3>
              }
            </ul>
            : <EditTodoWindow
              todoId={editTodoId}
              todoTitle={editTodoNewTitle}
              setTodoTitle={setEditTodoNewTitle}
            />
          }
        </div>
      </div>
    </TodoContext.Provider>
  )
}

export default App
