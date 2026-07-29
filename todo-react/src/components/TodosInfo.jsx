import { useContext } from "react";
import Button from "./Button";
import TodoContext from "../Todo context";

const TodosInfo = (props) => {
  const {
    firstIncompleteTodoRef
  } = useContext(TodoContext);

  const {
    todos
  } = props;

  return (
    <div className="todos-info">
      <p>Completed {todos.filter(todo => todo.isDone).length} from {todos.length}</p>
      <Button
        className="scroll-first-incomplete"
        onClick={() => firstIncompleteTodoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) ?? null}
      >
        Show the first incomplete todo
      </Button>
    </div>
  )
};

export default TodosInfo;