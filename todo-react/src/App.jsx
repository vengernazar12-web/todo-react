import { useReducer, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import './index.scss';
import TodoContext from './Todo context';

import AddTodoForm from './components/AddTodoForm';
import Input from './components/Input';
import Button from './components/Button';
import TodoItem from './components/TodoItem';
import TodosInfo from './components/TodosInfo';
import EditTodoWindow from './components/EditTodoWindow';
import replaceHtmlSymbols from './replaceHtmlSymbols';
import TodosContainer from './components/TodosContainer';
import ConfirmShowIpTodo from './components/ConfirmShowIpTodo';

const todosActions = (state, action) => {
  const { type, id, title, priority, isFav } = action;

  switch (type) {
    case 'ADD': {
      if (!sessionStorage.getItem('session-todo-added')) sessionStorage.setItem('session-todo-added', 'true');
      return [...state, { id, title, isNew: true, priority: priority || undefined, isFav: isFav || undefined }];
    };
    case 'DELETE': { return state.filter(todo => todo.id !== id); };
    case 'DELETE_ALL': { return []; };
    case 'SWITCH_COMPLETE_TODO': { return state.map(todo => todo.id === id ? { ...todo, isDone: !todo.isDone } : todo) };
    case 'EDIT': { return state.map(todo => todo.id === id ? { ...todo, title } : todo) };
    case 'SWITCH_FAVORITE': { return state.map(todo => todo.id === id ? { ...todo, isFav: !todo.isFav } : todo) };
    case 'CHANGE_PRIORITY': { return state.map(todo => todo.id === id ? { ...todo, priority } : todo) };
    default: return state;
  }
}

const prioritiesColors = {
  'low': 'green',
  'medium': 'orange',
  'high': 'red',
}

const App = () => {
  const [searchTxt, setSearchTxt] = useState('');

  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoNewTitle, setEditTodoNewTitle] = useState('');

  const [newTodoId, setNewTodoId] = useState(null);

  const [deletedTodoId, setDeletedTodoId] = useState(null);

  const [todos, dispatchTodos] = useReducer(todosActions, JSON.parse(localStorage.getItem('todos') || "[]"));

  const timerForRerenderAfterAddNewTodo = useRef(null);

  const [needShowTaskForAddIPTodo, setNeedShowTaskForAddIPTodo] = useState(false);
  const [ showIpTodo, setShowIpTodo ] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));

    if (newTodoId) {
      clearTimeout(timerForRerenderAfterAddNewTodo.current);
      timerForRerenderAfterAddNewTodo.current = setTimeout(() => setNewTodoId(null), 500);
    }

    if (
      sessionStorage.getItem('session-todo-added')
      && !localStorage.getItem('IP')
      && !sessionStorage.getItem('task-showed')
    ) {
      setNeedShowTaskForAddIPTodo(true);
      sessionStorage.setItem('task-showed', 'true');
    };
  }, [todos, newTodoId]);

  useEffect(() => { // Secrets todos ( sleep, new year )
    // Show 'go-sleep' (secret todo)
    if (!sessionStorage.getItem('go-sleep')) {
      const hours = new Date().getHours();

      if (hours >= 20 || hours <= 4) {
        sessionStorage.setItem('go-sleep', 'true');
        const uniqueId = crypto?.randomUUID() ?? Date.now().toString();
        dispatchTodos({ type: 'ADD', title: "🌙 Don't forget to sleep.", id: uniqueId, priority: 'high', isFav: true });
        setNewTodoId(uniqueId);
      }
    }

    // Show 'new-year' (secret todo)
    if (!sessionStorage.getItem('new-year')) {
      const d = new Date();
      const month = d.getMonth() + 1;
      const date = d.getDate();

      if ((month === 12 && date >= 25) || (month === 1 && date <= 5)) {
        sessionStorage.setItem('new-year', 'true');
        const uniqueId = crypto?.randomUUID() ?? Date.now().toString();
        dispatchTodos({ type: 'ADD', title: "🎄 Wish your family and friends a Happy New Year!", id: uniqueId, priority: 'high', isFav: true });
        setNewTodoId(uniqueId);
      }
    }
  }, []);

  useEffect(() => {
    // Show IP (secret todo)
    if (!localStorage.getItem('IP')) {
      console.log(showIpTodo);

      if (!showIpTodo) return;

      localStorage.setItem('IP', 'true');

      fetch('https://api.ipify.org')
        .then(r => r.text())
        .then(userIp => {
          if (userIp && /\d+\.\d+\.\d+\.\d+/.test(userIp)) {

            const uniqueId = crypto?.randomUUID() ?? Date.now().toString();
            dispatchTodos({ type: 'ADD', title: `Hide your IP (${userIp})`, id: uniqueId, priority: 'high', isFav: true });
            setNewTodoId(uniqueId);
            setShowIpTodo(false);
          }
        })
    }
  }, [showIpTodo])

  const firstIncompleteTodoRef = useRef(null);

  const onConfirmEditTodo = useCallback((e) => {
    e.preventDefault();

    if (!editTodoNewTitle.trim()) return;

    dispatchTodos({ type: 'EDIT', id: editTodoId, title: editTodoNewTitle })
    setEditTodoId(null);
    setEditTodoNewTitle('');
  }, [editTodoNewTitle, editTodoId]);

  const onChangePriority = (id, initPriority) => {
    const targetPriority =
      !initPriority
        ? 'low'
        : initPriority === 'low'
          ? 'medium'
          : initPriority === 'medium'
            ? 'high'
            : undefined;

    dispatchTodos({ type: 'CHANGE_PRIORITY', id, priority: targetPriority });
  }

  const timerForRerenderAfterDeleteTodo = useRef(null);
  const [deletedTodosIds, setDeletedTodosIds] = useState([]);

  const onDeleteFn = (id) => {
    setDeletedTodosIds(prev => [...prev, id]);

    clearTimeout(timerForRerenderAfterDeleteTodo.current);
    timerForRerenderAfterDeleteTodo.current = setTimeout(() => {
      setDeletedTodosIds(prev => {
        for (const id of prev) dispatchTodos({ type: 'DELETE', id });
        return [];
      });
    }, 500);
  }

  const valueForContext = useMemo(() => {
    return {
      todos,
      dispatchTodos,
      searchTxt,
      setSearchTxt,
      firstIncompleteTodoRef,
      setEditTodoId,
      onConfirmEditTodo,
      setEditTodoNewTitle,
      onChangePriority,
      prioritiesColors,
      deletedTodosIds,
      setDeletedTodosIds,
      setNewTodoId,
      setShowIpTodo,
      setNeedShowTaskForAddIPTodo
    }
  }, [
    todos,
    dispatchTodos,
    searchTxt,
    setSearchTxt,
    firstIncompleteTodoRef,
    setEditTodoId,
    onConfirmEditTodo,
    setEditTodoNewTitle,
    onChangePriority,
    prioritiesColors,
    deletedTodosIds,
    setDeletedTodosIds,
    setNewTodoId,
    setShowIpTodo,
    setNeedShowTaskForAddIPTodo
  ]);

  const todosLng = todos.length;
  const todosForRender = useMemo(() => [...(
    searchTxt.trim()
      ? todos.filter(todo => todo.title.toLowerCase().includes(searchTxt.trim().toLowerCase()))
      : todos
  )].sort((a, b) => +!!b.isFav - +!!a.isFav)
    , [todos, searchTxt]);

  const firstIncompleteTodoId = todos.find(todo => !todo.isDone)?.id;

  return (
    <TodoContext.Provider value={valueForContext}>
      <div className="todo-wrap">
        <AddTodoForm />

        <label htmlFor="search" className="visually-hidden"></label>
        <Input
          placeholder='Search todos...'
          className="search-todo-input"
          onInput={(e) => setSearchTxt(e.target.value)}
          value={searchTxt}
          limit={20}
          id="search"
        />

        <TodosInfo todos={todos} />

        <Button className="delete-all-btn" onClick={() => {
          if (confirm('Delete all todos?')) dispatchTodos({ type: 'DELETE_ALL' });
        }}>DELETE ALL</Button>

        <TodosContainer className="todos-container">
          {
            needShowTaskForAddIPTodo
              ? <ConfirmShowIpTodo />
              : !editTodoId
                ? <ul aria-label="Todo list">
                  {
                    todosForRender.length
                      ? todosForRender.map(todo =>
                        <TodoItem key={todo.id}
                          className={`${todo.isFav ? 'fav-todo' : ''} ${newTodoId === todo.id ? 'is-new' : ''} ${deletedTodosIds.includes(todo.id) ? 'deleted-todo' : ''}`}
                          title={
                            searchTxt.trim()
                              ? replaceHtmlSymbols(todo.title).replace(new RegExp(searchTxt.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '<mark>$&</mark>')
                              : replaceHtmlSymbols(todo.title)
                          }
                          onDelete={() => onDeleteFn(todo.id)}
                          id={todo.id}
                          switchComplete={() => dispatchTodos({ type: 'SWITCH_COMPLETE_TODO', id: todo.id })}
                          checked={todo.isDone ?? false}
                          isFirstIncomplete={!!(firstIncompleteTodoId && todo.id === firstIncompleteTodoId)}
                          setEditTodoId={setEditTodoId}
                          priority={todo.priority}
                        />
                      )
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
        </TodosContainer>
      </div>
    </TodoContext.Provider>
  )
}

export default App
