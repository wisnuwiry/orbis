import type { HostProfile } from '@padu/client'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PaduIcon } from '@/components/padu-icon'
import { useI18n } from '@/lib/i18n'
import { normalizeDaemonAddress } from '@/lib/connection'

export function HostDialog({
  open,
  editingHost,
  onOpenChange,
  onSave,
  onDelete,
}: {
  open: boolean
  editingHost: HostProfile | null
  onOpenChange: (open: boolean) => void
  onSave: (data: { name: string; address: string; token?: string }) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}) {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [token, setToken] = useState('')
  const [tokenRevealed, setTokenRevealed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(editingHost?.name ?? '')
    setAddress(editingHost?.address ?? '')
    setToken(editingHost?.token ?? '')
    setTokenRevealed(false)
    setError(null)
    setBusy(false)
  }, [open, editingHost])

  const isEditing = Boolean(editingHost)
  const title = isEditing ? t('host.edit_host') : t('host.add_host')
  const saveLabel = isEditing ? t('host.save') : t('host.save_and_connect')

  async function handleSave() {
    setError(null)
    try {
      normalizeDaemonAddress(address, (k) => t(k))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
      return
    }

    setBusy(true)
    try {
      await onSave({
        name: name.trim(),
        address: address.trim(),
        token: token.trim() || undefined,
      })
      onOpenChange(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!editingHost || !onDelete) return
    setBusy(true)
    try {
      await onDelete(editingHost.id)
      onOpenChange(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] overflow-hidden rounded-[14px] bg-[var(--raised)] p-5">
        <DialogTitle className="flex items-center justify-between text-[15px] font-semibold text-foreground">
          <span>{title}</span>
        </DialogTitle>

        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            void handleSave()
          }}
        >
          <label className="flex flex-col gap-1 text-[12.5px] font-medium text-[var(--text-secondary)]">
            <span>{t('host.name')}</span>
            <Input
              className="h-8 bg-card"
              placeholder={t('host.name_placeholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1 text-[12.5px] font-medium text-[var(--text-secondary)]">
            <span>{t('host.address')}</span>
            <Input
              autoCapitalize="none"
              autoCorrect="off"
              className="h-8 bg-card"
              inputMode="url"
              placeholder={t('host.address_placeholder')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1 text-[12.5px] font-medium text-[var(--text-secondary)]">
            <span>{t('host.token')}</span>
            <div className="relative">
              <Input
                autoComplete="off"
                className="h-8 bg-card pr-8"
                placeholder={t('host.token_placeholder')}
                type={tokenRevealed ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <Button
                aria-label={t(tokenRevealed ? 'daemon.hide_token' : 'daemon.reveal_token')}
                className="absolute right-0.5 top-0.5 size-7 text-[var(--text-tertiary)]"
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={() => setTokenRevealed((v) => !v)}
              >
                <PaduIcon name={tokenRevealed ? 'eyeOff' : 'eye'} />
              </Button>
            </div>
          </label>

          {error && (
            <div role="alert" className="rounded-lg bg-[var(--danger-soft)] px-3 py-2 text-[12px] text-destructive">
              {error}
            </div>
          )}

          <div className="mt-2 flex items-center justify-between pt-1">
            {isEditing && onDelete ? (
              <Button
                className="text-destructive hover:bg-[var(--danger-soft)] hover:text-destructive"
                disabled={busy}
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => void handleDelete()}
              >
                {t('host.remove_host')}
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                disabled={busy}
                size="sm"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button disabled={busy} size="sm" type="submit">
                {saveLabel}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
