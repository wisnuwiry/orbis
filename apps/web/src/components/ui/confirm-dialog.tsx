import { useEffect, useRef, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PaduIcon, type PaduIconName } from '@/components/padu-icon'
import { Kbd } from '@/components/ui/kbd'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string | ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  icon?: PaduIconName
  showShortcuts?: boolean
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  icon,
  showShortcuts = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useI18n()
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => confirmButtonRef.current?.focus(), 30)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleClose = () => {
    onOpenChange(false)
    onCancel?.()
  }

  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  const isDanger = variant === 'danger'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[420px]"
        showCloseButton={false}
        initialFocus={confirmButtonRef}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            handleClose()
          } else if (event.key === 'Enter') {
            if (
              cancelButtonRef.current &&
              (cancelButtonRef.current === event.target ||
                cancelButtonRef.current.contains(event.target as Node))
            ) {
              event.preventDefault()
              handleClose()
              return
            }
            event.preventDefault()
            void handleConfirm()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className={cn('flex items-center gap-2.5', isDanger && 'text-destructive')}>
            {icon && (
              <span
                className={cn(
                  'grid size-8 place-items-center rounded-lg',
                  isDanger ? 'bg-[var(--danger-soft)] text-destructive' : 'bg-accent text-[var(--text-secondary)]',
                )}
              >
                <PaduIcon name={icon} className="size-4" />
              </span>
            )}
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-[13.5px] leading-normal text-[var(--text-secondary)]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelButtonRef}
            type="button"
            className="flex h-8 items-center gap-1.5 rounded-lg px-3.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            onClick={handleClose}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                handleClose()
              }
            }}
          >
            <span>{cancelLabel ?? t('common.cancel')}</span>
            {showShortcuts && <Kbd size="xs" variant="outline">Esc</Kbd>}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-lg px-3.5 text-xs font-medium focus-visible:ring-1 focus-visible:ring-ring cursor-pointer',
              isDanger
                ? 'bg-destructive text-white hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
            onClick={handleConfirm}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                void handleConfirm()
              }
            }}
          >
            <span>{confirmLabel ?? (isDanger ? t('common.remove') : t('common.confirm'))}</span>
            {showShortcuts && (
              <Kbd
                size="xs"
                variant={isDanger ? 'inverse' : 'onPrimary'}
                className="p-1 [&>span]:size-3"
              >
                <PaduIcon name="cornerDownLeft" className="size-2.5" />
              </Kbd>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
