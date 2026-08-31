import { describe, expect, test } from 'bun:test'
import { normalizeDaemonAddress, validateConnectionConfig } from './connection'

describe('normalizeDaemonAddress', () => {
  test('normalizes host, HTTP, and daemon paths', () => {
    expect(normalizeDaemonAddress('host.example:34123')).toBe(
      'ws://host.example:34123',
    )
    expect(normalizeDaemonAddress('https://orbis.example/v1?token=nope')).toBe(
      'wss://orbis.example',
    )
    expect(normalizeDaemonAddress('HTTP://ORBIS.EXAMPLE/v1')).toBe(
      'ws://orbis.example',
    )
  })

  test('rejects unsupported schemes and credentials', () => {
    expect(() => normalizeDaemonAddress('ftp://orbis.example')).toThrow()
    expect(() => normalizeDaemonAddress('ws://token@orbis.example')).toThrow()
  })

  test('requires a token without putting it in the address', () => {
    expect(() =>
      validateConnectionConfig({ address: 'orbis.example', token: '  ' }),
    ).toThrow('token')
    expect(
      validateConnectionConfig({ address: 'orbis.example', token: 'secret' }),
    ).toEqual({
      address: 'ws://orbis.example',
      token: 'secret',
      remember: false,
    })
  })
})
