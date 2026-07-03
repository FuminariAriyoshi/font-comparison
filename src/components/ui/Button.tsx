import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        variant === 'primary' &&
          'bg-indigo-500 text-white hover:bg-indigo-400 disabled:opacity-50',
        variant === 'ghost' &&
          'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
        className,
      )}
      {...props}
    />
  )
}
