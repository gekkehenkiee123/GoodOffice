# GoodOffice

GoodOffice is a focused, offline-first desktop spreadsheet editor for macOS, based on the GenOffice Sheets codebase.

## Goals

- Edit local Excel workbooks directly in `.xlsx` format.
- Keep the Univer spreadsheet interface and Rust XLSX editing engine.
- Keep ordinary spreadsheet editing, formulas, sorting, filtering, formatting, charts, sheet management, printing, and local file operations.
- Remove AI/account features from the standalone app's active UI and IPC registration.
- Deny remote network access from packaged and development builds.

## Development

Requirements: Node.js 22.12+, npm 10+, Rust toolchain.

```bash
npm install
npm run dev:goodoffice
```

## macOS package

On macOS, with both Apple Silicon and Intel Rust targets installed:

```bash
rustup target add x86_64-apple-darwin aarch64-apple-darwin
npm run dist:goodoffice:mac
```

## Offline policy

GoodOffice installs a network-denial policy at startup:
- Electron session requests are blocked except local `goodoffice://`, `file:`, and `data:` resources.
- Renderer Content Security Policy does not allow remote connections.
- Main-process global fetch and Node HTTP(S), TCP/TLS and DNS transports are replaced with rejecting implementations.
- OS permissions are denied.
- External links and workbook web-query refreshes are disabled.
- The standalone app does not start the local capture/debug HTTP server.

These are application-level controls. Before declaring a packaged binary verified offline, monitor its network activity on macOS and confirm no unexpected connections. Spreadsheet content that depends on external web data will not refresh.

## Provenance and licensing

GoodOffice is a fork of [GenOffice](https://github.com/genspark-ai/genoffice), licensed under Apache-2.0. Original notices and third-party license files must be retained. See `LICENSE` and `NOTICE`.
