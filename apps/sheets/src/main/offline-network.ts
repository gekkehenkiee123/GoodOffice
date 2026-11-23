import { syncBuiltinESMExports } from 'node:module'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'
import tls from 'node:tls'
import dns from 'node:dns'
import dgram from 'node:dgram'
import type { Session } from 'electron'

const OFFLINE_ERROR = 'GoodOffice is offline: network access is disabled.'

function blockedRequest(): never {
  throw new Error(OFFLINE_ERROR)
}

/**
 * Install a fail-closed network policy for the standalone GoodOffice app.
 *
 * The Electron session hook blocks browser/network-service requests. The
 * global fetch and Node transport guards cover main-process code that bypasses
 * Chromium. Local app resources use the genoffice-app:// protocol and are not
 * affected. No localhost exception is made in packaged or development builds.
 */
export function installOfflineNetworkLock(electronSession: Session): void {
  electronSession.webRequest.onBeforeRequest({ urls: ['<all_urls>'] }, (details, callback) => {
    let allowed = false
    try {
      const protocol = new URL(details.url).protocol
      allowed = protocol === 'genoffice-app:' || protocol === 'file:' || protocol === 'data:'
    } catch {
      allowed = false
    }
    callback({ cancel: !allowed })
  })

  electronSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false)
  })
  electronSession.setPermissionCheckHandler(() => false)

  globalThis.fetch = (() => Promise.reject(new Error(OFFLINE_ERROR))) as typeof globalThis.fetch

  // Block built-in Node networking too. Sync named ESM exports after replacing
  // the mutable CommonJS-backed module methods.
  const deny = blockedRequest as unknown as (...args: never[]) => never
  http.request = deny as typeof http.request
  http.createServer = deny as typeof http.createServer
  http.get = deny as typeof http.get
  https.request = deny as typeof https.request
  https.get = deny as typeof https.get
  net.connect = deny as typeof net.connect
  net.createServer = deny as typeof net.createServer
  net.createConnection = deny as typeof net.createConnection
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
