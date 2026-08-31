import { describe, expect, test } from 'bun:test'
import {
  formatDocumentTitle,
  ORBIS_DOCUMENT_TITLE,
} from './use-document-title'

describe('formatDocumentTitle', () => {
  test('uses the product title without a section', () => {
    expect(formatDocumentTitle()).toBe(ORBIS_DOCUMENT_TITLE)
    expect(formatDocumentTitle('   ')).toBe(ORBIS_DOCUMENT_TITLE)
  })

  test('identifies the current browser surface', () => {
    expect(formatDocumentTitle('New Task')).toBe('New Task — Orbis Web')
    expect(formatDocumentTitle('  General  ')).toBe('General — Orbis Web')
  })

  test('does not duplicate the product title', () => {
    expect(formatDocumentTitle(ORBIS_DOCUMENT_TITLE)).toBe(ORBIS_DOCUMENT_TITLE)
  })
})
