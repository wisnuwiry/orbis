import { describe, expect, test } from 'bun:test'
import { displayHost, normalizeDaemonAddress, validateConnectionConfig } from './connection'

describe('normalizeDaemonAddress', () => {
  test('normalizes host, HTTP, and daemon paths', () => {
    expect(normalizeDaemonAddress('host.example:34123')).toBe(
      'ws://host.example:34123',
    )
    expect(normalizeDaemonAddress('https://padu.example/v1?token=nope')).toBe(
      'wss://padu.example',
    )
    expect(normalizeDaemonAddress('HTTP://PADU.EXAMPLE/v1')).toBe(
      'ws://padu.example',
    )
  })

  test('rejects unsupported schemes and credentials', () => {
    expect(() => normalizeDaemonAddress('ftp://padu.example')).toThrow()
    expect(() => normalizeDaemonAddress('ws://token@padu.example')).toThrow()
  })

  test('requires a token without putting it in the address', () => {
    expect(() =>
      validateConnectionConfig({ address: 'padu.example', token: '  ' }),
    ).toThrow('token')
    expect(
      validateConnectionConfig({ address: 'padu.example', token: 'secret' }),
    ).toEqual({
      address: 'ws://padu.example',
      token: 'secret',
      remember: false,
    })
  })
})

describe('displayHost and host persistence', () => {
  test('formats display host correctly', () => {
    expect(displayHost('ws://127.0.0.1:4400')).toBe('127.0.0.1:4400')
    expect(displayHost('wss://server.internal')).toBe('server.internal')
    expect(displayHost('invalid')).toBe('invalid')
  })
})
