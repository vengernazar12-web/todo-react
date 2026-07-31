import Button from "./Button";
import { useContext, memo, useState, useCallback } from "react";
import TodoContext from "../Todo context";
import Input from "./Input";

const AddTodoForm = (props) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const {
    dispatchTodos,
    setNewTodoId
  } = useContext(TodoContext);

  const onAddTodo = useCallback((e) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) return;

    const uniqueId = crypto?.randomUUID() ?? Date.now().toString();

    dispatchTodos({
      type: 'ADD',
      id: uniqueId,
      title: newTodoTitle
    });

    setNewTodoId(uniqueId);

    setNewTodoTitle('');
  }, [newTodoTitle]);

  return (
    <form className="add-todo-form" onSubmit={onAddTodo}>
      <Input
        type="text"
        placeholder="Todo title..."
        className="add-todo-input"
        value={newTodoTitle}
        onInput={(e) => { setNewTodoTitle(e.target.value) }}
        limit={20}
      />
      <Button className="add-todo-btn" onClick={onAddTodo}>ADD</Button>
    </form>
  );
}

export default AddTodoForm;