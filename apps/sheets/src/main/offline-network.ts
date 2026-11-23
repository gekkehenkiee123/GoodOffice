import { syncBuiltinESMExports } from 'node:module'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'
import tls from 'node:tls'
import dns from 'node:dns'
import dgram from 'node:dgram'
import type { Session } from 'electron'

const OFFLINE_ERROR = 'GoodOffice is offline: network access is disabled.'

function denyNetworkRequest(): never {
  throw new Error(OFFLINE_ERROR)
}

/** Only local application resources are allowed in the packaged GoodOffice app. */
export function isGoodOfficeLocalResource(rawUrl: string): boolean {
  try {
    const protocol = new URL(rawUrl).protocol
    return ['genoffice-app:', 'file:', 'data:', 'blob:'].includes(protocol)
  } catch {
    return false
  }
}

/**
 * Enforce a fail-closed offline policy in the standalone spreadsheet app.
 * Electron's request hook blocks renderer/Chromium traffic; Node transport
 * guards cover main-process modules used by legacy AI helpers. No localhost
 * exception is made in packaged builds.
 */
export function installGoodOfficeOfflineMode(electronSession: Session): void {
  electronSession.webRequest.onBeforeRequest({ urls: ['<all_urls>'] }, (details, callback) => {
    callback({ cancel: !isGoodOfficeLocalResource(details.url) })
  })
  electronSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false)
  })
  electronSession.setPermissionCheckHandler(() => false)

  globalThis.fetch = (() => Promise.reject(new Error(OFFLINE_ERROR))) as typeof globalThis.fetch

  const deny = denyNetworkRequest as unknown as (...args: never[]) => never
  http.request = deny as typeof http.request
  http.get = deny as typeof http.get
  http.createServer = deny as typeof http.createServer
  https.request = deny as typeof https.request
  https.get = deny as typeof https.get
  net.connect = deny as typeof net.connect
  net.createConnection = deny as typeof net.createConnection
  net.createServer = deny as typeof net.createServer
  tls.connect = deny as typeof tls.connect
  tls.createServer = deny as typeof tls.createServer
  dgram.createSocket = deny as typeof dgram.createSocket

  dns.lookup = deny as typeof dns.lookup
  dns.lookupService = deny as typeof dns.lookupService
  dns.resolve = deny as typeof dns.resolve
  dns.resolve4 = deny as typeof dns.resolve4
  dns.resolve6 = deny as typeof dns.resolve6
  dns.resolveAny = deny as typeof dns.resolveAny
  dns.resolveCname = deny as typeof dns.resolveCname
  dns.resolveMx = deny as typeof dns.resolveMx
  dns.resolveNaptr = deny as typeof dns.resolveNaptr
  dns.resolveNs = deny as typeof dns.resolveNs
  dns.resolvePtr = deny as typeof dns.resolvePtr
  dns.resolveSoa = deny as typeof dns.resolveSoa
  dns.resolveSrv = deny as typeof dns.resolveSrv
  dns.resolveTxt = deny as typeof dns.resolveTxt
  dns.reverse = deny as typeof dns.reverse

  dns.promises.lookup = deny as typeof dns.promises.lookup
  dns.promises.lookupService = deny as typeof dns.promises.lookupService
  dns.promises.resolve = deny as typeof dns.promises.resolve
  dns.promises.resolve4 = deny as typeof dns.promises.resolve4
  dns.promises.resolve6 = deny as typeof dns.promises.resolve6
  dns.promises.resolveAny = deny as typeof dns.promises.resolveAny
  dns.promises.resolveCname = deny as typeof dns.promises.resolveCname
  dns.promises.resolveMx = deny as typeof dns.promises.resolveMx
  dns.promises.resolveNaptr = deny as typeof dns.promises.resolveNaptr
  dns.promises.resolveNs = deny as typeof dns.promises.resolveNs
  dns.promises.resolvePtr = deny as typeof dns.promises.resolvePtr
  dns.promises.resolveSoa = deny as typeof dns.promises.resolveSoa
  dns.promises.resolveSrv = deny as typeof dns.promises.resolveSrv
  dns.promises.resolveTxt = deny as typeof dns.promises.resolveTxt
  dns.promises.reverse = deny as typeof dns.promises.reverse
  syncBuiltinESMExports()
}
