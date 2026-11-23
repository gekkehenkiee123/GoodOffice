import { describe, expect, it } from 'vitest'
import { isGoodOfficeOfflineUrlAllowed } from '../src/main/offline-network'

describe('GoodOffice offline URL allowlist', () => {
  it('allows only the local renderer, local files, and in-memory data', () => {
    expect(isGoodOfficeOfflineUrlAllowed('genoffice-app://sheets/index.html')).toBe(true)
    expect(isGoodOfficeOfflineUrlAllowed('file:///Applications/GoodOffice.app/Contents/Resources/app.asar/index.html')).toBe(true)
    expect(isGoodOfficeOfflineUrlAllowed('data:text/plain,local')).toBe(true)
  })

  it('rejects all network and unknown schemes, including loopback', () => {
    expect(isGoodOfficeOfflineUrlAllowed('https://example.com')).toBe(false)
    expect(isGoodOfficeOfflineUrlAllowed('http://127.0.0.1:5173')).toBe(false)
    expect(isGoodOfficeOfflineUrlAllowed('ws://localhost:5173')).toBe(false)
    expect(isGoodOfficeOfflineUrlAllowed('wss://example.com/socket')).toBe(false)
    expect(isGoodOfficeOfflineUrlAllowed('ftp://example.com/file')).toBe(false)
    expect(isGoodOfficeOfflineUrlAllowed('javascript:alert(1)')).toBe(false)
    expect(isGoodOfficeOfflineUrlAllowed('not a URL')).toBe(false)
  })
})
