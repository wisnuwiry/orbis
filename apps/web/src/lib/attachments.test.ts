import { describe, expect, test } from 'bun:test'
import type { OrbisClient } from '@orbis/client'
import { importDaemonPathAttachment } from './attachments'

describe('importDaemonPathAttachment', () => {
  test('asks the daemon to import an absolute path without sending file bytes', async () => {
    let command: unknown
    const client = {
      request: async (next: unknown) => {
        command = next
        return {
          type: 'attachmentStored',
          attachment: {
            reference: 'orbis-attachment:one',
            path: '/home/me/.orbis/attachments/one/logo.png',
            name: 'logo.png',
            isDir: false,
          },
        }
      },
    } as unknown as OrbisClient

    const attachment = await importDaemonPathAttachment(client, '/Users/me/Pictures/logo.png')

    expect(command).toEqual({
      type: 'importPathAttachment',
      path: '/Users/me/Pictures/logo.png',
    })
    expect(attachment).toEqual({
      path: '/home/me/.orbis/attachments/one/logo.png',
      mention: '/Users/me/Pictures/logo.png',
      name: 'logo.png',
      is_dir: false,
      is_image: true,
      blob_reference: 'orbis-attachment:one',
    })
  })
})
