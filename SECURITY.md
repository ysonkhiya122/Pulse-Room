# Security Policy

## 1. Secrets Management
- No API keys or secrets may ever be committed to the repository or client bundle.
- Only public variables prefixed with `VITE_` reach the browser.
- CI automatically validates this invariant via `scripts/check-env.ts`.

## 2. Prompt Injection Defense
- Voice agent tools are strictly **read-only** and accept schema-validated arguments.
- The voice agent worker is hard-coded never to execute write operations or disclose keys or system prompts.

## 3. Reporting a Vulnerability
Please report security issues or leaks privately to the repository owner via GitHub private vulnerability reporting (Security tab → Report a vulnerability).
