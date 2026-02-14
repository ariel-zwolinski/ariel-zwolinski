import React, { createContext, useContext, useState } from 'react'

const TabsCtx = createContext<{ value: string; setValue: (value: string) => void } | null>(null)

export function Tabs({ defaultValue, className = '', children }: { defaultValue: string; className?: string; children: React.ReactNode }) {
  const [value, setValue] = useState(defaultValue)
  return <TabsCtx.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsCtx.Provider>
}

export function TabsList({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}

export function TabsTrigger({ value, className = '', children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = useContext(TabsCtx)
  if (!ctx) return null
  return <button type="button" onClick={() => ctx.setValue(value)} className={`rounded border px-3 py-1 ${className}`}>{children}</button>
}

export function TabsContent({ value, className = '', children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = useContext(TabsCtx)
  if (!ctx || ctx.value !== value) return null
  return <div className={className}>{children}</div>
}
