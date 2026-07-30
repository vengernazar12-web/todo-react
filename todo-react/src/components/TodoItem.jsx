import { useContext } from "react";
import Input from "./Input";
import TodoContext from "../Todo context";

const TodoItem = (props) => {
  const {
    firstIncompleteTodoRef,
    setEditTodoNewTitle,
    dispatchTodos,
    onChangePriority,
    prioritiesColors
  } = useContext(TodoContext);

  const {
    id,
    checked,
    switchComplete,
    title,
    onDelete,
    isFirstIncomplete,

    setEditTodoId,
    className,
    priority
  } = props;

  return (
    <li style={{ borderLeft: `${priority ? '5px' : '0'} solid ${prioritiesColors[priority] || 'transparent'}` }} className={`${checked && 'is-done-todo' || null} ${className}`} ref={isFirstIncomplete ? firstIncompleteTodoRef : null}>
      <Input checked={checked} onChange={switchComplete} type='checkbox' />
      <button onClick={onDelete}><svg><use href='#delete'></use></svg></button> {/* Delete button */}
      <button onClick={() => {setEditTodoNewTitle(title); setEditTodoId(id)}}><svg><use href='#edit'></use></svg></button> {/* Edit button */}
      <button className="priority" onClick={() => {onChangePriority(id, priority)}}><svg><use href='#priority'></use></svg></button> {/* Change priority button */}
      <button onClick={() => dispatchTodos({ type: 'SWITCH_FAVORITE', id })}><svg className='fav'><use href='#fav'></use></svg></button> {/* Switch favorite button */}
      <p dangerouslySetInnerHTML={{ __html: title }}/>
    </li>
  )
}

export default TodoItem;