import { useEffect } from 'react'

export const PADU_DOCUMENT_TITLE = 'Padu Web'

export function formatDocumentTitle(section?: string | null): string {
  const normalized = section?.trim()
  if (!normalized || normalized === PADU_DOCUMENT_TITLE) return PADU_DOCUMENT_TITLE
  return `${normalized} — ${PADU_DOCUMENT_TITLE}`
}

export function useDocumentTitle(section?: string | null) {
  const title = formatDocumentTitle(section)
  useEffect(() => {
    document.title = title
  }, [title])
}
