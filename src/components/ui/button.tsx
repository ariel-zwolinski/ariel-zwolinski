import type { ButtonHTMLAttributes } from 'react'

export function Button({ className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`rounded border px-3 py-2 ${className}`.trim()} {...props} />
}
