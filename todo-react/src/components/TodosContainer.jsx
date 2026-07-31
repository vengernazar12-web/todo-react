import { memo } from "react";

const TodosContainer = (props) => {
  const {
    children
  } = props;

  return <div className='todos-container'>{children}</div>
}

export default memo(TodosContainer);