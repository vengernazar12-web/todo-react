import { useContext } from "react";
import Button from "./Button";
import Input from "./Input";
import TodoContext from "../Todo context";

const EditTodoWindow = (props) => {
  const {
    todoTitle,
    setTodoTitle
  } = props;

  const {
    onConfirmEditTodo
  } = useContext(TodoContext);

  return (
    <form className="edit-todo-window" onSubmit={onConfirmEditTodo}>
      <h3>Edit your todo</h3>
      <Input
        value={todoTitle}
        onInput={(e) => setTodoTitle(e.target.value)}
        placeholder="Edit todo title..."
        className="edit-todo-input"
        limit={20}
      />
      <Button className='edit-todo-btn' onClick={onConfirmEditTodo}>EDIT</Button>
    </form>
  )
};

export default EditTodoWindow;