import React from 'react'

export function Badge({ children, ...props }) {
  return <span {...props} className={props.className || 'inline-block bg-gray-200 text-xs px-2 py-0.5 rounded'}>{children}</span>
}

export default Badge
