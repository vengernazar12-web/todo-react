import { useContext } from "react";
import Button from "./Button";
import Input from "./Input";
import TodoContext from "../Todo context";

const ConfirmShowIpTodo = () => {
  const {
    setShowIpTodo,
    setNeedShowTaskForAddIPTodo
  } = useContext(TodoContext);

  return (
    <div>
      <h2>🎁 Secret feature</h2>
      <p>This app has a hidden todo.</p>
      <Button className='confirm-unlock' onClick={() => {setNeedShowTaskForAddIPTodo(false); setShowIpTodo(true)}}>Confirm</Button>
      <Button className='cancel' onClick={() => {setNeedShowTaskForAddIPTodo(false); setShowIpTodo(false)}}>Cancel</Button>
    </div>
  )
}

export default ConfirmShowIpTodo;