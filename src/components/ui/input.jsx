import React from 'react'

export function Input(props) {
  return <input {...props} className={props.className || 'border px-2 py-1 rounded'} />
}

export default Input
