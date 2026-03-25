<p align="center">
  <img src="public/logo.svg" alt="BackendKit" width="80" />
</p>

<h1 align="center">BackendKit</h1>

<p align="center">
  Every tool a backend dev Googles daily, in one place, client-side.
</p>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/status-in%20development-orange?style=flat-square" alt="Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  </a>
  <img src="https://visitor-badge.laobi.icu/badge?page_id=MaheshPawaar.backendkit" alt="Visitors" />
  <a href="#">
    <img src="https://img.shields.io/badge/no%20server-100%25%20client--side-black?style=flat-square" alt="Client-side" />
  </a>
</p>

---

A privacy-first collection of browser-based tools built for backend and API engineers. No server, no tracking, no data leaves your browser. Everything runs locally.

**Live:** [backendkit.maheshpawar.me](https://backendkit.maheshpawar.me)

## Features

- **100% Client-Side** - Your data never leaves the browser. No API calls, no server, no telemetry.
- **Instant Feedback** - Every tool processes on keystroke. No submit buttons, no loading spinners.
- **Copy with One Click** - Every output has a copy button with toast confirmation.
- **Keyboard First** - `Cmd+K` / `Ctrl+K` to search and jump to any tool instantly.
- **Dark Mode Default** - Built for developers who live in dark terminals. Light mode available.
- **Mobile Friendly** - Responsive layout with a slide-out sidebar on smaller screens.

## Tools

### Available Now

| Tool               | What it does                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| **JSON Formatter** | Format, minify, and validate JSON payloads with configurable indentation |
| **JWT Decoder**    | Decode header and payload, inspect claims, check token expiry            |
| **Base64 Codec**   | Encode and decode Base64 strings with full Unicode support               |
| **UUID Generator** | Generate UUID v4 (random) and v7 (timestamp-sortable) identifiers        |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/MaheshPawaar/backend-toolkit.git
cd backend-toolkit

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

| Layer         | Choice                                                                                 |
| ------------- | -------------------------------------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org) (App Router)                                          |
| Language      | JavaScript                                                                             |
| UI Components | [shadcn/ui](https://ui.shadcn.com) (base-nova theme)                                   |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com)                                             |
| Icons         | [Lucide React](https://lucide.dev)                                                     |
| Fonts         | [Inter](https://rsms.me/inter/) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) |
| Toasts        | [Sonner](https://sonner.emilkowal.dev)                                                 |
| Theme         | [next-themes](https://github.com/pacocoursey/next-themes)                              |

No backend. No database. No analytics SDK. Pure static site.

## Adding a New Tool

BackendKit uses a **tool registry pattern** that makes adding tools straightforward:

1. Create a new folder at `app/tools/your-tool-name/page.js`
2. Add an entry to `data/tool-registry.js` with name, description, category, route, and icon
3. Set `ready: true` when the tool is complete

The landing page, sidebar, and search menu all generate automatically from the registry.

## Design Principles

1. **Privacy first** - All processing happens in the browser using native APIs (Web Crypto, TextEncoder, atob/btoa).
2. **Zero friction** - No sign-ups, no pop-ups, no cookie banners. Open the tool and start using it.
3. **Ship small, ship often** - Tools are released in phases. Each one is self-contained and independently useful.
4. **Explain, don't just convert** - Each tool includes a short description of what it does and when you would use it.

## Project Structure

```
backendkit/
├── app/                    # Next.js App Router pages
│   ├── page.js             # Landing page
│   └── tools/              # One folder per tool
├── components/
│   ├── ui/                 # shadcn/ui components (auto-generated)
│   ├── layout/             # Header, mobile nav, theme toggle
│   └── shared/             # ToolLayout, CopyButton, CommandMenu
├── data/
│   └── tool-registry.js    # Central registry of all tools
├── hooks/                  # Custom React hooks
└── lib/                    # Utilities
```

## Contributing

Contributions are welcome! Whether it is a new tool, a bug fix, or a UI improvement, feel free to open an issue or submit a pull request.

To request a new tool, [open an issue](../../issues/new) with the tool name, what it should do, and which category it belongs to.

## License

MIT © 2026 Mahesh Pawar

---

<p align="center">
  Built by <a href="https://github.com/MaheshPawaar">Mahesh Pawar</a>
  <br />
  <sub>No data leaves your browser. Ever.</sub>
</p>
