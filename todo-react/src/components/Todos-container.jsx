const TodosContainer = (props) => {
  const {
    children
  } = props;

  return (
    <div className="todos-container">{children}</div>
  )
}

export default TodosContainer;