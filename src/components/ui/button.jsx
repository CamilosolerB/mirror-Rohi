import React from 'react'

export function Button({ children, ...props }) {
  return (
    <button {...props} className={props.className || 'px-3 py-1 rounded bg-blue-600 text-white'}>
      {children}
    </button>
  )
}

export default Button
