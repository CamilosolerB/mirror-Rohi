import React from 'react'

export function Card({ children, ...props }) {
  return <div {...props} className={props.className || 'border rounded shadow p-4'}>{children}</div>
}

export function CardHeader({ children }) {
  return <div className="mb-2 font-bold">{children}</div>
}

export function CardContent({ children }) {
  return <div className="text-sm">{children}</div>
}

export function CardTitle({ children }) {
  return <div className="text-lg font-semibold">{children}</div>
}

export default Card
