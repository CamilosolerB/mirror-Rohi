import React from 'react'

export function Tabs({ children }) {
  return <div className="tabs">{children}</div>
}

export function TabsList({ children }) {
  return <div className="tabs-list flex gap-2">{children}</div>
}

export function TabsTrigger({ children, ...props }) {
  return <button {...props} className={props.className || 'px-2 py-1 bg-gray-100 rounded'}>{children}</button>
}

export function TabsContent({ children }) {
  return <div className="tabs-content mt-2">{children}</div>
}

export default Tabs
