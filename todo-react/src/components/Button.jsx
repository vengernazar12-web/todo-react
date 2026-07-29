const Button = (props) => {
  const {
    children,
    className,
    onClick
  } = props;

  return (
    <button type="button" className={`button ${className}`} onClick={onClick}>{children}</button>
  )
}

export default Button;