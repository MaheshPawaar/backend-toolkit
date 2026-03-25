# Contributing to backendKit

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

```bash
git clone https://github.com/MaheshPawaar/backend-toolkit.git
cd backend-toolkit
npm install
npm run dev
```

## Adding a New Tool

1. Create `app/tools/your-tool-name/page.js`
2. Add an entry to `data/tool-registry.js`
3. Follow the existing tool pattern: `"use client"`, `<ToolLayout>`, `<CopyButton>`, sample data button, clear button
4. Set `ready: true` when complete
5. Run `npm run lint` and `npm run build` before submitting

## Pull Requests

- Create a feature branch from `main`
- Keep PRs focused — one feature or fix per PR
- Make sure `npm run lint` and `npm run build` pass
- Write a clear PR title and description

## Reporting Bugs

Open an issue with:
- What you expected to happen
- What actually happened
- Browser and OS info
- Screenshots if applicable

## Code Style

- JavaScript (no TypeScript)
- Tailwind CSS for styling
- All tool logic must be client-side only — no server actions, no API routes
- Use Web Crypto API and native browser APIs before pulling in libraries

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
