import type { InputHTMLAttributes } from 'react'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`rounded border px-2 py-1 ${className}`.trim()} {...props} />
}
