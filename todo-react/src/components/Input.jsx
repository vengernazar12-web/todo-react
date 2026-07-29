const Input = (props) => {
  const {
    className = '',
    type = 'text',
    placeholder = '',
    value,
    onInput = null,
    checked = false,
    onChange = null,
    limit = 0,
  } = props;

  return (
    <input
      checked={type === 'text' ? null : checked}
      className={`input ${className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onInput={onInput}
      onChange={onChange}
      maxLength={limit || undefined}
    />
  )
}

export default Input;