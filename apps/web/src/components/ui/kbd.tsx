import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const kbdVariants = cva(
  'inline-flex shrink-0 items-center justify-center font-sans font-medium transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'rounded-[5px] bg-[var(--inset)] text-[var(--text-tertiary)] border border-border/30',
        outline: 'rounded-[5px] border border-border bg-transparent text-[var(--text-secondary)]',
        subtle: 'rounded-[5px] bg-[color:var(--foreground)]/[0.07] text-[var(--text-tertiary)]',
        inverse: 'rounded-[5px] bg-black/25 text-white border border-white/20',
      },
      size: {
        xs: 'h-4 min-w-4 px-1 text-[10px]',
        sm: 'h-5 min-w-6 px-1.5 text-[11px]',
        md: 'h-6 min-w-7 px-2 text-[12px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
)

export interface KbdProps
  extends ComponentProps<'kbd'>,
    VariantProps<typeof kbdVariants> {}

export function Kbd({ className, variant, size, children, ...props }: KbdProps) {
  return (
    <kbd className={cn(kbdVariants({ variant, size, className }))} {...props}>
      {children}
    </kbd>
  )
}

export { kbdVariants }
