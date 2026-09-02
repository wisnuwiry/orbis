import { describe, expect, test } from 'bun:test'
import { kbdVariants } from './kbd'

describe('kbdVariants', () => {
  test('default variant renders inset background styling', () => {
    const classes = kbdVariants()
    expect(classes).toContain('bg-[var(--inset)]')
    expect(classes).toContain('h-5')
  })

  test('outline variant renders border and transparent background', () => {
    const classes = kbdVariants({ variant: 'outline' })
    expect(classes).toContain('bg-transparent')
    expect(classes).toContain('border-border')
  })

  test('subtle variant renders foreground blend background', () => {
    const classes = kbdVariants({ variant: 'subtle' })
    expect(classes).toContain('bg-[color:var(--foreground)]/[0.07]')
  })

  test('custom size applies dimensions', () => {
    const classes = kbdVariants({ size: 'xs' })
    expect(classes).toContain('h-4')
    expect(classes).toContain('text-[10px]')
  })
})
