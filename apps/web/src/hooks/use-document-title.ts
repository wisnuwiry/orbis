import { useEffect } from 'react'

export const ORBIS_DOCUMENT_TITLE = 'Orbis Web'

export function formatDocumentTitle(section?: string | null): string {
  const normalized = section?.trim()
  if (!normalized || normalized === ORBIS_DOCUMENT_TITLE) return ORBIS_DOCUMENT_TITLE
  return `${normalized} — ${ORBIS_DOCUMENT_TITLE}`
}

export function useDocumentTitle(section?: string | null) {
  const title = formatDocumentTitle(section)
  useEffect(() => {
    document.title = title
  }, [title])
}
