import { useContext } from "react";
import Input from "./Input";
import TodoContext from "../Todo context";

const TodoItem = (props) => {
  const {
    firstIncompleteTodoRef,
    setEditTodoNewTitle
  } = useContext(TodoContext);

  const {
    id,
    checked,
    switchComplete,
    title,
    onDelete,
    isFirstIncomplete,

    setEditTodoId,
  } = props;

  return (
    <li className={checked && 'is-done-todo' || null} ref={isFirstIncomplete ? firstIncompleteTodoRef : null}>
      <Input checked={checked} onChange={switchComplete} type='checkbox' />
      <button onClick={onDelete}><svg><use href='#delete'></use></svg></button>
      <button onClick={() => {setEditTodoNewTitle(title); setEditTodoId(id)}}><svg><use href='#edit'></use></svg></button>
      <p>{title}</p>
    </li>
  )
}

export default TodoItem;