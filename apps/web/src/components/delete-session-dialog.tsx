import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useI18n } from '@/lib/i18n'

interface DeleteSessionDialogProps {
  session: { id: string; title?: string } | null
  onClose: () => void
  onConfirm: (sessionId: string) => void
}

export function DeleteSessionDialog({ session, onClose, onConfirm }: DeleteSessionDialogProps) {
  const { t } = useI18n()

  return (
    <ConfirmDialog
      open={session !== null}
      onOpenChange={(open) => !open && onClose()}
      title={t('session.delete_title')}
      description={t('session.delete_message', { title: session?.title || t('sidebar.new_task') })}
      confirmLabel={t('session.delete_confirm')}
      cancelLabel={t('common.cancel')}
      variant="danger"
      icon="trash"
      onConfirm={() => {
        if (session) {
          onConfirm(session.id)
        }
      }}
      onCancel={onClose}
    />
  )
}
