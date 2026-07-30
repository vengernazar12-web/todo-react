import { memo } from "react";

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
    name = undefined
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
      name={name}
    />
  )
}

export default memo(Input);