import React from 'react'

export function Select({ children, ...props }) {
  return <select {...props} className={props.className || 'border px-2 py-1 rounded'}>{children}</select>
}

export function SelectTrigger(props) {
  return <div {...props} />
}

export function SelectValue(props) {
  return <div {...props} />
}

export function SelectContent({ children }) {
  return <div className="select-content">{children}</div>
}

export function SelectItem({ children, ...props }) {
  return <option {...props}>{children}</option>
}

export default Select
