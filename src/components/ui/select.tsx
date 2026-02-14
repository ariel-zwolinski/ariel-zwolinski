import React from 'react'

type SelectProps = { value: string; onValueChange: (v: string) => void; children: React.ReactNode }

function flattenItems(children: React.ReactNode): Array<{ value: string; label: string }> {
  const out: Array<{ value: string; label: string }> = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    if ((child.type as any).displayName === 'SelectItem') {
      out.push({ value: child.props.value, label: String(child.props.children) })
    }
    if (child.props?.children) out.push(...flattenItems(child.props.children))
  })
  return out
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const items = flattenItems(children)
  return <select value={value} onChange={(e) => onValueChange(e.target.value)}>{items.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}</select>
}

export function SelectTrigger({ children }: { children: React.ReactNode }) { return <>{children}</> }
export function SelectValue(_props: { placeholder?: string }) { return null }
export function SelectContent({ children }: { children: React.ReactNode }) { return <>{children}</> }
export function SelectItem({ children }: { value: string; children: React.ReactNode }) { return <>{children}</> }
SelectItem.displayName = 'SelectItem'
