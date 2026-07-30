import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names, letting a later Tailwind utility win over an earlier one
 * in the same group. Every shadcn/ui primitive imports this, so its path is
 * pinned by the `utils` alias in components.json.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
