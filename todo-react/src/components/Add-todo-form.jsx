import Button from "./Button";
import { useContext, memo } from "react";
import TodoContext from "../Todo context";
import Input from "./Input";

const AddTodoForm = (props) => {
  const {
    newTodoTitle,
    setNewTodoTitle
  } = useContext(TodoContext);

  const {
    onSubmit
  } = props;

  return (
    <form className="add-todo-form" onSubmit={onSubmit}>
      <Input
        type="text"
        placeholder="Todo title..."
        className="add-todo-input"
        value={newTodoTitle}
        onInput={(e) => { setNewTodoTitle(e.target.value) }}
        limit={20}
      />
      <Button className="add-todo-btn" onClick={onSubmit}>ADD</Button>
    </form>
  );
}

export default memo(AddTodoForm);