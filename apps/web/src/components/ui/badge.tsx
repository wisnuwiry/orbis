import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-[11px] font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-muted text-muted-foreground',
        outline: 'border border-border text-foreground',
        success: 'bg-[var(--success)]/12 text-[var(--success)]',
        warning: 'bg-[var(--warning)]/15 text-[var(--warning)]',
        destructive: 'bg-destructive/12 text-destructive',
        accent: 'bg-accent text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  },
)

function Badge({
  className,
  variant = 'secondary',
  ...props
}: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

