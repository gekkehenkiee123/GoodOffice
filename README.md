# GoodOffice

A focused, offline-first spreadsheet editor for macOS.

GoodOffice is a fork of [GenOffice](https://github.com/genspark-ai/genoffice), retaining its Univer spreadsheet interface and Rust-backed XLSX editing engine while narrowing the desktop application to local spreadsheet work.

## What GoodOffice keeps

- Native local `.xlsx` workbook editing and saving
- Formulas, formatting, charts, sorting, filters and sheet management
- Undo/redo, autosave and recovery
- CSV import/export and PDF printing
- A modern ribbon-style spreadsheet interface

## What GoodOffice removes

- AI assistants, AI providers and AI login
- Genspark account authentication
- Telemetry and automatic update checks
- Remote links, web-query refresh and external image fetching
- The multi-app launcher, document and presentation editors, CLI and MCP integrations

## Offline policy

GoodOffice applies an application-level network-denial policy to Electron requests and Node networking APIs. Renderer CSP also denies remote connections. The local `genoffice-app://` renderer protocol, local files and in-memory data remain available.

Application-level blocking is not a substitute for OS-level verification. Before calling a release fully offline, monitor the packaged application on macOS and confirm that it opens, edits and saves workbooks without creating outbound connections. A machine-level firewall rule can provide a second enforcement layer.

## Build from source

Requirements: Node.js 22.12+, npm 10+, and Rust.

```bash
npm install
npm run dev:goodoffice
```

To package a universal macOS DMG and ZIP on a Mac:

```bash
rustup target add x86_64-apple-darwin aarch64-apple-darwin
npm run dist:goodoffice:mac
```

See [apps/sheets/README.md](apps/sheets/README.md) for details.

## License and attribution

GoodOffice retains the upstream Apache-2.0 license and notices. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
