import { useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { PaduIcon } from '@/components/padu-icon'
import { useI18n } from '@/lib/i18n'

interface DeleteSessionDialogProps {
  session: { id: string; title?: string } | null
  onClose: () => void
  onConfirm: (sessionId: string) => void
}

export function DeleteSessionDialog({ session, onClose, onConfirm }: DeleteSessionDialogProps) {
  const { t } = useI18n()
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (session) {
      const timer = setTimeout(() => confirmButtonRef.current?.focus(), 30)
      return () => clearTimeout(timer)
    }
  }, [session])

  return (
    <Dialog open={session !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-[420px]"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            cancelButtonRef.current?.focus()
          } else if (event.key === 'ArrowRight') {
            event.preventDefault()
            confirmButtonRef.current?.focus()
          }
        }}
      >
        <DialogTitle className="flex items-center gap-2.5 text-danger">
          <span className="grid size-8 place-items-center rounded-lg bg-danger/10 text-danger">
            <PaduIcon name="trash" className="size-4" />
          </span>
          {t('session.delete_title')}
        </DialogTitle>
        <DialogDescription className="mt-2 text-[13.5px] leading-normal text-[var(--text-secondary)]">
          {t('session.delete_message', { title: session?.title || t('sidebar.new_task') })}
        </DialogDescription>
        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelButtonRef}
            type="button"
            className="h-8 rounded-lg px-3.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            onClick={onClose}
          >
            {t('common.cancel')}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className="h-8 rounded-lg bg-danger px-3.5 text-xs font-medium text-white hover:bg-danger/90 focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            onClick={() => {
              if (session) {
                onConfirm(session.id)
                onClose()
              }
            }}
          >
            {t('session.delete_confirm')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
