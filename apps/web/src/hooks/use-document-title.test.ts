import { describe, expect, test } from 'bun:test'
import {
  formatDocumentTitle,
  PADU_DOCUMENT_TITLE,
} from './use-document-title'

describe('formatDocumentTitle', () => {
  test('uses the product title without a section', () => {
    expect(formatDocumentTitle()).toBe(PADU_DOCUMENT_TITLE)
    expect(formatDocumentTitle('   ')).toBe(PADU_DOCUMENT_TITLE)
  })

  test('identifies the current browser surface', () => {
    expect(formatDocumentTitle('New Task')).toBe('New Task — Padu Web')
    expect(formatDocumentTitle('  General  ')).toBe('General — Padu Web')
  })

  test('does not duplicate the product title', () => {
    expect(formatDocumentTitle(PADU_DOCUMENT_TITLE)).toBe(PADU_DOCUMENT_TITLE)
  })
})
