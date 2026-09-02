import { describe, expect, test } from 'bun:test'
import { badgeVariants } from './badge'

describe('badgeVariants', () => {
  test('default variant renders secondary muted styling', () => {
    const classes = badgeVariants({})
    expect(classes).toContain('bg-muted')
    expect(classes).toContain('text-muted-foreground')
  })

  test('explicit variants apply appropriate token classes', () => {
    expect(badgeVariants({ variant: 'default' })).toContain('bg-primary')
    expect(badgeVariants({ variant: 'outline' })).toContain('border-border')
    expect(badgeVariants({ variant: 'success' })).toContain('text-[var(--success)]')
    expect(badgeVariants({ variant: 'warning' })).toContain('text-[var(--warning)]')
    expect(badgeVariants({ variant: 'destructive' })).toContain('text-destructive')
    expect(badgeVariants({ variant: 'accent' })).toContain('bg-accent')
  })
})
